from fastapi import FastAPI
from menu import category_add, item_add, menu_view
app = FastAPI()

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