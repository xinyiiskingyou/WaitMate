import pytest
from src.table_db import TableDB
from src.menu import category_add, item_add

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






