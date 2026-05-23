# 🏥 AI Health Platform — Comprehensive Documentation

A **multi-agent AI system** for intelligent health management, orchestrating specialized experts, companions, and guardrails to provide personalized clinical, nutritional, and wellness guidance. Built with **LangGraph**, **ChromaDB**, and specialized LLM backends (Orinn for clinical, Qwen for companions).

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & System Design](#architecture--system-design)
3. [Directory Structure](#directory-structure)
4. [Core Components](#core-components)
5. [Data Management & Database](#data-management--database)
6. [LLM Configuration](#llm-configuration)
7. [Workflow & Data Flow](#workflow--data-flow)
8. [Getting Started](#getting-started)
9. [API Reference](#api-reference)
10. [Testing](#testing)

---

## 🎯 Project Overview

### What is the AI Health Platform?

The **AI Health Platform** is an intelligent, multi-stakeholder health management system that:

- **Accepts queries from 4 stakeholder types**: users, dieticians, wellness experts, and clinicians
- **Routes queries** to the most appropriate expert agent based on query category
- **Processes health data** using specialized AI agents (clinical, nutritional, behavioral, report analysis)
- **Orchestrates responses** by compiling expert outputs into safe, actionable guidance
- **Maintains persistent memory** of each patient's health history via MemPalace (ChromaDB)
- **Enforces guardrails** through an auditor agent to detect anomalies and flag safety concerns
- **Supports multiple LLM backends** for different expert roles (Orinn for clinical, Qwen for companions)

### Key Features

✅ **Multi-stakeholder support** — user, dietician, wellness expert, clinician  
✅ **Intelligent query routing** — automatic categorization (clinical, nutrition, exercise, habits, reports)  
✅ **Expert specialization** — diet, wellness, clinical, behavior tracking, report management  
✅ **Persistent memory** — ChromaDB-backed MemPalace for patient histories  
✅ **Safety guardrails** — auditor agent detects anomalies and flags suspicious patterns  
✅ **RAG integration** — medical and wellness knowledge bases  
✅ **Interactive CLI** — start sessions with any stakeholder type  
✅ **Programmatic API** — `single_query()` for backend integration

---

## 🏗️ Architecture & System Design

### High-Level Flow

```
User Input (any stakeholder type)
    ↓
[COMPANION LAYER]
    ├─ Classify query into category
    ├─ Check if in-scope
    └─ Route to appropriate expert
    ↓
[EXPERT LAYER]
    ├─ Diet Expert (nutrition queries)
    ├─ Wellness Expert (exercise, habits)
    ├─ Clinical Expert (medical, symptoms)
    ├─ Behavior Tracker (lifestyle patterns)
    └─ Report Manager (lab reports, documents)
    ↓
[ORCHESTRATION LAYER]
    ├─ Compile expert outputs
    ├─ Clinical queries → Orinn compilation
    ├─ Non-clinical queries → direct pass-through
    └─ Emergency escalation detection
    ↓
[GUARDRAIL LAYER]
    ├─ Audit flag safety concerns
    ├─ Detect anomalies
    └─ Verify clinical approval
    ↓
Final Response → User
```

### System Components

| Component               | Role                                     | LLM Backend  |
| ----------------------- | ---------------------------------------- | ------------ |
| **User Companion**      | Natural language interface for end users | Qwen 2.5-14B |
| **Dietician Companion** | Interface for dieticians                 | Qwen 2.5-14B |
| **Wellness Companion**  | Interface for wellness experts           | Qwen 2.5-14B |
| **Clinician Companion** | Interface for clinicians                 | Qwen 2.5-14B |
| **Diet Expert**         | Nutrition analysis & meal planning       | Qwen 2.5-14B |
| **Wellness Expert**     | Exercise, fitness, lifestyle guidance    | Qwen 2.5-14B |
| **Clinical Expert**     | Medical diagnosis, symptom analysis      | Orinn 1.7    |
| **Behavior Tracker**    | Habit monitoring, lifestyle patterns     | Qwen 2.5-14B |
| **Report Manager**      | Lab report parsing & summarization       | Qwen 2.5-14B |
| **Expert Orchestrator** | Compiles expert outputs, brain routing   | Orinn 1.7    |
| **Auditor**             | Safety checks, anomaly detection         | Orinn 1.7    |
| **DMH Agent**           | Detailed medical history management      | Qwen 2.5-14B |
| **ORINN Summary Agent** | Clinical summary generation              | Orinn 1.7    |

---

## 📁 Directory Structure

```
health_platform/
│
├── main.py                          # ✨ ENTRY POINT — Interactive CLI & single_query API
│
├── config/
│   └── settings.py                  # 🔧 Global configuration, API keys, model names
│
├── graph/                           # 🧠 LangGraph workflow definitions
│   ├── master_graph.py              # Complete end-to-end pipeline
│   ├── companion_graph.py           # Companion workflow sub-graph
│   ├── expert_graph.py              # Expert agent sub-graph
│   ├── state.py                     # HealthState TypedDict (shared state structure)
│   └── document_pipeline.py         # Document processing pipeline
│
├── agents/
│   ├── companions/                  # 👥 Stakeholder interaction layer
│   │   ├── base_companion.py        # Base class for all companions
│   │   ├── user_companion.py        # End user interface
│   │   ├── dietician_companion.py   # Dietician interface
│   │   ├── wellness_companion.py    # Wellness expert interface
│   │   └── clinician_companion.py   # Clinician interface
│   │
│   ├── experts/                     # 🔬 Specialized AI agents
│   │   ├── base_expert.py           # Base class for all experts
│   │   ├── diet_expert.py           # Nutrition & meal planning
│   │   ├── wellness_expert.py       # Exercise & fitness
│   │   ├── clinical_expert.py       # Medical diagnosis & analysis
│   │   ├── behaviour_tracker.py     # Habit & lifestyle tracking
│   │   ├── report_manager.py        # Lab report processing
│   │   ├── dmh_agent.py             # Detailed medical history
│   │   └── orinn_summary_agent.py   # Clinical summary generation
│   │
│   ├── orchestration/               # 🎼 Compilation & brain routing
│   │   ├── expert_orchestrator.py   # Master controller, output compilation
│   │   ├── arrangement_agent.py     # Data arrangement for DB push
│   │   ├── debate_agent.py          # Multi-expert debate resolution
│   │   ├── medical_manager.py       # Medical data management
│   │   └── wellness_manager.py      # Wellness data management
│   │
│   └── guardrails/
│       └── auditor.py               # 🛡️ Safety checks & anomaly detection
│
├── rag/                             # 💾 Retrieval-Augmented Generation
│   ├── mempalace.py                 # Central memory system (ChromaDB-based)
│   ├── medical_rag.py               # Medical knowledge base RAG
│   ├── wellness_rag.py              # Wellness knowledge base RAG
│   └── db/
│       └── mempalace/               # ChromaDB storage
│           └── PT-001/              # Patient 001 data
│               ├── chroma.sqlite3   # SQLite database file
│               └── [embedding vectors]
│
├── tools/
│   ├── mcp_tools.py                 # Model Context Protocol tools
│   └── mcp_document_tools.py        # Document processing tools
│
├── tests/
│   ├── sample_medical_report.txt    # Sample lab report for testing
│   ├── simulate_user.py             # User interaction simulator
│   ├── test_all_companions.py       # Test all 4 companions
│   ├── test_debate.py               # Test debate agent
│   ├── test_document_pipeline.py    # Test document processing
│   ├── test_e2e.py                  # End-to-end integration tests
│   ├── test_experts.py              # Test expert agents
│   └── test_user_companion.py       # Test user companion
│
├── requirements.txt                 # 📦 Python dependencies
├── README.md                        # Original project README
├── README_COMPREHENSIVE.md          # This file
└── push_all.ps1                     # PowerShell deployment script

```

---

## 🔧 Core Components

### 1. **State Management** (`graph/state.py`)

The `HealthState` TypedDict defines the shared state passed through the entire pipeline:

```python
HealthState = TypedDict(
    user_id: str,                    # Unique patient identifier
    stakeholder_type: str,           # user | dietician | wellness_expert | clinician
    messages: list,                  # Chat history (LangChain messages)
    current_query: str,              # Latest user input
    query_category: str,             # clinical | nutrition | exercise | report_submission | habits
    routed_to: str,                  # Which expert agent handled this
    is_valid_query: bool,            # True = in-scope, False = out-of-scope

    # Expert outputs
    diet_response: str,              # Diet expert's response
    wellness_response: str,          # Wellness expert's response
    clinical_response: str,          # Clinical expert's response
    behaviour_data: dict,            # Behavior tracking output
    report_data: dict,               # Report analysis output

    # Orchestration
    orchestrator_decision: str,      # moe | orion (brain routing)
    final_response: str,             # Compiled response back to user

    # Clinical tracking
    clinical_summary: str,           # Running clinical summary
    clinical_approved: bool,         # Clinician approval status

    # Guardrails
    audit_flag: bool,                # True = safety concern detected
    audit_notes: str,                # Auditor's notes if flagged

    # Database operations
    db_push_ready: bool,             # Safe to push to database
    db_push_done: bool,              # Push completed successfully
)
```

---

### 2. **Companion Layer** (`agents/companions/`)

**Purpose**: Natural language interface for each stakeholder type.

**Base Companion Features**:

- **Query Classification**: Uses Qwen to categorize incoming queries (clinical, nutrition, exercise, habits, reports, out-of-scope)
- **Response Generation**: Generates contextual responses based on companion persona
- **Response Cleaning**: Strips Orinn thinking tokens to deliver clean text
- **History Management**: Maintains last 6 messages for context

**4 Companion Types**:

1. **User Companion** - Friendly, accessible language for end users
2. **Dietician Companion** - Professional nutritionist perspective
3. **Wellness Companion** - Fitness and lifestyle expert perspective
4. **Clinician Companion** - Medical professional communication style

---

### 3. **Expert Layer** (`agents/experts/`)

**Purpose**: Specialized AI agents that process routed queries.

**Base Expert Features**:

- **Dual LLM Support**: Clinical experts use Orinn, others use Qwen
- **Fallback Mechanism**: Falls back to Qwen if Orinn fails
- **Context Injection**: Embeds clinical summaries, behavior data, or other context
- **Response Cleaning**: Strips Orinn internal reasoning
- **Structured Output**: Each expert stores results in state (diet_response, clinical_response, etc.)

**5 Expert Types**:

1. **Diet Expert** - Nutrition analysis, meal planning, dietary recommendations
2. **Wellness Expert** - Exercise routines, fitness plans, lifestyle guidance
3. **Clinical Expert** - Medical diagnosis, symptom analysis, clinical recommendations (uses Orinn)
4. **Behavior Tracker** - Habit monitoring, lifestyle pattern analysis, behavior change strategies
5. **Report Manager** - Lab report parsing, document extraction, medical record summarization

**Additional Agents**:

- **DMH Agent** - Detailed Medical History extraction and management
- **ORINN Summary Agent** - Clinical summary generation using Orinn

---

### 4. **Orchestration Layer** (`agents/orchestration/`)

**Purpose**: Compiles expert outputs and routes responses intelligently.

**Components**:

1. **Expert Orchestrator** (`expert_orchestrator.py`)
   - Routes between "moe" brain (multi-expert, non-clinical) and "orion" brain (clinical)
   - For clinical queries: Uses Orinn to safely compile expert output
   - For non-clinical queries: Direct pass-through of expert output
   - Emergency escalation detection (HIGH/EMERGENCY urgency)

2. **Arrangement Agent** (`arrangement_agent.py`)
   - Formats expert outputs for database push
   - Verifies clinical approval before pushing

3. **Debate Agent** (`debate_agent.py`)
   - Multi-expert consensus when conflicting opinions arise
   - Resolves disagreements between experts

4. **Medical Manager** (`medical_manager.py`)
   - Manages clinical data flow
   - Coordinates with clinical experts

5. **Wellness Manager** (`wellness_manager.py`)
   - Manages wellness/lifestyle data
   - Coordinates with wellness experts

---

### 5. **Guardrail Layer** (`agents/guardrails/`)

**Auditor Agent** (`auditor.py`)

**Safety Checks**:

- Detects anomalies in responses
- Flags suspicious patterns or harmful content
- Verifies clinical approval for sensitive queries
- Checks for emergency situations
- Validates data before database push

**Output**:

- `audit_flag`: Boolean flag if concern detected
- `audit_notes`: Human-readable explanation of issue

---

## 💾 Data Management & Database

### MemPalace — Central Memory System

**Architecture**: Palace → Wing (agent type) → Room (topic) → Content

**Location**: `rag/db/mempalace/`

**Backend**: **ChromaDB** (Local SQLite + Vector Embeddings)

**Structure**:

```
MemPalace (per patient):
├── Wings (Agent Types)
│   ├── user_companion
│   ├── dietician_companion
│   ├── wellness_companion
│   ├── clinician_companion
│   ├── diet_expert
│   ├── wellness_expert
│   ├── clinical_expert
│   ├── behaviour_tracker
│   ├── report_manager
│   ├── dmh_agent
│   └── orinn_summary
│
└── Rooms (Topics per Wing)
    ├── dmh (Detailed Medical History)
    ├── clinical_summary
    ├── diet_plan
    ├── exercise_plan
    ├── behaviour (Behavior Tracking)
    ├── reports (Uploaded Reports)
    └── conversations (Chat History)
```

**How It Works**:

1. **Storage**: Each agent stores its outputs in MemPalace

   ```python
   mempalace.store(
       patient_id="PT-001",
       content="User reports headache for 3 days",
       wing="user_companion",
       room="conversations",
   )
   ```

2. **Retrieval**: Agents query relevant data

   ```python
   clinical_summary = mempalace.retrieve(
       patient_id="PT-001",
       room="clinical_summary"
   )
   ```

3. **Database File Structure**:
   ```
   rag/db/mempalace/PT-001/
   ├── chroma.sqlite3              # Main ChromaDB SQLite file
   ├── [patient_PT-001]/           # Embedding vectors & metadata
   └── [embeddings]
   ```

**Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` (HuggingFace)

**Key Advantages**:

- ✅ Vector search for semantic similarity
- ✅ Persistent storage (survives restarts)
- ✅ Patient isolation (separate DB per patient)
- ✅ No external database required (local SQLite)
- ✅ Production-ready and scalable

---

## 🤖 LLM Configuration

**Located in**: `config/settings.py`

### LLM Backends

| Model            | Use Case                               | Provider     |
| ---------------- | -------------------------------------- | ------------ |
| **Orinn 1.7**    | Clinical expert, orchestrator, auditor | Orinn API    |
| **Qwen 2.5-14B** | Companions, wellness, diet, behavior   | vLLM (Local) |

### Configuration

```python
# Orinn Configuration (Clinical)
ORINN_API_KEY = os.getenv("ORINN_API_KEY")
ORINN_BASE_URL = os.getenv("ORINN_BASE_URL", "https://api-call.orinn.ai/v1")
CLINICAL_MODEL = "Orinn-1.7"

# Qwen Configuration (Companions + Wellness)
QWEN_API_KEY = os.getenv("QWEN_API_KEY", "dummy")
QWEN_BASE_URL = os.getenv("QWEN_BASE_URL", "http://localhost:8000/v1")
COMPANION_MODEL = "qwen2.5-14b"

# Query Categories for Routing
QUERY_CATEGORIES = [
    "clinical",
    "nutrition",
    "exercise",
    "report_submission",
    "habits",
]

# Stakeholder Types
STAKEHOLDERS = ["user", "dietician", "wellness_expert", "clinician"]
```

### Model Assignment

- **Orinn LLM** (temperature=0.1-0.3):
  - Clinical Expert
  - Medical Manager
  - Orchestrator (clinical compilation only)
  - Auditor

- **Qwen LLM** (temperature=0.3):
  - All 4 Companions
  - Diet Expert
  - Wellness Expert
  - Behavior Tracker
  - Report Manager
  - DMH Agent

---

## 🔄 Workflow & Data Flow

### Complete Query Processing Flow

```
1. USER INPUT
   ├─ User ID: "PT-001"
   ├─ Stakeholder: "user"
   ├─ Query: "I have a headache and dizziness"
   └─ Clinical Summary: (optional) existing summary

2. COMPANION LAYER
   ├─ Select companion based on stakeholder_type
   │  (route_to_companion → user_companion)
   ├─ Classify query
   │  (CLASSIFIER_LLM → "clinical")
   ├─ Check if in-scope
   │  (is_valid_query = True)
   └─ Generate initial response

3. EXPERT ROUTING
   ├─ Query category: "clinical"
   ├─ Route to: clinical_expert
   └─ State update: routed_to = "clinical_expert"

4. EXPERT PROCESSING
   ├─ Clinical Expert receives:
   │  ├─ Query: "I have a headache and dizziness"
   │  ├─ History: last 6 messages
   │  ├─ Context: clinical summary, previous diagnoses
   │  └─ LLM: Orinn 1.7 (temperature=0.3)
   ├─ Generate clinical assessment
   ├─ Store response: state.clinical_response
   └─ Update MemPalace wing: clinical_expert/conversations

5. ORCHESTRATION
   ├─ Orchestrator receives expert output
   ├─ Detect if emergency (HIGH/EMERGENCY urgency)
   ├─ For clinical: Use Orinn to compile safely
   │  (CLINICAL_ORCHESTRATOR_PROMPT)
   ├─ Output: clean, safe response
   └─ State update: final_response

6. GUARDRAILS
   ├─ Auditor receives:
   │  ├─ Query
   │  ├─ Expert responses
   │  ├─ Final response
   │  └─ Clinical summary
   ├─ Safety checks:
   │  ├─ Anomaly detection
   │  ├─ Harmful content scan
   │  ├─ Clinical approval verification
   │  └─ Emergency escalation check
   ├─ If safe: audit_flag = False
   ├─ If concern: audit_flag = True, audit_notes = "..."
   └─ State update: audit_flag, audit_notes

7. RESPONSE DELIVERY
   ├─ If audit_flag = True:
   │  └─ Flag for review before user delivery
   ├─ Otherwise:
   │  └─ Send final_response to user
   ├─ Update MemPalace: conversations room
   └─ Optionally push to external DB

8. PERSISTENCE
   ├─ Store in MemPalace:
   │  ├─ wing: all relevant wings
   │  ├─ room: conversations + specialized rooms
   │  └─ content: query + response + context
   └─ If db_push_ready:
       └─ Format via Arrangement Agent → External DB
```

### State Updates Through Pipeline

```
Initial State
    ↓
[User Companion] → query_category, is_valid_query, routed_to
    ↓
[Expert Agent] → diet/wellness/clinical_response, behaviour_data, report_data
    ↓
[Orchestrator] → orchestrator_decision, final_response
    ↓
[Auditor] → audit_flag, audit_notes, db_push_ready
    ↓
Final State (returned to user)
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- pip or conda
- API keys for Orinn and optionally Qwen
- SSH tunnel to vLLM server (for local Qwen) OR cloud Qwen endpoint

### Installation

1. **Clone/Navigate to workspace**:

   ```bash
   cd c:\Users\hp\OneDrive\Desktop\health_platform
   ```

2. **Create virtual environment**:

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** (create `.env` file):

   ```
   GOOGLE_API_KEY=your_google_key
   ORINN_API_KEY=your_orinn_key
   ORINN_BASE_URL=https://api-call.orinn.ai/v1
   QWEN_API_KEY=dummy
   QWEN_BASE_URL=http://localhost:8000/v1
   APP_ENV=development
   ```

5. **Set up SSH tunnel for Qwen** (if using local vLLM):
   ```bash
   ssh -L 8000:localhost:8000 dgx-i-molsys@210.212.207.65 -N
   ```

### Running the Platform

**Interactive Mode** (CLI):

```bash
python main.py
```

**Programmatic Mode** (Python API):

```python
from main import single_query

result = single_query(
    user_id="PT-001",
    stakeholder_type="user",
    query="I have a headache and dizziness",
    clinical_summary="Patient has history of migraines"
)

print(result["final_response"])
print(f"Audit flag: {result['audit_flag']}")
```

---

## 📡 API Reference

### Main Entry Points

#### 1. `interactive_session()`

Start an interactive CLI session. User selects stakeholder type, user ID, and can ask multiple queries.

```python
from main import interactive_session

interactive_session()
```

**Input Prompts**:

- Stakeholder type (default: "user")
- User ID (default: "default_user")
- Optional existing clinical summary

**Output**:

```
==============================================================
PLATFORM RESPONSE
==============================================================
Category   : clinical
Routed to  : clinical_expert
Brain used : orion
Audit flag : False
DB ready   : True
Approved   : False
--------------------------------------------------------------
RESPONSE:
[Final compiled response here]
==============================================================
```

#### 2. `single_query(user_id, stakeholder_type, query, clinical_summary=None)`

Programmatic API for backend integration.

```python
from main import single_query

result = single_query(
    user_id="PT-001",
    stakeholder_type="user",
    query="What should I eat after my surgery?",
    clinical_summary="Post-operative day 3, diabetes management critical"
)

# Access result fields:
result["query_category"]          # str: "nutrition"
result["routed_to"]               # str: "diet_expert"
result["orchestrator_decision"]   # str: "moe"
result["diet_response"]           # str: expert response
result["final_response"]          # str: compiled response
result["audit_flag"]              # bool: True if flagged
result["audit_notes"]             # str: auditor notes
result["db_push_ready"]           # bool: safe to push
result["clinical_approved"]       # bool: clinician approved
```

---

### Master Graph Nodes

**Located in**: `graph/master_graph.py`

The master graph executes this node sequence:

```
[Companion Selection]
    ↓
[Companion Response]
    ↓
[Expert Routing]
    ↓
[Expert Processing]
    ↓
[Orchestrator]
    ↓
[Auditor]
    ↓
[END]
```

---

### MemPalace API

**Located in**: `rag/mempalace.py`

#### Store Data

```python
from rag.mempalace import MemPalace

mp = MemPalace()

mp.store(
    patient_id="PT-001",
    content="User reports improved mobility after exercise",
    wing="wellness_expert",
    room="exercise_plan",
    source="expert_feedback",
    metadata={"date": "2024-01-15", "confidence": 0.95}
)
```

#### Retrieve Data

```python
clinical_history = mp.retrieve(
    patient_id="PT-001",
    room="clinical_summary",
    top_k=5  # Return top 5 similar documents
)
```

#### Semantic Search

```python
results = mp.search(
    patient_id="PT-001",
    query="Does patient have diabetes?",
    top_k=3
)
```

---

## 🧪 Testing

**Test Suite Location**: `tests/`

### Available Tests

```bash
# Test all companions with sample queries
python tests/test_all_companions.py

# Test end-to-end workflow
python tests/test_e2e.py

# Test expert agents individually
python tests/test_experts.py

# Test user companion specifically
python tests/test_user_companion.py

# Test debate agent (multi-expert consensus)
python tests/test_debate.py

# Test document pipeline (report parsing)
python tests/test_document_pipeline.py

# Simulate realistic user interactions
python tests/simulate_user.py
```

### Test Files

| File                        | Purpose                                |
| --------------------------- | -------------------------------------- |
| `test_all_companions.py`    | Verify all 4 companions work correctly |
| `test_e2e.py`               | End-to-end pipeline integration        |
| `test_experts.py`           | Individual expert agent validation     |
| `test_user_companion.py`    | User companion specific testing        |
| `test_debate.py`            | Multi-expert debate resolution         |
| `test_document_pipeline.py` | Document parsing and extraction        |
| `simulate_user.py`          | Interactive user simulation            |
| `sample_medical_report.txt` | Sample lab report for testing          |

---

## 📊 Sample Data Flow Example

### Scenario: User Reports Symptoms

```
INPUT:
├─ user_id: "PT-001"
├─ stakeholder_type: "user"
├─ query: "I've had a persistent cough for 2 weeks and mild fever"
└─ clinical_summary: "History of asthma, allergic to penicillin"

COMPANION LAYER:
├─ [user_companion] Classifies → "clinical"
├─ is_valid_query = True
└─ routed_to = "clinical_expert"

EXPERT LAYER:
├─ [clinical_expert] with Orinn:
│  ├─ Context: asthma history + penicillin allergy
│  ├─ Analysis: persistent cough + fever → potential respiratory infection
│  ├─ Recommendation: "Suggest urgent primary care visit, possible chest X-ray"
│  └─ Output: clinical_response = "..."
│
└─ Store in MemPalace:
   ├─ wing: clinical_expert
   ├─ room: conversations
   └─ content: query + assessment

ORCHESTRATION:
├─ orchestrator_decision = "orion" (clinical routing)
├─ Use Orinn compiler for safe output
├─ Check urgency: "HIGH" detected
├─ Escalation flag raised
└─ final_response = "We recommend you see your primary care doctor urgently..."

GUARDRAILS:
├─ audit_flag = True (HIGH urgency escalation)
├─ audit_notes = "Emergency escalation triggered by clinical orchestrator"
└─ db_push_ready = True (flagged but ready)

OUTPUT:
├─ final_response: "We recommend you see your primary care doctor urgently..."
├─ audit_flag: True
├─ routed_to: "clinical_expert"
└─ orchestrator_decision: "orion"

PERSISTENCE:
├─ MemPalace wing: clinical_expert
├─ MemPalace room: conversations
├─ DB push ready (needs manual review due to audit_flag)
└─ Clinical summary updated for next interaction
```

---

## 🔐 Security & Safety

### Guardrail Features

1. **Anomaly Detection**: Auditor identifies unusual patterns
2. **Clinical Approval**: Medical responses flagged for review
3. **Emergency Escalation**: High-urgency queries automatically flagged
4. **Harmful Content**: System refuses inappropriate requests
5. **Data Isolation**: Each patient has isolated MemPalace store
6. **Audit Trails**: All decisions logged and traceable

### Data Privacy

- **Patient Isolation**: Separate ChromaDB per patient (PT-001, PT-002, etc.)
- **No External API Calls**: Data stays local when using vLLM
- **Minimal Logging**: Debug logs can be disabled
- **Response Cleaning**: Removes internal LLM artifacts before user delivery

---

## 🛠️ Development & Deployment

### Local Development

```bash
# Install in editable mode
pip install -e .

# Run tests
pytest tests/

# Start dev server
python main.py
```

### Production Deployment

```bash
# Push all (PowerShell script)
.\push_all.ps1

# Or manual deployment
pip install -r requirements.txt
python -m gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

---

## 📚 Key Files Reference

| File                                          | Purpose                                |
| --------------------------------------------- | -------------------------------------- |
| `main.py`                                     | Entry point - CLI and programmatic API |
| `config/settings.py`                          | Global configuration and model setup   |
| `graph/master_graph.py`                       | Main workflow orchestration            |
| `graph/state.py`                              | Shared state definition                |
| `agents/companions/base_companion.py`         | Base class for all companions          |
| `agents/experts/base_expert.py`               | Base class for all experts             |
| `agents/orchestration/expert_orchestrator.py` | Response compilation                   |
| `agents/guardrails/auditor.py`                | Safety checks and anomaly detection    |
| `rag/mempalace.py`                            | Central memory system                  |
| `rag/medical_rag.py`                          | Medical knowledge base                 |
| `rag/wellness_rag.py`                         | Wellness knowledge base                |

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Orinn API unavailable

- **Solution**: Fallback LLM (Qwen) automatically activated
- **Config**: `base_expert.py` line ~50

**Issue**: vLLM connection failed

- **Solution**: Check SSH tunnel: `ssh -L 8000:localhost:8000 ...`
- **Fallback**: Use cloud-based Qwen endpoint in `config/settings.py`

**Issue**: MemPalace database locked

- **Solution**: Close other connections, ensure ChromaDB version compatibility
- **Location**: Check `rag/db/mempalace/[patient_id]/chroma.sqlite3`

---

## 🎓 Architecture Diagrams

### Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                    USER INPUT LAYER                      │
│        4 Stakeholder Types (CLI Interface)               │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│              COMPANION LAYER (4 agents)                  │
│  ├─ user_companion  ├─ dietician_companion             │
│  ├─ wellness_companion  ├─ clinician_companion         │
│  Each classifies queries & checks validity              │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│           EXPERT ROUTING & PROCESSING                    │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  ↓              ↓              ↓              ↓         │
│ clinical      nutrition     exercise       habits       │
│  expert       (diet)      (wellness)    (behavior)      │
│ (Orinn)       (Qwen)        (Qwen)        (Qwen)       │
│               │                            │            │
│               └─ report_manager (Qwen) ────┘            │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│          ORCHESTRATION LAYER (Compilation)              │
│  ├─ Brain routing (moe vs orion)                        │
│  ├─ Clinical compilation (Orinn)                        │
│  ├─ Emergency detection                                  │
│  └─ Multi-expert debate resolution                      │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│           GUARDRAIL LAYER (Safety)                      │
│  ├─ Anomaly detection                                   │
│  ├─ Clinical approval check                             │
│  ├─ Emergency escalation                                │
│  └─ Harmful content scan                                │
└───────────────────┬─────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│           MEMORY & PERSISTENCE LAYER                    │
│  ┌────────────────────────────────────────────────┐    │
│  │     MemPalace (ChromaDB)                       │    │
│  │  Patient Isolation + Vector Search             │    │
│  │  ├─ Medical RAG  ├─ Wellness RAG              │    │
│  │  ├─ Clinical History  ├─ Diet Plans           │    │
│  │  └─ Behavior Tracking  ├─ Conversation Hist   │    │
│  └────────────────────────────────────────────────┘    │
│  External DB (via Arrangement Agent)                    │
└─────────────────────────────────────────────────────────┘
```

### Query Category Routing

```
User Query
    ↓
[CLASSIFIER LLM]
    ↓
    ├─ "clinical" → [clinical_expert] (Orinn)
    ├─ "nutrition" → [diet_expert] (Qwen)
    ├─ "exercise" → [wellness_expert] (Qwen)
    ├─ "habits" → [behaviour_tracker] (Qwen)
    ├─ "report_submission" → [report_manager] (Qwen)
    └─ "out_of_scope" → [companion response] (Qwen)
```

---

## 📝 Summary

The **AI Health Platform** is a sophisticated multi-agent system that:

1. ✅ **Accepts queries** from 4 different stakeholder types through specialized companions
2. ✅ **Routes intelligently** using LLM-based classification into 5 query categories
3. ✅ **Processes with experts** — specialized AI agents for clinical, nutrition, wellness, behavior, and reports
4. ✅ **Orchestrates responses** by compiling expert outputs safely and detecting emergencies
5. ✅ **Enforces safety** through an auditor that checks for anomalies and harmful content
6. ✅ **Maintains memory** using ChromaDB-backed MemPalace for persistent patient histories
7. ✅ **Integrates seamlessly** with medical and wellness knowledge bases via RAG
8. ✅ **Supports multiple LLMs** — Orinn for clinical, Qwen for companions and wellness
9. ✅ **Runs interactively or programmatically** for CLI or API integration

---

## 📄 License & Credits

This platform integrates:

- **LangGraph** — Multi-agent workflow orchestration
- **ChromaDB** — Vector database for semantic search
- **Orinn 1.7** — Clinical LLM
- **Qwen 2.5-14B** — General-purpose LLM
- **HuggingFace Embeddings** — Semantic text encoding

---

**Last Updated**: May 15, 2026  
**Platform Version**: 1.0 Alpha  
**Status**: Active Development

For detailed implementation, see individual files in the directory structure above.
