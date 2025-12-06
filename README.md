# DDoS Attack Simulation & Social Network Analysis Visualizer

A comprehensive full-stack web application for understanding DDoS attacks through interactive simulation, network graph visualization, and AI-powered analysis.

## 🎯 Features

- **Synthetic Dataset Generation**: AI-powered generation of network traffic datasets using LangChain
- **Network Graph Visualization**: Interactive SNA graphs using NetworkX and PyVis
- **Traffic Analysis**: Statistical analysis with anomaly detection
- **AI-Powered Reports**: Natural language explanations of attack patterns
- **Modern UI/UX**: Beautiful, responsive interface built with Next.js and TailwindCSS

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with React
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **LLM Integration**: LangChain with Groq
- **Data Processing**: Pandas
- **Graph Generation**: NetworkX + PyVis
- **Server**: Uvicorn

## 📋 Prerequisites

- Python 3.11+
- Node.js 18+
- Groq API Key
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ddos_attack_sna
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   echo "GROQ_API_KEY=your_groq_api_key_here" > backend/.env
   ```

3. **Start services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```
   
   **Activate the virtual environment:**
   - **Windows PowerShell**: `.\venv\Scripts\Activate.ps1`
   - **Windows Command Prompt**: `venv\Scripts\activate.bat`
   - **Linux/Mac**: `source venv/bin/activate`

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

5. **Create static directory**
   ```bash
   mkdir -p static
   ```

6. **Run the server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000

## 📁 Project Structure

```
ddos_attack_sna/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── routers/                # API route handlers
│   │   ├── dataset.py          # Dataset generation endpoints
│   │   ├── analysis.py         # Analysis endpoints
│   │   ├── graph.py            # Graph generation endpoints
│   │   └── report.py           # Report generation endpoints
│   ├── services/               # Business logic services
│   │   ├── dataset_generator.py # LLM-based dataset generation
│   │   ├── analysis_engine.py  # Traffic analysis engine
│   │   ├── graph_builder.py    # NetworkX/PyVis graph builder
│   │   └── report_generator.py # LLM-based report generation
│   ├── static/                 # Generated graph HTML files
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend Docker configuration
│   └── .env                    # Environment variables
├── frontend/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx            # Home page
│   │   ├── configure/          # Dataset configuration page
│   │   ├── dataset/            # Dataset display page
│   │   ├── analysis/           # Analysis & statistics page
│   │   ├── graph/              # Graph visualization page
│   │   └── report/             # Attack report page
│   ├── package.json            # Node.js dependencies
│   ├── Dockerfile              # Frontend Docker configuration
│   └── .env.local              # Frontend environment variables
├── docker-compose.yml          # Docker Compose configuration
└── README.md                   # This file
```

## 🔌 API Endpoints

### Dataset Generation
- `POST /api/generate-dataset` - Generate synthetic network traffic dataset

### Analysis
- `POST /api/analyze` - Analyze dataset and return statistics

### Graph Visualization
- `POST /api/graph` - Generate network graph HTML file
- `GET /api/graph/static` - Serve generated graph file

### Report Generation
- `POST /api/explain-attack` - Generate AI-powered attack explanation report

## 🎨 Usage Flow

1. **Home Page**: Learn about DDoS attacks and start simulation
2. **Configuration**: Set parameters (servers, bots, nodes, attack toggle)
3. **Dataset Generation**: AI generates synthetic network traffic data
4. **Dataset Display**: View generated dataset in a table
5. **Analysis**: View statistics, charts, and anomaly detection
6. **Graph Visualization**: Interactive network graph showing attack patterns
7. **Report**: AI-generated explanation of the attack simulation

## 🔧 Configuration

### Backend Environment Variables
- `GROQ_API_KEY`: Your Groq API key (required)

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## 🧪 Testing

### Backend API Testing
Visit http://localhost:8000/docs for interactive API documentation (Swagger UI)

### Manual Testing Flow
1. Start both backend and frontend servers
2. Navigate to http://localhost:3000
3. Click "Start Simulation"
4. Configure dataset parameters
5. Generate dataset and proceed through all pages

## 🐛 Troubleshooting

### Backend Issues
- **Import errors**: Ensure all dependencies are installed (`pip install -r requirements.txt`)
- **LLM errors**: Verify `GROQ_API_KEY` is set correctly
- **Port conflicts**: Change port in `uvicorn` command or docker-compose.yml

### Frontend Issues
- **API connection errors**: Verify backend is running and `NEXT_PUBLIC_API_URL` is correct
- **Build errors**: Clear `.next` directory and reinstall dependencies
- **Module not found**: Run `npm install` again

### Docker Issues
- **Build failures**: Ensure Docker and Docker Compose are up to date
- **Port conflicts**: Modify ports in docker-compose.yml
- **Volume permissions**: Check file permissions on mounted volumes

## 📝 Notes

- The application uses Groq's LLM models (Llama 3.1) for dataset and report generation
- Graph visualizations are generated as static HTML files
- All data is stored in browser sessionStorage (not persisted)
- The application is designed for educational purposes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Groq for LLM capabilities
- NetworkX and PyVis for graph visualization
- FastAPI and Next.js communities

---

**Built with ❤️ for cybersecurity education**

