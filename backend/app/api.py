import sys
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query, Body, Response, Depends, Cookie
from fastapi.security import HTTPBasic, OAuth2PasswordRequestForm, HTTPBearer, OAuth2PasswordBearer
from src.order import OrderDB
from src.table import TableDB
from src.menu import MenuDB
from src.auth import auth
from src.notifications import Notifications
from src.tracking import Tracking
from src.checkout import Checkout
from src.model.category_req import Category
from src.model.category_order_req import CategoryOrder
from src.model.category_update_req import CategoryUpdate
from src.model.item_req import Item
from src.model.table_req import Table
from src.model.order_req import Order
from src.model.auth_req import LoginMan, Password, Email, StaffType
from src.model.coupon_req import Coupon, Coupon_Cust, Coupon_Code
from src.model.bill_req import Tip
import jwt
from src.error import AccessError


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='http://localhost:8000/auth/manager/login')

sys.path.append('..')

# cred = credentials.Certificate('eeee_service_account_keys.json')
# firebase = firebase_admin.initialize_app(cred)
# pb = pyrebase.initialize_app(json.load(open('./src/waitmate-ba463-firebase-adminsdk-ea5im-72b77a7f6f.json')))


app = FastAPI()
security = HTTPBearer()

order = OrderDB()
table = TableDB()
menu = MenuDB()
# auth = Auth()
track = Tracking()
notification = Notifications()
checkout = Checkout()

