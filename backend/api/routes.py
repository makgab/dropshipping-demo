from fastapi import APIRouter, Request, HTTPException
from models.profit import ProfitRequest
from services.calculator import calculate_profit
from firebase_auth import verify_token
from firestore_db import save_calculation, get_user_calculations

router = APIRouter(prefix="/api/v1")


def get_user_from_request(request: Request):
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")

    token = auth_header.split(" ")[1]

    try:
        return verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/calculate_profit")
async def calc(request: Request, data: ProfitRequest):
    user = get_user_from_request(request)

    result = calculate_profit(data)

    save_calculation(user["uid"], data, result)

    return result


@router.get("/my_calculations")
async def my_calculations(request: Request):
    user = get_user_from_request(request)

    return get_user_calculations(user["uid"])
