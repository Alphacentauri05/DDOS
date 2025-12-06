# Windows Setup Guide

## 🪟 PowerShell Setup Instructions

### Step 1: Navigate to Backend Directory
```powershell
cd backend
```

### Step 2: Create Virtual Environment
```powershell
python -m venv venv
```

### Step 3: Activate Virtual Environment

**For PowerShell (Recommended):**
```powershell
.\venv\Scripts\Activate.ps1
```

**If you get an execution policy error**, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Alternative for Command Prompt:**
```cmd
venv\Scripts\activate.bat
```

### Step 4: Install Dependencies
```powershell
pip install -r requirements.txt
```

### Step 5: Set Up Environment Variables
```powershell
# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

Or manually create `.env` file with:
```
GROQ_API_KEY=your_groq_api_key_here
```

### Step 6: Create Static Directory
```powershell
New-Item -ItemType Directory -Force -Path static
```

### Step 7: Run the Server
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## ✅ Verify Installation

After activation, you should see `(venv)` at the beginning of your PowerShell prompt:
```
(venv) PS E:\ddos_attack_sna\backend>
```

## 🔧 Troubleshooting

### Issue: "Execution of scripts is disabled on this system"
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "python is not recognized"
**Solution:**
- Make sure Python is installed and added to PATH
- Try using `py` instead of `python`:
  ```powershell
  py -m venv venv
  ```

### Issue: Virtual environment not activating
**Solution:**
- Make sure you're in the `backend` directory
- Check that `venv\Scripts\Activate.ps1` exists
- Try the full path: `.\backend\venv\Scripts\Activate.ps1`

### Issue: "Cannot find path"
**Solution:**
- Verify you're in the correct directory: `Get-Location`
- List files: `Get-ChildItem`
- Navigate to backend: `Set-Location backend`

## 📝 Quick Reference

```powershell
# Navigate to backend
cd backend

# Create venv
python -m venv venv

# Activate (PowerShell)
.\venv\Scripts\Activate.ps1

# Install packages
pip install -r requirements.txt

# Set API key
echo "GROQ_API_KEY=your_key" > .env

# Run server
uvicorn main:app --reload
```