origins = [
    'http://localhost:3000',
    'localhost:3000',
    'localhost:3000/menu',
    'localhost:3001',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user: dict = {}

    try:
        user = auth.is_authenticated(token)
    except:
        raise AccessError("Unauth")

    if user == {}:
        raise AccessError("Unauth")

    return {'user' : user, 'token': token}

@app.get('/', tags=['root'])
async def read_root() -> dict:
    return {"message": "Welcome to our wait management system."}

############ MENU #################

@app.post("/menu/category/add")
def category_add_api(reqBody: Category, user: dict = Depends(get_current_user)): 
    auth.is_authorized(['manager'], user['user'])
    menu.category_add(reqBody.name)
    return {}

@app.put("/menu/category/update/order")
def menu_category_update_order_api(reqbody: CategoryOrder, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    menu.update_order_menu_category(reqbody.name, reqbody.is_up)
    return {}

@app.put("/menu/category/update/details")
def menu_category_update_details_api(reqbody: CategoryUpdate,  user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    menu.update_details_category(reqbody.name, reqbody.new_name)
    return {}

@app.get("/menu/list/categories")
def menu_view_categories():
    return menu.get_all_categories()

@app.get("/menu/list/items/{cat_id}")
def menu_view_api(cat_id: str):
    return menu.get_items_in_category(int(cat_id))

@app.post("/menu/item/add")
def item_add_api(reqbody: Item, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    item_data = {
        'category': reqbody.category,
        'name': reqbody.name,
        'cost': reqbody.cost,
        'description': reqbody.description,
        'ingredients': reqbody.ingredients,
        'is_vegan': reqbody.is_vegan
    }
    menu.item_add(item_data)
    return {}

@app.put("/menu/item/update/details")
def menu_item_update_details_api(reqbody: Item, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    updates = {
        'name': reqbody.name,
        'cost': reqbody.cost,
        'description': reqbody.description,
        'ingredients': reqbody.ingredients,
        'is_vegan': reqbody.is_vegan
    }
    menu.update_details_menu_items(reqbody.category, reqbody.item_id, **updates)
    return {}

@app.put("/menu/item/update/order")
def menu_item_update_order_api(reqbody: Item, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    menu.update_order_menu_items(reqbody.name, reqbody.is_up)
    return {}

@app.delete("/menu/item/remove")
def menu_item_remove_api(reqbody: Item, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
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
def order_listall(user: dict = Depends(get_current_user)):
    auth.is_authorized(['waitstaff', 'manager', 'kitchenstaff'], user['user'])
    return order.get_all_orders()

############ TABLE #################

@app.post('/table/select')
def table_select(reqbody: Table):
    table.select_table_number(reqbody.table_id)
    return {}

@app.get('/table/status')
def table_status(user: dict = Depends(get_current_user)):
    auth.is_authorized(['waitstaff'], user['user'])
    return table.get_all_tables_status()

@app.put('/table/status/update')
def table_status_update(reqbody: Table, user: dict = Depends(get_current_user)):
    auth.is_authorized(['waitstaff'], user['user'])
    table.update_table_status(reqbody.table_id, reqbody.status)
    return {}

############ USER MANAGEMENT #################

@app.post("/auth/user")
def auth_user_api(reqbody: StaffType, current_user = Depends(get_current_user)):
    auth.is_authorized(reqbody.stafftype, current_user['user'])
    return current_user['token']

@app.post("/auth/manager/login")
def auth_password_api(form_data: OAuth2PasswordRequestForm = Depends()):
    token = auth.login_mananger(form_data.username, form_data.password)
    return token["token"]

@app.post("/auth/waitstaff/login")
def auth_waitstaff_password_api(reqbody: Password):
    token = auth.login_staff(reqbody.password, True)
    return token["token"]

@app.post("/auth/kitchenstaff/login")
def auth_kitchenstaff_password_api(reqbody: Password):
    token = auth.login_staff(reqbody.password, False)
    return token["token"]

@app.post("/auth/manager/update/email")
def auth_manager_update_email_api(reqbody: Email, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    auth.change_email_mananger(user['user'], reqbody.email)
    return {}
    
@app.post("/auth/manager/update/password")
def auth_manager_update_password_api(user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    auth.change_password_mananger(user)
    return {}

@app.post("/auth/waitstaff/update/password")
def auth_waitstaff_password_api(form_data: OAuth2PasswordRequestForm = Depends(), user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    auth.change_password_staff(form_data.password, True)
    return {}

@app.post("/auth/kitchenstaff/update/password")
def auth_kitchen_password_api(form_data: OAuth2PasswordRequestForm = Depends(), user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    auth.change_password_staff(form_data.password, False)
    return {}

@app.delete("/auth/delete")
def auth_kitchen_password_api(user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    auth.delete_all()
    return {}

############ TRACKING #################

@app.get('/track/customer/dish')
def track_dish_status(table_id: int):
    return track.customer_view_dish_status(table_id)

@app.put('/track/kitchen/mark')
def track_kitchen_order(order_req: Order, table_req: Table, user: dict = Depends(get_current_user)):
    auth.is_authorized(['kitchenstaff'], user['user'])
    track.kitchen_mark_order_completed(table_req.table_id, order_req.item)
    return {}

@app.put('/track/waitstaff/mark')
def track_waitstaff_order(order_req: Order, table_req: Table, user: dict = Depends(get_current_user)):
    auth.is_authorized(['waitstaff'], user['user'])
    track.waitstaff_mark_order_completed(table_req.table_id, order_req.item)
    return {}

############ NOTIFICATIONS #################

@app.post('/notification/customer/send')
def customer_request_assistance(reqbody: Table):
    notification.customer_send_notification(reqbody.table_id, reqbody.status)
    return {}

@app.get('/notification/waitstaff/get/customer')
def waitstaff_get_from_customer(user: dict = Depends(get_current_user)):
    auth.is_authorized(['waitstaff'], user['user'])
    return notification.waitstaff_receives_from_customer()

@app.get('/notification/waitstaff/get/kitchen')
def waitstaff_get_from_kitchen(user: dict = Depends(get_current_user)):
    auth.is_authorized(['waitstaff'], user['user'])
    return notification.waitstaff_receives_from_kitchen()

############ CHECKOUT #################

@app.get('/checkout/order/{id}')
def checkout_order_api(id: int):
    return checkout.checkout_order(id)

@app.get('/checkout/bill/{id}')
def checkout_bill_api(id: int):
    return checkout.checkout_bill(id)

@app.post('/checkout/bill/tips')
def checkout_bill_tips_api(reqbody: Tip):
    checkout.checkout_bill_tips(reqbody.id, reqbody.amount)
    return {}

@app.post('/checkout/bill/coupon')
def checkout_bill_coupon_api(reqbody: Coupon_Cust):
    checkout.checkout_bill_coupon(reqbody.id, reqbody.code)
    return {}

@app.post('/checkout/coupon/create')
def checkout_coupon_create_api(reqbody: Coupon, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    checkout.checkout_coupon_create(reqbody.code, reqbody.int, reqbody.expiry)
    return {}

@app.delete('/checkout/coupon/delete')
def checkout_coupon_delete_api(reqbody: Coupon_Code, user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    checkout.checkout_coupon_delete(reqbody.code)
    return {}

@app.get('/checkout/coupon/view')
def checkout_coupon_view_api(user: dict = Depends(get_current_user)):
    auth.is_authorized(['manager'], user['user'])
    return checkout.checkout_coupon_view()
