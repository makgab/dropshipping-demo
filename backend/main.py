# backend/main.py

from fastapi import FastAPI
from api.routes import router

app = FastAPI()

app.include_router(router)


@app.get("/")
def root():
    return {"status": "ok"}
