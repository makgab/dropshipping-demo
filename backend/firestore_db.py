from google.cloud import firestore
from datetime import datetime
from datetime import datetime, timezone


def get_db():
    return firestore.Client()


def save_calculation(user_id, data, result):
    db = get_db()
    doc = {
        "user_id": user_id,
        "price": data.price,
        "shipping": data.shipping,
        "import_vat": data.import_vat,
        "fee": data.fee,
        "sales_price": data.sales_price,
        "profit": result["profit"],
        "margin_percent": result["margin_percent"],
        "created_at": datetime.now(timezone.utc)
    }
    db.collection("calculations").add(doc)


def get_user_calculations(user_id):
    db = get_db()

    docs = db.collection("calculations") \
        .where("user_id", "==", user_id) \
        .stream()

    result = []

    for doc in docs:
        item = doc.to_dict()

        # 🔥 datetime FIX
        if "created_at" in item and item["created_at"]:
            item["created_at"] = item["created_at"].isoformat()

        result.append(item)

    return result
