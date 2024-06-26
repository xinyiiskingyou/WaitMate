import pytest
import datetime
from src.table import TableDB
from src.menu import MenuDB
from src.order import OrderDB
from src.checkout import CheckoutDB
from src.meme import MemeDB
from src.auth import auth
from fastapi.testclient import TestClient
from app.api import app


VALID = 200
ACCESSERROR = 403
INPUTERROR = 400
NOTFOUNDERROR = 404

table = TableDB()
menu = MenuDB()
order = OrderDB()
checkout = CheckoutDB()
meme = MemeDB()

@pytest.fixture
def client():
    return TestClient(app, raise_server_exceptions=False)

@pytest.fixture
def manager_token():
    token = auth.login_mananger(auth.MANAGER_EMAIL, auth.PASSWORD)['token']
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def manager_token_plain():
    token = auth.login_mananger(auth.MANAGER_EMAIL, auth.PASSWORD)['token']
    return token

@pytest.fixture
def waitstaff_token():
    token = auth.login_staff(auth.PASSWORD, True)['token']
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def waitstaff_token_plain():
    token = auth.login_staff(auth.PASSWORD, True)['token']
    return token

@pytest.fixture
def kitchen_staff():
    token = auth.login_staff(auth.PASSWORD, False)['token']
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def table_id_1():
    table.clear_tables_data()
    return table.select_table_number(1)
    
@pytest.fixture
def table_id_2():
    return table.select_table_number(2)

@pytest.fixture
def table_id_3():
    return table.select_table_number(3)

@pytest.fixture
def menu_japanese():
    menu.clear_data()
    menu.category_add('Japanese')
    menu.item_add({
        'category': 'Japanese',
        'name': 'salmon sushi',
        'cost': 10,
        'description': '_',
        'ingredients': '_',
        'is_vegan': False
    })

    menu.item_add({
        'category': 'Japanese',
        'name': 'dorayaki',
        'cost': 6,
        'description': '_',
        'ingredients': '_',
        'is_vegan': False
    })
    
    menu.item_add({
        'category': 'Japanese',
        'name': 'tempura',
        'cost': 7,
        'description': '_',
        'ingredients': '_',
        'is_vegan': False
    })

    return ['salmon sushi', 'dorayaki', 'tempura']

@pytest.fixture
def order_japanese(menu_japanese, table_id_1):
    order.clear_order_table()
    order.add_order(table_id_1, menu_japanese[0], 1)
    order.add_order(table_id_1, menu_japanese[1], 2)
    return table_id_1

@pytest.fixture
def empty():
    order.clear_order_table()
    menu.clear_data()
    table.clear_tables_data()
    checkout.clear_data()
    meme.clear_data()

@pytest.fixture
def restart_auth():
    auth.delete_all()

@pytest.fixture
def valid_date():
    return str(datetime.date.today() + datetime.timedelta(days=1))
