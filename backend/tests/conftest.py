import pytest
import os
import datetime
from src.table import TableDB
from src.menu import MenuDB
from src.order import OrderDB

from fastapi.testclient import TestClient
from src.clear import clear_database
from app.api import app


VALID = 200
ACCESSERROR = 403
INPUTERROR = 400

table = TableDB()
menu = MenuDB()
order = OrderDB()

@pytest.fixture
def client():
    return TestClient(app, raise_server_exceptions=False)

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
    clear_database('Menu')
    clear_database('Categories')
    clear_database('Items')

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

    return ['salmon sushi', 'dorayaki']

@pytest.fixture
def order_japanese(menu_japanese, table_id_1):
    order.add_order(table_id_1, menu_japanese[0], 1)
    order.add_order(table_id_1, menu_japanese[1], 2)
    return table_id_1

@pytest.fixture
def empty():
    if os.path.exists("./src/database/restaurant.db"):
        os.remove("./src/database/restaurant.db")

@pytest.fixture
def valid_date():
    return str(datetime.date.today() + datetime.timedelta(days=1))
