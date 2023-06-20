from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from menu import (
    category_add, item_add, menu_view, menu_item_update_details, menu_category_update_details,
    menu_item_remove
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
def item_add_api(category: str, name: str, cost: float, description: str):    
    item_add(category, name, cost, description)
    return {}

@app.get("/menu/listall")
def menu_view_api():
    return menu_view()

@app.put("/menu/item/update/details")
def menu_item_update_details_api(category: str, item: str, name: str, cost: float, description: str):
    menu_item_update_details(category, item,  name, cost, description)
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(old_name: str, new_name: str):
    menu_category_update_details(old_name, new_name)
    return {}

@app.delete("menu/item/remove")
def menu_item_remove_api(category: str, item: str):
    menu_item_remove(category, item)
    return {}
