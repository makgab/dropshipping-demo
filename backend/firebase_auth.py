import firebase_admin
from firebase_admin import auth

# init once
if not firebase_admin._apps:
    firebase_admin.initialize_app()

def verify_token(token: str):
    return auth.verify_id_token(token)
