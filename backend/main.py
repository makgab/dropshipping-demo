# backend/main.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

app = FastAPI()

# CORS minden frontend hívásra
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfitRequest(BaseModel):
    price: float
    shipping: float
    import_vat: float
    fee: float
    sales_price: float

@app.get("/")
def root():
    return {"status": "ok", "service": "dropshipping-demo"}

@app.post("/api/calculate_profit")
def calc(data: ProfitRequest):
    total_cost = data.price + data.shipping + data.import_vat + data.fee
    profit = data.sales_price - total_cost
    margin_percent = profit / data.sales_price * 100 if data.sales_price else 0
    return {"profit": profit, "margin_percent": margin_percent}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
