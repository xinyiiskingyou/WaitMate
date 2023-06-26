import pytest

from src.error import InputError
from src.table import TableDB

table = TableDB()

def test_invalid_select_table_id():

    with pytest.raises(InputError):
        table.select_table_number(-1)
    with pytest.raises(InputError):
        table.select_table_number(-100)

def test_invalid_select_duplicate_table_id(table_id_1):

    table.clear_tables_data()

    table.select_table_number(table_id_1)

    with pytest.raises(InputError):
        table.select_table_number(table_id_1)

def test_valid_select_table_id():

    table.clear_tables_data()

    table.select_table_number(1)
    table.select_table_number(2)
    table.select_table_number(3)
    table.select_table_number(4)

    tables = table.get_all_tables_status()
    assert len(tables) == 4

def test_valid_check_table_status():

    table.clear_tables_data()

    table.select_table_number(1)

    tables = table.get_all_tables_status()
    assert len(tables) == 1

    assert tables[1] == 'OCCUPIED'

def test_update_table_status_invalid_table_id():

    table.clear_tables_data()

    with pytest.raises(InputError) as error:
        table.update_table_status(1, 'ASSIST')
    assert str(error.value) == 'Table id is not available.'
    
    with pytest.raises(InputError) as error:
        table.update_table_status(100, 'ASSIST')
    assert str(error.value) == 'Table id is not available.'

    with pytest.raises(InputError) as error:
        table.update_table_status(-1, 'ASSIST')
    assert str(error.value) == 'Table id is not available.'

def test_update_table_status_invalid_status(table_id_1):

    with pytest.raises(InputError) as error:
        table.update_table_status(table_id_1, 'abc')
    assert str(error.value) == 'Unknown status'

    with pytest.raises(InputError) as error:
        table.update_table_status(table_id_1, 'fdsfadfs')
    assert str(error.value) == 'Unknown status'
    
def test_valid_update_table_status(table_id_1, table_id_2):

    table.update_table_status(table_id_1, 'BILL')
    tables = table.get_all_tables_status()

    assert tables[table_id_1] == 'BILL'
    assert tables[table_id_2] == 'OCCUPIED'

    table.update_table_status(table_id_2, 'ASSIST')
    tables = table.get_all_tables_status()
    assert tables[table_id_2] == 'ASSIST'
    assert tables[table_id_1] == 'BILL'

def test_valid_update_reselect_table_id():

    table.clear_tables_data()

    # customer selects table 88
    table.select_table_number(88)
    tables = table.get_all_tables_status()
    assert tables[88] == 'OCCUPIED'

    # the table status is updated to be empty
    table.update_table_status(88, 'EMPTY')

    # table no. 1 is avaliable again
    table.select_table_number(88)
