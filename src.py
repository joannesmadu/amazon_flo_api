from fastapi import FastAPI, HTTPException
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
FLO_API_KEY = os.getenv("FLO_API_KEY")
AMAZON_API_KEY = os.getenv("AMAZON_API_KEY")

app = FastAPI()

# Mock function to get cycle status from Flo API
def get_cycle_status(user_id):
    response = requests.get(f"https://flo-api.com/user/{user_id}/cycle",
                            headers={"Authorization": f"Bearer {FLO_API_KEY}"})
    if response.status_code == 200:
        return response.json()
    raise HTTPException(status_code=response.status_code, detail="Failed to fetch cycle status")

# Mock function to add care package to Amazon cart
def add_to_amazon_cart(user_id, items):
    response = requests.post("https://amazon-api.com/cart/add",
                             json={"user_id": user_id, "items": items},
                             headers={"Authorization": f"Bearer {AMAZON_API_KEY}"})
    if response.status_code == 200:
        return response.json()
    raise HTTPException(status_code=response.status_code, detail="Failed to add items to Amazon cart")

@app.get("/check-cycle/{user_id}")
def check_cycle(user_id: str):
    cycle_data = get_cycle_status(user_id)
    if cycle_data.get("cycle_status") == "restarted":
        care_package = [
            {"name": "Menstrual Pads", "asin": "B000XYZ"},
            {"name": "Painkillers", "asin": "B001XYZ"},
            {"name": "Chocolate Snacks", "asin": "B002XYZ"}
        ]
        cart_response = add_to_amazon_cart(user_id, care_package)
        return {"message": "Care package added to cart", "cart_details": cart_response}
    return {"message": "No action needed"}
