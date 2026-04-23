# Python demo web service demo on Render.com, Firebase



## Running local - VS Code

  - Virtual environment: ```python -m venv .venv```
    - Windows: ```.\.venv\Scripts\Activate.ps1```
    - Linux:  ```source .venv/bin/activate```
  
  - Run:
  ```
      pip install -r requirements.txt
      cd backend
      pip install -r requirements.txt
      uvicorn main:app --reload
      cd frontend
      python -m http.server 5500
  ```

  - browser:
    - http://localhost:8080
    - http://localhost:8080/docs
    - http://localhost:5500




## Render + GitHub Action

  🔑 Settings

   - Build & Deploy
     - Repository: guthub_url
     - Branch: main
     - Root Directory: [optional]
     - Build Command: pip install -r backend/requirements.txt
     - uvicorn backend.main:app --host 0.0.0.0 --port $PORT
     - Auto-Deploy: OnCommit
     - Deploy Hook: ***********

  🔑 1️⃣ Render API Key hol van?

  - Render Dashboard → jobb felső sarok → Account Settings
  - Bal oldalon: API Keys
  - Kattints: Create API Key
  - Adj neki nevet pl. github-actions
  - Másold ki az értéket

 ⚠️ Fontos: ezt GitHub Secrets-be kell tenni, nem a kódba.
  - GitHub →
    - Repo → Settings → Secrets and variables → Actions → New repository secret
    - Add hozzá:
    - Name: RENDER_API_KEY
    - Value: (a kimásolt API key)

 🆔 2️⃣ Service ID hol van?

  - Menj a Render Dashboardra
  - Nyisd meg a backend service-t
  - A böngésző URL-ben látod:
  - https://dashboard.render.com/web/srv-abc123xyz456

 👉 A srv-abc123xyz456 rész a Service ID

  - Ugyanez frontendnél:
  - https://dashboard.render.com/static/srv-xyz987abc654
  - Ez is egy külön Service ID.
  
 👉 GitHub Secrets-be ezeket add hozzá
   - Backendhez
   - RENDER_BACKEND_SERVICE_ID = srv-abc123xyz456
   - Frontendhez (ha kell):
   - RENDER_FRONTEND_SERVICE_ID = srv-xyz987abc654

 📌 Összefoglalva
 - Mit |	Hol
   - API Key	Account Settings → API Keys
   - Service ID	Service oldal URL-jében
   - GitHub Secret	Repo → Settings → Secrets → Actions





## Firebase

  - Login Firebase
    - url: https://firebase.google.com
    - Free plan: Spark
  - Project
  
    - Create new project: "dropshipping-demo"
    - Project: General - Your app - Create web app
      - Firebase Config:
      ```
         const firebaseConfig = {
            apiKey: "...",
            authDomain: "dropshipping-demo.firebaseapp.com",
            projectId: "dropshipping-demo",
            storageBucket: "dropshipping-demo.firebasestorage.app",
            messagingSenderId: "...",
            appId: "...",
            measurementId: "..."
            };
      ```
    - Project: Service account - Generate key  --> serviceAccount.json
    - Project: Build / Authentication / Sign-in Method    ( Email/Password; Google; Anonymous )



## Firebase install and CLI
  
  - CLI:
   ```
      npm install -g firebase-tools
      firebase login
      # if needed: firebase logout
      firebase init
      firebase deploy
   ```



## Firebase

  ### Backend

    - Render.com
      - Project: dropshipping-demo
      - GitHub repo: https://github.com/makgab/dropshipping-demo
      - Root Directory: backend
      - start command: uvicorn main:app --host 0.0.0.0 --port 10000
                       (python main.py)
  

  ### Frontend
    - Firebase
      - CLI: 
```
      ~# firebase deploy
      ### public: frontend
```

    - Megjegyzések:

      - RENDER_API_KEY → Render fiókodban a API Keys-ből.
      - RENDER_BACKEND_SERVICE_ID → a backend service ID Render.com-on.



## Google Cloud SDK install

   - Install it from internet for CLI: gcloud
   - Letöltés: https://cloud.google.com/sdk/docs/install
   - Telepítés → mindenképp pip/komponens PATH hozzáadása.
   - Nyisd CMD vagy PowerShell admin módban (ha komponenseket akarsz telepíteni).
```
      gcloud auth login
      gcloud auth list
      gcloud config set account user@gmail.com
      gcloud projects list
      gcloud config set project dropshipping-demo
      gcloud config get-value project
      gcloud beta billing projects describe dropshipping-demo
      # Mutatja, hogy a projekt kapcsolódik-e billing account-hoz.
      # Ha nincs → Cloud Run és Cloud Build nem fog menni.
      # Alternatíva GUI-val:
      # https://console.cloud.google.com/billing
      gcloud services enable cloudbuild.googleapis.com
      gcloud services enable run.googleapis.com
      gcloud services enable artifactregistry.googleapis.com
      gcloud services enable containerregistry.googleapis.com

      gcloud run deploy dropshipping-api --source .
      # gcloud run deploy dropshipping-backend --source backend --region europe-west1 --allow-unauthenticated

      # get an url: https://dropshipping-api-xxxx.a.run.app
      in backend: fetch("https://dropshipping-api-xxxx.a.run.app/calculate_profit", { ... })
      in frontend: https://dropshipping-demo.web.app

```

:)
