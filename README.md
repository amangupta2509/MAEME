# Health AI App 🏥💊

A comprehensive AI-powered health management platform combining a modern **React + Vite** frontend with an advanced **multi-agent Python backend**. The system intelligently routes health queries to specialized AI experts (clinical, nutritional, wellness) using LangGraph orchestration and LLM integration.

---

## 📋 Project Structure

```
MAEME/
├── Frontend (React + Vite)
│   ├── src/                 # React components and pages
│   │   ├── api/             # API integrations
│   │   ├── components/      # Reusable UI components
│   │   └── pages/           # Page components (Dashboard, Login, etc.)
│   ├── HealthAIApp.jsx      # Main React component
│   ├── main.jsx             # React entry point
│   ├── index.html           # HTML template
│   ├── styles.css           # Global styles
│   ├── styles-responsive.css# Responsive design styles
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
└── health_platform/         # Backend (Python Multi-Agent System)
    ├── main.py              # Entry point & Interactive CLI
    ├── server.py            # Flask API server
    ├── requirements.txt     # Python dependencies
    ├── agents/              # AI agents (companions, experts, guardrails)
    ├── graph/               # LangGraph workflow definitions
    ├── rag/                 # Retrieval-Augmented Generation & memory
    ├── config/              # Configuration & settings
    └── demo/                # Demo mode & sample data
```

---

## 🎯 Key Features

✅ **Multi-Agent AI System** - Specialized experts for clinical, nutrition, and wellness queries  
✅ **Intelligent Query Routing** - Automatic categorization and expert assignment  
✅ **Persistent Memory** - ChromaDB-backed MemPalace for patient health histories  
✅ **Safety Guardrails** - Auditor agent detects anomalies and flags safety concerns  
✅ **RAG Integration** - Medical and wellness knowledge base retrieval  
✅ **Multi-Stakeholder Support** - Interfaces for users, clinicians, dieticians, and wellness experts  
✅ **Modern UI** - Responsive React interface with real-time health dashboards  
✅ **Report Generation** - Analyze medical documents and lab reports

---

## 🛠 Tech Stack

### Frontend

- **React 18.2** - UI library
- **Vite 5.1** - Build tool & dev server
- **Lucide React** - Icon library
- **Responsive CSS** - Mobile-first design

### Backend

- **Python 3.10+** - Core language
- **LangGraph** - Multi-agent orchestration
- **Flask** - Web server
- **ChromaDB** - Vector database for memory
- **LLMs** - Qwen 2.5-14B (companions/experts), Orinn 1.7 (clinical/orchestration)
- **RAG** - Medical and wellness knowledge bases

---

## 📦 Installation & Setup

### Prerequisites

**Frontend:**

- Node.js (v16 or higher)
- npm or yarn

**Backend:**

- Python 3.10 or higher
- pip (Python package manager)

### Frontend Setup

1. Navigate to the root directory:

```bash
cd MAEME
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup (Python Multi-Agent System)

#### 1. Navigate to the Backend Directory

```bash
cd health_platform
```

#### 2. Create a Python Virtual Environment

**On Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

**On macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

#### 3. Upgrade pip (Recommended)

```bash
pip install --upgrade pip setuptools wheel
```

#### 4. Install Python Dependencies

All required packages are listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

**What gets installed:**

- `langchain` & `langgraph` - Multi-agent orchestration
- `anthropic`, `openai`, `google-genai` - LLM providers
- `chromadb` - Vector database for memory management
- `flask`, `uvicorn` - Web servers
- `pandas`, `numpy`, `scikit-learn` - Data processing
- `sentence-transformers` - Embeddings
- `torch` - ML framework
- And 100+ supporting libraries for document processing, auth, async operations

#### 5. Configure Environment Variables

Create a `.env` file in the `health_platform` directory with your API keys:

```env
# LLM API Keys
QWEN_API_KEY=your_qwen_key
QWEN_BASE_URL=http://localhost:8000/v1

OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key

# Local LLM Server (if using vLLM)
# Requires SSH tunnel: ssh -L 8000:localhost:8000 user@server
VLLM_HOST=localhost
VLLM_PORT=8000

# Other configurations
PYTHONPATH=.
```

#### 6. Run the Backend Server

**Flask API Server (recommended for frontend integration):**

```bash
python server.py
```

Server runs on `http://localhost:5000`

**Interactive CLI (for testing agents):**

```bash
python main.py
```

---

## 🚀 Running the Complete Application

