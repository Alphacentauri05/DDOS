# Quick Start Guide

## 🚀 Fastest Way to Run

### Prerequisites
- Docker and Docker Compose installed
- Groq API Key

### Steps

1. **Set your Groq API key**
   ```bash
   # Create .env file in backend directory
   echo "GROQ_API_KEY=your-groq-api-key-here" > backend/.env
   ```

2. **Start everything with Docker**
   ```bash
   docker-compose up --build
   ```

3. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API Docs: http://localhost:8000/docs

4. **Start using the app!**
   - Click "Start Simulation"
   - Configure your parameters
   - Generate dataset
   - Explore the analysis and graphs

## 📝 Manual Setup (Without Docker)

### Backend

```bash
cd backend
python -m venv venv

# For Windows PowerShell:
.\venv\Scripts\Activate.ps1

# For Windows Command Prompt:
# venv\Scripts\activate.bat

# For Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt

# Create .env file with proper UTF-8 encoding (no BOM)
# IMPORTANT: Do NOT use quotes around the API key value!
# For Windows PowerShell (recommended - no BOM):
$content = "GROQ_API_KEY=your_groq_api_key_here"; $utf8NoBom = New-Object System.Text.UTF8Encoding $false; [System.IO.File]::WriteAllText(".env", $content, $utf8NoBom)
# Example: $content = "GROQ_API_KEY=gsk_your_actual_key_here"

# Alternative for Windows PowerShell (may add BOM):
# "GROQ_API_KEY=your_groq_api_key_here" | Out-File -FilePath .env -Encoding utf8 -NoNewline

# For Windows Command Prompt:
# echo GROQ_API_KEY=your_groq_api_key_here > .env

# For Linux/Mac:
# echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Create static directory
New-Item -ItemType Directory -Force -Path static

# Run the server
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## ⚠️ Common Issues

**Problem**: Backend can't connect to Groq
- **Solution**: Check that `GROQ_API_KEY` is set in `backend/.env`

**Problem**: Frontend can't reach backend
- **Solution**: Verify backend is running on port 8000 and check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**Problem**: Graph not displaying
- **Solution**: Check that `backend/static` directory exists and has write permissions

## 🎯 First Run Checklist

- [ ] Groq API key is set
- [ ] Backend is running (check http://localhost:8000/health)
- [ ] Frontend is running (check http://localhost:3000)
- [ ] Can generate a dataset
- [ ] Can view analysis page
- [ ] Can view graph visualization
- [ ] Can generate report

## 💡 Tips

- Start with small datasets (10-20 nodes) for faster generation
- Enable attack mode to see clear DDoS patterns in the graph
- The graph is interactive - drag nodes to rearrange
- Download CSV datasets for offline analysis

