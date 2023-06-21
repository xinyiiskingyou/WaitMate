import pytest

from src.error import InputError
from database.table_db import table_DB

def test_invalid_select_table_id():
    table = table_DB()

    with pytest.raises(InputError):
        table.select_table_number(-1)
    with pytest.raises(InputError):
        table.select_table_number(-100)

def test_invalid_select_duplicate_table_id():
    table = table_DB()
    table.clear_tables_data()

    table.select_table_number(1)

    with pytest.raises(InputError):
        table.select_table_number(1)

def test_valid_select_table_id():
    table = table_DB()
    table.clear_tables_data()

    table.select_table_number(1)
    table.select_table_number(2)
    table.select_table_number(3)
    table.select_table_number(4)

    tables = table.check_all_table_status()
    assert len(tables) == 4

def test_valid_check_table_status():
    table = table_DB()
    table.clear_tables_data()

    table.select_table_number(1)

    tables = table.check_all_table_status()
    assert len(tables) == 1

    assert tables[1] == 'OCCUPIED'

def test_update_table_status_invalid_table_id():
    table = table_DB()
    table.clear_tables_data()

    with pytest.raises(InputError) as error:
        table.update_table_status(1, 'ASSIST')
    assert str(error.value) == "400 Bad Request: Table number is not available"
    
    with pytest.raises(InputError) as error:
        table.update_table_status(-1, 'ASSIST')
    assert str(error.value) == "400 Bad Request: Table number is not available"
    

def test_update_table_status_invalid_status():
    table = table_DB()
    table.clear_tables_data()

    table.select_table_number(1)
    with pytest.raises(InputError) as error:
        table.update_table_status(1, 'abc')
    assert str(error.value) == "400 Bad Request: Unknown status"

    with pytest.raises(InputError) as error:
        table.update_table_status(1, 'fdsfadfs')
    assert str(error.value) == "400 Bad Request: Unknown status"
    
def test_valid_update_table_status():
    table = table_DB()
    table.clear_tables_data()

    table.select_table_number(1)
    table.select_table_number(2)

    table.update_table_status(1, 'BILL')
    tables = table.check_all_table_status()

    assert tables[1] == 'BILL'
    assert tables[2] == 'OCCUPIED'

    table.update_table_status(2, 'ASSIST')
    tables = table.check_all_table_status()
    assert tables[2] == 'ASSIST'
    assert tables[1] == 'BILL'
