import pytest
from src.table import TableDB
from src.menu import MenuDB

table = TableDB()
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
