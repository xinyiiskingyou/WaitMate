import sys
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query, Body, Response, Depends, Cookie
from src.order import OrderDB
from src.table import TableDB
from src.menu import MenuDB
from src.auth import Auth
from src.model.category_req import Category
from src.model.category_req import Category_ID
from src.model.category_order_req import CategoryOrder
from src.model.category_update_req import CategoryUpdate
from src.model.item_req import Item
from src.model.table_req import Table
from src.model.table_req import Table_Cust
from src.model.order_req import Order
from src.model.auth_req import LoginMan, Password, Email


sys.path.append('..')

# cred = credentials.Certificate('eeee_service_account_keys.json')
# firebase = firebase_admin.initialize_app(cred)
# pb = pyrebase.initialize_app(json.load(open('./src/waitmate-ba463-firebase-adminsdk-ea5im-72b77a7f6f.json')))


app = FastAPI()
order = OrderDB()
table = TableDB()
menu = MenuDB()
auth = Auth()


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
    auth.is_authenticated()
    auth.is_authorized(['manager'], )
    menu.category_add(reqBody.name)
    return {}

@app.put("/menu/category/update/order")
def menu_category_update_order_api(reqbody: CategoryOrder):
    menu.update_order_menu_category(reqbody.name, reqbody.is_up)
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
    return menu.get_items_in_category(int(cat_id))

@app.post("/menu/item/add")
def item_add_api(reqbody: Item):    
    menu.item_add(reqbody.category, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    return {}

@app.put("/menu/item/update/details")
def menu_item_update_details_api(reqbody: Item):
    menu.update_details_menu_items(reqbody.item_id, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    return {}

@app.put("/menu/item/update/order")
def menu_item_update_order_api(reqbody: Item):
    menu.update_order_menu_items(reqbody.name, reqbody.is_up)
    return {}

@app.delete("/menu/item/remove")
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
    print(reqbody)
    table.select_table_number(reqbody.table_id)
    return {}

@app.get('/table/status')
def table_status():
    return table.get_all_tables_status()

@app.put('/table/status/update')
def table_status_update(reqbody: Table):
    table.update_table_status(reqbody.table_id, reqbody.status)
    return {}

# User management
@app.post("/auth/manager/login")
def auth_password_api(reqbody: LoginMan):
    token = auth.login_mananger(reqbody.email, reqbody.password)
    return token["token"]

@app.post("/auth/waitstaff/login")
def auth_waitstaff_password_api(reqbody: Password):
    token = auth.login_staff(reqbody.password, True)
    return token["token"]

@app.post("/auth/kitchenstaff/login")
def auth_kitchenstaff_password_api(reqbody: Password):
    token = auth.login_staff(reqbody.password, False)
    return token["token"]

@app.post("/auth/logout")
def auth_password_api():
    token = auth.logout()
    return {}

@app.put("/auth/manager/update/email")
def auth_manager_update_email_api(reqbody: Email):
    user: dict = auth.is_authenticated('token')
    auth.change_email_mananger(user, reqbody.email)
    return {}
    
@app.put("/auth/manager/update/password")
def auth_manager_update_password_api(reqbody: Password):
    user: dict = auth.is_authenticated('token')
    auth.change_password_mananger(user, reqbody.password)
    return {}

@app.put("/auth/waitstaff/password")
def auth_waitstaff_password_api(reqbody: Password):
    auth.is_authenticated('token')
    auth.change_password_staff(reqbody.password)
    return {}

@app.put("/auth/kitchen/password")
def auth_kitchen_password_api():
    return {}

@app.delete("/auth/delete")
def auth_kitchen_password_api():
    return {}