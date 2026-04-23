from fastapi import APIRouter
from models.profit import ProfitRequest
from services.calculator import calculate_profit

router = APIRouter(prefix="/api/v1")

@router.post("/calculate_profit")
def calc(data: ProfitRequest):
    return calculate_profit(data)
