import sys
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query, Body
from src.order import OrderDB
from src.table import TableDB
from src.menu import MenuDB
from src.notifications import Notifications
from src.tracking import Tracking
from src.model.category_req import Category
from src.model.category_order_req import CategoryOrder
from src.model.category_update_req import CategoryUpdate
from src.model.item_req import Item
from src.model.table_req import Table
from src.model.order_req import Order

sys.path.append('..')

app = FastAPI()
order = OrderDB()
table = TableDB()
menu = MenuDB()
track = Tracking()
notification = Notifications()

origins = [
    'http://localhost:3000',
    'localhost:3000',
    'localhost:3000/menu'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
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
    menu.update_order_menu_category(reqbody.name, reqbody.is_up)
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(reqbody: CategoryUpdate):
    menu.update_details_category(reqbody.name, reqbody.new_name)
    return {}

@app.get("/menu/list/categories")
def menu_view_categories():
    return menu.get_all_categories()

@app.get("/menu/list/items/{cat_id}")
def menu_view_api(cat_id: str):
    return menu.get_items_in_category(int(cat_id))

@app.post("/menu/item/add")
def item_add_api(reqbody: Item):    
    menu.item_add(reqbody.category, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
    return {}

@app.put("/menu/item/update/details")
def menu_item_update_details_api(reqbody: Item):
    menu.update_details_menu_items(reqbody.category, reqbody.item_id, reqbody.name, reqbody.cost, reqbody.description, reqbody.ingredients, reqbody.is_vegan)
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

############ TRACKING #################

@app.get('/track/customer/dish')
def track_dish_status(table_id: int):
    return track.customer_view_dish_status(table_id)

@app.put('/track/kitchen/mark')
def track_kitchen_order(order_req: Order, table_req: Table):
    track.kitchen_mark_order_completed(table_req.table_id, order_req.item)
    return {}

@app.put('/track/waitstaff/mark')
def track_waitstaff_order(order_req: Order, table_req: Table):
    track.waitstaff_mark_order_completed(table_req.table_id, order_req.item)
    return {}

############ NOTIFICATIONS #################

@app.post('/notification/customer/send')
def customer_request_assistance(reqbody: Table):
    notification.customer_send_notification(reqbody.table_id, reqbody.status)
    return {}

@app.get('/notification/waitstaff/get/customer')
def waitstaff_get_from_customer():
    return notification.waitstaff_receives_from_customer()

@app.get('/notification/waitstaff/get/kitchen')
def waitstaff_get_from_customer():
    return notification.waitstaff_receives_from_kitchen()