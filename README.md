
# ChottiAi: Artisan AI Assistant

ChottiAi is an AI-powered assistant for artisans, providing design generation, tutorials, and catalog management, with translation support. It consists of a FastAPI backend and a Next.js frontend.

---

## 🌐 Live Demo

- **Frontend (Vercel):** [https://chotti-ai.vercel.app/](https://chotti-ai.vercel.app/)

---

## 🗂️ Project Structure

```
ChottiAi/
├── Backend/
│   ├── main.py                # FastAPI backend entry point
│   ├── requirements.txt       # Python dependencies
│   ├── env/                   # Python virtual environment (created locally)
│   ├── generated_images/      # Output images
│   ├── inputs/, models/, ...  # Supporting code
├── Frontend/
│   ├── src/                   # Next.js frontend code
│   ├── public/                # Static assets
│   └── ...
└── README.md                  # Project documentation
```

---

## 🚀 Backend Setup (FastAPI)

1. **Navigate to the Backend folder:**
   ```powershell
   cd Backend
   ```

2. **Create a virtual environment:**
   ```powershell
   python -m venv env
   ```

3. **Activate the virtual environment:**
   - **Windows (PowerShell):**
     ```powershell
     .\env\Scripts\Activate.ps1
     ```
   - **Windows (cmd):**
     ```cmd
     .\env\Scripts\activate.bat
     ```
   - **macOS/Linux:**
     ```bash
     source env/bin/activate
     ```

4. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

5. **Run the FastAPI server:**
   ```powershell
   python main.py
   ```
   The API will be available at [http://localhost:8000](http://localhost:8000).

---

## 💻 Frontend Setup (Next.js)

1. **Navigate to the Frontend folder:**
   ```powershell
   cd Frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Run the development server:**
   ```powershell
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Usage

- The frontend communicates with the backend at `http://localhost:8000` (or your deployed backend URL).
- The backend serves generated images at `/static` (e.g., `http://localhost:8000/static/your_image.png`).
- You can POST user queries to `/process-query/` with JSON:

  ```json
  {
    "raw_input": "Describe a peacock design for a sling bag",
    "target_language": "hi"  // Optional: for translation
  }
  ```

---

## 🌍 Deployment

- **Frontend:** Deployed on Vercel at [https://chotti-ai.vercel.app/](https://chotti-ai.vercel.app/)
- **Backend:** Deployed on Railway.
  - If you deploy the backend elsewhere, update the frontend API URL in your environment variables or config.

---

## ⚠️ Notes

- Ensure both backend and frontend are running for full functionality in local development.
- For production, configure CORS and environment variables as needed.
- The backend must be accessible to the frontend (update API URLs if deploying separately).

---

## 📄 License
See the LICENSE file for details.
