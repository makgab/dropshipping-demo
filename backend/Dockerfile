# gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/dropshipping-api
# gcloud run deploy dropshipping-api --image gcr.io/YOUR_PROJECT_ID/dropshipping-api --platform managed --allow-unauthenticated

# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
