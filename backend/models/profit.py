from pydantic import BaseModel

class ProfitRequest(BaseModel):
    price: float
    shipping: float
    import_vat: float
    fee: float
    sales_price: float
