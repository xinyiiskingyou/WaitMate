from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
sys.path.append('..')
from src.menu import (
    category_add, item_add, menu_view, menu_item_update_details, menu_category_update_details,
    menu_item_remove, menu_item_update_order, menu_category_update_order
)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to our wait management system."}

@app.post("/menu/category/add")
def category_add_api(name: str):    
    category_add(name)
    return {}

@app.post("/menu/item/add")
def item_add_api(category: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool):    
    item_add(category, name, cost, description, ingredients, is_vegan)
    return {}

@app.get("/menu/listall")
def menu_view_api():
    return menu_view()

@app.put("/menu/item/update/details")
def menu_item_update_details_api(item: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool):
    menu_item_update_details(item,  name, cost, description, ingredients, is_vegan)
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(old_name: str, new_name: str):
    menu_category_update_details(old_name, new_name)
    return {}

@app.put("/menu/item/update/order")
def menu_item_update_order_api(category: str, item_name: str, is_up: bool):
    menu_item_update_order(category, item_name, is_up)
    return {}

@app.put("/menu/category/update/order")
def menu_category_update_order_api(category: str, is_up: bool):
    menu_category_update_order(category, is_up)
    return {}

@app.delete("menu/item/remove")
def menu_item_remove_api(category: str, item_name: str):
    menu_item_remove(category, item_name)
    return {}
