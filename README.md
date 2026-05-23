# Health AI App 🏥💊

A modern web-based health management application powered by AI. This is a **React + Vite** frontend application paired with an **Express.js** backend that integrates with an AI/LLM service for intelligent health insights.

---

## 📋 Project Structure

```
health-app/
├── src files (React components)
├── HealthAIApp.jsx          # Main React component
├── main.jsx                 # React entry point
├── index.html               # HTML template
├── styles.css               # Global styles
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
└── backend/
    ├── server.js            # Express.js backend
    ├── server.py            # Optional Python service
    └── package.json         # Backend dependencies
```

---

## 🎯 Key Features

✅ **AI-Powered Chat**: Ask health-related questions to an intelligent AI assistant  
✅ **Health Dashboard**: View personalized health metrics and insights  
✅ **Reports Generation**: Generate detailed health reports  
✅ **Data Visualization**: Charts and analytics for health tracking  
✅ **User-Friendly Interface**: Modern, responsive design with Vite optimization

---

## 🛠 Tech Stack

### Frontend

- **React 18.2** - UI library
- **Vite 5.1** - Build tool & dev server
- **CSS 3** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin request handling
- **Python FastAPI** - AI/LLM service integration (external)

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup

1. Navigate to the health-app directory:

```bash
cd health-app
```

2. Install dependencies:

```bash
npm install
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd health-app/backend
```

2. Install dependencies:

```bash
npm install
```

3. (Optional) If using Python services, ensure Python and FastAPI are installed:

```bash
pip install fastapi uvicorn
```

---

## 🚀 Running the Application

### Start the Backend Server

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
