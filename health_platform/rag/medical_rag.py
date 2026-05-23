"""
Medical RAG — Retrieval Augmented Generation for clinical queries.
Attaches to the Clinical Expert and Medical Manager.
Uses ChromaDB as the vector store for medical knowledge retrieval.
"""
import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings  import HuggingFaceEmbeddings
from langchain.text_splitter         import RecursiveCharacterTextSplitter
from langchain_core.documents        import Document
from config.settings import DEBUG

# ── Config ────────────────────────────────────────────────────────────────────
RAG_PERSIST_DIR  = "rag/db/medical"
EMBEDDING_MODEL  = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K            = 3  # number of relevant chunks to retrieve

# ── Embeddings ────────────────────────────────────────────────────────────────
def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

# ── Vector Store ──────────────────────────────────────────────────────────────
def get_medical_vectorstore():
    """Load existing medical vector store or create empty one."""
    os.makedirs(RAG_PERSIST_DIR, exist_ok=True)
    return Chroma(
        persist_directory=RAG_PERSIST_DIR,
        embedding_function=get_embeddings(),
        collection_name="medical_knowledge",
    )

# ── Index documents ───────────────────────────────────────────────────────────
def index_medical_documents(documents: list[str], metadatas: list[dict] = None):
    """
    Add medical documents to the RAG index.
    Call this to populate the knowledge base.

    Example:
        index_medical_documents(
            documents=["Type 2 diabetes management guidelines..."],
            metadatas=[{"source": "ADA Guidelines 2024", "category": "diabetes"}]
        )
    """
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = []
    for i, text in enumerate(documents):
        chunks = splitter.split_text(text)
        meta   = metadatas[i] if metadatas and i < len(metadatas) else {}
        for chunk in chunks:
            docs.append(Document(page_content=chunk, metadata=meta))

    vs = get_medical_vectorstore()
    vs.add_documents(docs)
    if DEBUG:
        print(f"[MedicalRAG] Indexed {len(docs)} chunks from {len(documents)} documents.")

# ── Retrieve ──────────────────────────────────────────────────────────────────
def retrieve_medical_context(query: str) -> str:
    """
    Retrieve relevant medical knowledge for a given query.
    Returns formatted context string to inject into expert prompts.
    """
    try:
        vs      = get_medical_vectorstore()
        results = vs.similarity_search(query, k=TOP_K)
        if not results:
            return ""
        context = "\n\n".join(
            f"[Source: {doc.metadata.get('source', 'Medical KB')}]\n{doc.page_content}"
            for doc in results
        )
        if DEBUG:
            print(f"[MedicalRAG] Retrieved {len(results)} chunks for query: {query[:50]}...")
        return context
    except Exception as e:
        if DEBUG:
            print(f"[MedicalRAG] Retrieval error: {e}")
        return ""