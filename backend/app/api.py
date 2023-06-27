import sys
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query, Body
from src.order import OrderDB
from src.table import TableDB
from src.menu import MenuDB
from src.model.category_req import Category
from src.model.category_req import Category_ID
from src.model.category_order_req import CategoryOrder
from src.model.category_update_req import CategoryUpdate
from src.model.item_req import Item
from src.model.table_req import Table
from src.model.table_req import Table_Cust
from src.model.order_req import Order

sys.path.append('..')

app = FastAPI()
order = OrderDB()
table = TableDB()
menu = MenuDB()

origins = [
    'http://localhost:3000',
    'localhost:3000',
    'localhost:3000/menu'
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
def menu_category_update_order_api(reqbody: CategoryOrder):
    try:
        menu.update_order_menu_category(reqbody.name, reqbody.is_up)
    except Exception as e:
        print(str(e))
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(reqbody: CategoryUpdate):
    menu.update_details_category(reqbody.name, reqbody.new_name)
    return {}

@app.get("/menu/list/categories")
def menu_view_categories():
    return menu.get_all_categories()

# @app.get("/menu/list/items")
# def menu_view_api(cat_id):
#     return menu.get_items_in_category(cat_id)
@app.get("/menu/list/items/{cat_id}")
def menu_view_api(cat_id: str):
    try:
        return menu.get_items_in_category(cat_id)
    except Exception as e:
        print(str(e))

@app.post("/menu/item/add")
def item_add_api(reqbody: Item):    
    try:
        menu.item_add(reqbody.category, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    except Exception as e:
        print(str(e))
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
def order_cart_add(reqbody: Order):
    order.add_order(reqbody.table_id, reqbody.item, reqbody.amount)
    return {}

@app.get('/order/cart/list')
def order_cart_list(table_id: int):
    return order.get_table_order(table_id)

@app.get('/order/listall')
def order_listall():
    return order.get_all_orders()

############ TABLE #################

@app.post('/table/select')
def table_select(reqbody: Table_Cust):
    table.select_table_number(reqbody.table_id)
    return {}

@app.get('/table/status')
def table_status():
    return table.get_all_tables_status()

@app.put('/table/status/update')
def table_status_update(reqbody: Table):
    table.update_table_status(reqbody.table_id, reqbody.status)
    return {}

