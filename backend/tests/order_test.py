import pytest

from src.order_db import OrderDB
from src.error import InputError

def test_add_order_invalid_table_number():

    order = OrderDB()
    with pytest.raises(InputError):
        order.add_order(-1, "sushi", 1)

def test_add_order_invalid_amount():
    order = OrderDB()

    with pytest.raises(InputError):
        order.add_order(1, "sushi", -1)
    
    with pytest.raises(InputError):
        order.add_order(1, "sushi", 0)

# def test_valid_add_order():
#     order = OrderDB()
#     order.

def test_table_list():
    order = OrderDB()
    order.clear_order_table()

    order.add_order(1, "salmon sushi", 2)
    order.add_order(1, "dorayaki", 1)

    table_order = order.get_table_order(1)

    assert len(table_order) == 2

def test_get_all_orders():

    order = OrderDB()
    order.clear_order_table()

    order.add_order(1, "salmon sushi", 2)
    order.add_order(2, "dorayaki", 1)
    order.add_order(3, "coke", 2)

    table_order = order.get_all_orders()

    assert len(table_order) == 3

