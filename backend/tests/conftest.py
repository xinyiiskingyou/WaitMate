import pytest
import os
from src.table import TableDB
from src.menu import MenuDB
from fastapi.testclient import TestClient
from app.api import app

table = TableDB()
menu = MenuDB()

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
    if os.path.exists("./src/database/menu.db"):
        os.remove("./src/database/menu.db")

    menu.category_add('Japanese')
    menu.item_add('Japanese', 'salmon sushi', 10, '_', '_', False)
    menu.item_add('Japanese', 'dorayaki', 6, '_', '_', False)
