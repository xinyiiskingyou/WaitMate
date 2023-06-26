import sys
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from src.order import OrderDB
from src.table import TableDB
from src.menu import MenuDB
from src.model.category_req import Category
from src.model.item_req import Item

sys.path.append('..')

app = FastAPI()
order = OrderDB()
table = TableDB()
menu = MenuDB()

origins = [
    'http://localhost:3000',
    'localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/', tags=['root'])
async def read_root() -> dict:
    return {"message": "Welcome to our wait management system."}

############ MENU #################

@app.post("/menu/category/add")
def category_add_api(reqBody: Category):   
    menu.category_add(reqBody.name)
    return {}

@app.post("/menu/item/add")
def item_add_api(reqbody: Item):    
    menu.item_add(reqbody.category, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    return {}

# @app.get("/menu/listall")
# def menu_view_api():
#     return menu_view()

@app.put("/menu/item/update/details")
def menu_item_update_details_api(item: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool):
    menu.update_details_menu_items(item,  name, cost, description, ingredients, is_vegan)
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(old_name: str, new_name: str):
    menu.update_details_category(old_name, new_name)
    return {}

@app.put("/menu/item/update/order")
def menu_item_update_order_api(item_name: str, is_up: bool):
    menu.update_order_menu_items(item_name, is_up)
    return {}

@app.put("/menu/category/update/order")
def menu_category_update_order_api(category: str, is_up: bool):
    menu.update_order_menu_category(category, is_up)
    return {}

@app.delete("/menu/item/remove")
def menu_item_remove_api(item_name: str):
    menu.remove_menu_items(item_name)
    return {}

############ ORDER #################

@app.post('/order/cart/add/{table_id}')
def ordre_cart_add(table_id: int, item_name: str, amount: int):
    order.add_order(table_id, item_name, amount)
    return {}

@app.get('/order/cart/list/{table_id}')
def ordre_cart_list(table_id: int):
    return order.get_table_order(table_id)

@app.get('/order/listall')
def ordre_listall():
    return order.get_all_orders()

############ TABLE #################

@app.get('/table/select/{table_id}')
def table_select(table_id: int):
    table.select_table_number(table_id)
    return {}

@app.get('/table/status')
def table_status():
    return table.get_all_tables_status()

@app.post('/table/status/update')
def table_status_update(table_id: int, status: str):
    table.update_table_status(table_id, status)
    return {}
