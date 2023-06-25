import pytest
from src.table_db import TableDB
from src.menu import category_add, item_add
from fastapi.testclient import TestClient
from app.api import app

@pytest.fixture
def client():
    return TestClient(app, raise_server_exceptions=False)

@pytest.fixture
def table_id_1():
    table = TableDB()
    table.clear_tables_data()
    return table.select_table_number(1)
    
@pytest.fixture
def table_id_2():
    table = TableDB()
    return table.select_table_number(2)

@pytest.fixture
def table_id_3():
    table = TableDB()
    return table.select_table_number(3)






