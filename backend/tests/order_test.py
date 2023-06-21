import pytest

from database.order_db import OrderDB
from src.error import InputError

def test_add_order_invalid_table_number():

    order = OrderDB()
    with pytest.raises(InputError):
        order.add_order(-1, "sushi", 1)

def test_add_order_invalid_amount():
    order = OrderDB()
    with pytest.raises(InputError):
        order.add_order(1, "sushi", -1)

