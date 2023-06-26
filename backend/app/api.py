import sys
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from src.order import OrderDB
from src.table import TableDB
from src.menu import MenuDB
from src.model.category_req import Category
from src.model.item_req import Item
from src.model.table_req import Table
from src.model.order_req import Order

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

@app.put("/menu/category/update/order")
def menu_category_update_order_api(reqbody: Category, is_up: bool):
    menu.update_order_menu_category(reqbody.name, is_up)
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(reqbody: Category, new_name: str):
    menu.update_details_category(reqbody.name, new_name)
    return {}

@app.get("/menu/list/categories")
def menu_view_categories():
    return menu.get_all_categories()

@app.get("/menu/list/items")
def menu_view_api(reqBody: Category):
    return menu.get_items_in_category(reqBody.cat_id)

@app.post("/menu/item/add")
def item_add_api(reqbody: Item):    
    menu.item_add(reqbody.category.name, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    return {}

@app.put("/menu/item/update/details")
def menu_item_update_details_api(reqbody: Item):
    menu.update_details_menu_items(reqbody.item_id, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    return {}

@app.put("/menu/item/update/order")
def menu_item_update_order_api(reqbody: Item, is_up: bool):
    menu.update_order_menu_items(reqbody.name, is_up)
    return {}

@app.put("/menu/item/remove")
def menu_item_remove_api(reqbody: Item):
    menu.remove_menu_items(reqbody.name)
    return {}

############ ORDER #################

@app.post('/order/cart/add')
def ordre_cart_add(reqbody: Order):
    order.add_order(reqbody.table_id, reqbody.item_name, reqbody.amount)
    return {}

@app.post('/order/cart/list')
def ordre_cart_list(reqbody: Order):
    return order.get_table_order(reqbody.table_id)

@app.get('/order/listall')
def ordre_listall():
    return order.get_all_orders()

############ TABLE #################

@app.post('/table/select')
def table_select(reqbody: Table):
    table.select_table_number(reqbody.table_id)
    return {}

@app.get('/table/status')
def table_status():
    return table.get_all_tables_status()

@app.put('/table/status/update')
def table_status_update(reqbody: Table):
    table.update_table_status(reqbody.table_id, reqbody.status)
    return {}
