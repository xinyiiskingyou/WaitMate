import pytest
from src.order import OrderDB
from src.error import InputError
from tests.conftest import VALID, INPUTERROR

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

def test_add_order_invalid_item_name(menu_japanese, table_id_1):
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

def test_valid_order_list(menu_japanese, table_id_1, table_id_2):

    order.clear_order_table()

    order.add_order(table_id_1, menu_japanese[0], 1)
    order.add_order(table_id_1, menu_japanese[1], 1)

    table_order = order.get_table_order(table_id_1)
    assert len(table_order) == 2

    order.add_order(table_id_2, menu_japanese[0], 1)
    table_order = order.get_table_order(table_id_2)
    assert len(table_order) == 1

def test_get_all_orders(table_id_1, table_id_2, menu_japanese):

    order.clear_order_table()

    order.add_order(table_id_1, menu_japanese[0], 2)
    order.add_order(table_id_2, menu_japanese[1], 1)
    order.add_order(table_id_2, menu_japanese[1], 2)

    table_order = order.get_all_orders()

    assert len(table_order) == 3

######################################
########## endpoint tests ############
######################################

def test_add_order_endpoint(client, table_id_1, menu_japanese):
    # valid
    resp = client.post('/order/cart/add', json={'id': table_id_1, 'item': 'dorayaki', 'amount': 1})

    assert resp.status_code == VALID

    # invalid table id
    resp = client.post('/order/cart/add', json={'id': 23, 'item': 'dorayaki', 'amount': 1})
    assert resp.status_code == INPUTERROR

    # invalid item
    resp = client.post('/order/cart/add', json={'id': table_id_1, 'item': 'tuna sushi', 'amount': 1})
    assert resp.status_code == INPUTERROR

    # invalid amount
    resp = client.post('/order/cart/add', json={'id': table_id_1, 'item': 'dorayaki', 'amount': -1})
    assert resp.status_code == INPUTERROR

def test_table_view_order_endpoint(client, table_id_1):
    # valid case
    resp = client.get('/order/cart/list', params={'table_id': table_id_1})
    assert resp.status_code == VALID

    # invalid table id
    resp = client.get('/order/cart/list', params={'table_id': 23})
    assert resp.status_code == INPUTERROR

def test_table_view_all_order_endpoint(client, waitstaff_token):
    # valid case
    resp = client.get('/order/listall', headers=waitstaff_token)
    assert resp.status_code == VALID