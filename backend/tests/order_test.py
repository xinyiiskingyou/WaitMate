import pytest

from src.order import OrderDB
from src.error import InputError

order = OrderDB()
def test_add_order_invalid_table_number():

    order.clear_order_table()

    with pytest.raises(InputError):
        order.add_order(-1, 'sushi', 1)
    with pytest.raises(InputError):
        order.add_order(100, 'sushi', 1)

def test_add_order_invalid_amount(table_id_1):
    order.clear_order_table()

    with pytest.raises(InputError):
        order.add_order(table_id_1, 'sushi', -1)
    
    with pytest.raises(InputError):
        order.add_order(table_id_1, 'sushi', 0)

def test_add_order_invalid_item_name(table_id_1, menu_japanese):
    order.clear_order_table()

    with pytest.raises(InputError):
        order.add_order(table_id_1, 'sushi', 1)
    with pytest.raises(InputError):
        order.add_order(table_id_1, 'tuna sushi', 1)

def test_list_order_invalid_table_id():
    order.clear_order_table()

    with pytest.raises(InputError):
        order.get_table_order(-1)
    with pytest.raises(InputError):
        order.get_table_order(10)
    with pytest.raises(InputError):
        order.get_table_order(100)

def test_valid_order_list(table_id_1, table_id_2, menu_japanese):
    order.clear_order_table()

    order.add_order(table_id_1, 'salmon sushi', 1)
    order.add_order(table_id_1, 'dorayaki', 1)

    table_order = order.get_table_order(table_id_1)
    assert len(table_order) == 2

    order.add_order(table_id_2, 'salmon sushi', 1)
    table_order = order.get_table_order(table_id_2)
    assert len(table_order) == 1

def test_get_all_orders(table_id_1, table_id_2, table_id_3, menu_japanese):

    order.clear_order_table()

    order.add_order(table_id_1, 'salmon sushi', 2)
    order.add_order(table_id_2, 'dorayaki', 1)
    order.add_order(table_id_3, 'dorayaki', 2)

    table_order = order.get_all_orders()

    assert len(table_order) == 3
