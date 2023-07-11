import os
import pytest
from src.error import InputError
from src.checkout import Checkout
from tests.conftest import VALID, INPUTERROR

checkout = Checkout()

def checkout_pa():
    if os.path.exists("./src/database/restaurant.db"):
        os.remove("./src/database/restaurant.db")

def test_checkout_invalid_tip(empty, table_id_1):
    with pytest.raises(InputError) as error:
        checkout.checkout_bill_tips(table_id_1, -1)
    assert str(error.value) == 'Invalid tip amount.'
    
def test_checkout_invalid_coupon(empty, table_id_1):
    with pytest.raises(InputError) as error:
        checkout.checkout_bill_coupon(table_id_1, 'Cats')
    assert str(error.value) == 'Invalid coupon.'

def test_checkout_order_empty(empty, table_id_1):
    assert checkout.checkout_order(table_id_1) == []

def test_checkout_order(empty, order_japanese):
    exp = [
        {'name': 'salmon sushi', 'cost': 10, 'amount': 1},
        {'name': 'dorayaki', 'cost': 12, 'amount': 2}
    ]
    assert checkout.checkout_order(order_japanese) == exp

def test_checkout_bill_simple(empty, order_japanese):
    exp = {
        'items': [
            {'name': 'salmon sushi', 'cost': 10, 'amount': 1},
            {'name': 'dorayaki', 'cost': 12, 'amount': 2}
        ],
        'total': 22
    }
    assert checkout.checkout_bill(order_japanese) == exp

def test_checkout_bill_tip(empty, order_japanese):
    checkout.checkout_bill_tips(order_japanese, 5)
    exp = {
        'items': [
            {'name': 'salmon sushi', 'cost': 10, 'amount': 1},
            {'name': 'dorayaki', 'cost': 12, 'amount': 2}
        ],
        'tip': 5,
        'total': 27
    }
    assert checkout.checkout_bill(order_japanese) == exp

def test_checkout_coupon(empty, order_japanese):
    checkout.checkout_coupon_create('catsz', 50)
    checkout.checkout_bill_coupon(order_japanese, 'catsz')
    exp = {
        'items': [
            {'name': 'salmon sushi', 'cost': 10, 'amount': 1},
            {'name': 'dorayaki', 'cost': 12, 'amount': 2}
        ],
        'coupon': 'catsz',
        'total': 11
    }
    assert checkout.checkout_bill(order_japanese) == exp

def test_checkout_coupon_delete(empty):
    checkout.checkout_coupon_create('catsz', 50)
    assert checkout.checkout_coupon_view() == [{'code': 'catsz', 'int': 50}]

    checkout.checkout_coupon_delete('catsz')
    assert checkout.checkout_coupon_view() == []


######################################
########## endpoint tests ############
######################################

def test_checkout_order_endpoint(client, empty, table_id_1):
    resp = client.get(f'/checkout/order/{table_id_1}')
    assert resp.status_code == VALID

def test_checkout_bill_endpoint(client, empty, table_id_1):
    resp = client.get(f'/checkout/bill/{table_id_1}')
    assert resp.status_code == VALID

def test_checkout_bill_tips_endpoint(client, table_id_1):
    resp = client.post('/checkout/bill/tips', json={'id': table_id_1, 'amount': 0})
    assert resp.status_code == INPUTERROR

    resp = client.post('/checkout/bill/tips', json={'id': table_id_1, 'amount': 10})
    assert resp.status_code == VALID

def test_checkout_bill_coupons_endpoint(client, table_id_1):
    resp = client.post('/checkout/bill/coupon', json={'id': table_id_1, 'code': 'catsz'})
    assert resp.status_code == INPUTERROR

    checkout.checkout_coupon_create('catsz', 50)

    resp = client.post('/checkout/bill/coupon', json={'id': table_id_1, 'code': 'catsz'})
    assert resp.status_code == VALID

def test_checkout_coupon_create_endpoint(empty, client):
    resp = client.post('/checkout/coupon/create', json={'code': 'catsz', 'int': 10})
    assert resp.status_code == VALID

    resp = client.post('/checkout/coupon/create', json={'code': 'catsz', 'int': 10})
    assert resp.status_code == INPUTERROR

def test_checkout_coupon_view_endpoint(empty, client):
    resp = client.get('/checkout/coupon/view')
    assert resp.status_code == VALID