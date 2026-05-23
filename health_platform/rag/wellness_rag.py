"""
Wellness RAG — Retrieval Augmented Generation for diet, exercise, and lifestyle queries.
Attaches to the Diet Expert, Wellness Expert, and Wellness Manager.
"""
import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings  import HuggingFaceEmbeddings
from langchain.text_splitter         import RecursiveCharacterTextSplitter
from langchain_core.documents        import Document
from config.settings import DEBUG

# ── Config ────────────────────────────────────────────────────────────────────
RAG_PERSIST_DIR = "rag/db/wellness"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K           = 3

# ── Embeddings ────────────────────────────────────────────────────────────────
def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

# ── Vector Store ──────────────────────────────────────────────────────────────
def get_wellness_vectorstore():
    """Load existing wellness vector store or create empty one."""
    os.makedirs(RAG_PERSIST_DIR, exist_ok=True)
    return Chroma(
        persist_directory=RAG_PERSIST_DIR,
        embedding_function=get_embeddings(),
        collection_name="wellness_knowledge",
    )

# ── Index documents ───────────────────────────────────────────────────────────
def index_wellness_documents(documents: list[str], metadatas: list[dict] = None):
    """
    Add wellness/diet/exercise documents to the RAG index.

    Example:
        index_wellness_documents(
            documents=["Mediterranean diet for cardiovascular health..."],
            metadatas=[{"source": "WHO Nutrition Guide", "category": "diet"}]
        )
    """
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = []
    for i, text in enumerate(documents):
        chunks = splitter.split_text(text)
        meta   = metadatas[i] if metadatas and i < len(metadatas) else {}
        for chunk in chunks:
            docs.append(Document(page_content=chunk, metadata=meta))

    vs = get_wellness_vectorstore()
    vs.add_documents(docs)
    if DEBUG:
        print(f"[WellnessRAG] Indexed {len(docs)} chunks from {len(documents)} documents.")

# ── Retrieve ──────────────────────────────────────────────────────────────────
def retrieve_wellness_context(query: str) -> str:
    """
    Retrieve relevant wellness/diet/exercise knowledge for a given query.
    Returns formatted context string to inject into expert prompts.
    """
    try:
        vs      = get_wellness_vectorstore()
        results = vs.similarity_search(query, k=TOP_K)
        if not results:
            return ""
        context = "\n\n".join(
            f"[Source: {doc.metadata.get('source', 'Wellness KB')}]\n{doc.page_content}"
            for doc in results
        )
        if DEBUG:
            print(f"[WellnessRAG] Retrieved {len(results)} chunks for query: {query[:50]}...")
        return context
    except Exception as e:
        if DEBUG:
            print(f"[WellnessRAG] Retrieval error: {e}")
        return ""