### Terminal 1 - Frontend

```bash
cd MAEME
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Terminal 2 - Backend

```bash
cd MAEME/health_platform
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
python server.py
```

API available at: `http://localhost:5000/api/chat`

### Terminal 3 (Optional) - Local LLM Inference

```bash
# SSH tunnel to remote vLLM server
ssh -L 8000:localhost:8000 user@server -N
```

---

## 🔧 Backend Architecture

### Multi-Agent System Flow

```
User Query (any stakeholder type)
    ↓
[COMPANION LAYER] - Natural language interface
    ↓
[EXPERT LAYER] - Specialized AI agents
    ├── Diet Expert (nutrition)
    ├── Wellness Expert (fitness/habits)
    ├── Clinical Expert (medical)
    ├── Behavior Tracker (lifestyle)
    └── Report Manager (documents)
    ↓
[ORCHESTRATION LAYER] - Compile responses
    ├── Expert Orchestrator
    ├── Debate Agent (resolve conflicts)
    └── Medical/Wellness Managers
    ↓
[GUARDRAIL LAYER] - Safety verification
    └── Auditor Agent (anomaly detection)
    ↓
Final Response → Frontend
```

### Core Components

- **agents/companions/** - Stakeholder interaction interfaces
- **agents/experts/** - Specialized AI agents (diet, clinical, wellness, etc.)
- **agents/orchestration/** - Response compilation and routing
- **agents/guardrails/** - Safety checks and anomaly detection
- **graph/** - LangGraph workflow definitions
- **rag/** - Memory system (MemPalace) and knowledge bases
- **config/** - Global settings and API configuration

---

## 📖 Development Commands

### Frontend

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend

```bash
python main.py           # Interactive CLI session
python server.py         # Flask API server
python -m pytest tests/  # Run test suite
```

---

## 🚀 Running the Application

### Start the Frontend

```bash
cd health-app/backend
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on **http://localhost:5000**

The backend communicates with a local FastAPI endpoint at **http://localhost:9090/chat** for AI responses.

### Start the Frontend Development Server

In a new terminal:

```bash
cd health-app
npm run dev
```

The frontend will typically run on **http://localhost:5173** (Vite default)

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🔌 API Endpoints

### POST `/api/chat`

Sends a message to the AI assistant for health-related queries.

**Request:**

```json
{
  "message": "What should I eat for better health?"
}
```

**Response:**

```json
{
  "reply": "AI response with health recommendations",
  "confidence": 0.95
}
```

**Note**: The backend proxies requests to a FastAPI LLM service at `http://localhost:9090/chat`

---

## 📱 Component Architecture

### Main Components

- **HealthAIApp.jsx** - Root component managing overall app state
- **Chat Interface** - Real-time AI conversation component
- **Dashboard** - Health metrics overview
- **Reports** - Generated health analysis reports
- **Charts** - Data visualization components

---

## 🔄 How It Works

1. **User Input**: User asks a question or uploads health data in the UI
2. **Frontend Processing**: React component handles the input and formats it
3. **API Call**: Frontend sends request to backend at `/api/chat`
4. **Backend Processing**: Express server receives the request
5. **AI Integration**: Backend forwards to FastAPI LLM service (http://localhost:9090)
6. **Response Flow**: LLM returns response → Backend processes → Frontend displays

---

## 🔐 Environment Variables

Create a `.env` file in the backend directory (if needed):

```env
PORT=5000
LLM_API=http://localhost:9090/chat
NODE_ENV=development
```

---

## 📝 Styling

Global styles are defined in `styles.css`. The app uses a modern color scheme and responsive design principles to work across devices.

Key style features:

- Responsive layout
- Health-themed color palette
- Accessible UI components
- Smooth animations and transitions

---

## 🐛 Troubleshooting

### Backend Connection Issues

- Ensure the backend is running on port 5000
- Check CORS is properly configured
- Verify the FastAPI service is running on port 9090

### Build Errors

- Clear `node_modules` and reinstall: `npm install`
- Check Node.js version compatibility
- Clear Vite cache: `rm -rf .vite`

### LLM Service Not Responding

- Verify FastAPI server is running on http://localhost:9090
- Check network connectivity
- Review server logs for errors

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

---

## 👥 Development

For development, use the dev scripts with auto-reload:

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

Both will watch for file changes and automatically reload.

---

## 📄 License

This project is part of the Health AI ecosystem.

---

**Happy Coding! 🎉**
