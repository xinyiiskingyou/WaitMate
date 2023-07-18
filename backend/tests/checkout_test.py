import pytest
from src.error import InputError
from src.checkout import Checkout
from tests.conftest import VALID, INPUTERROR

checkout = Checkout()

def test_checkout_invalid_tip(table_id_1):

    checkout.clear_data()
    with pytest.raises(InputError) as error:
        checkout.checkout_bill_tips(table_id_1, -1)
    assert str(error.value) == 'Invalid tip amount.'
    
def test_checkout_invalid_coupon(table_id_1):

    checkout.clear_data()
    with pytest.raises(InputError) as error:
        checkout.checkout_bill_coupon(table_id_1, 'Cats')
    assert str(error.value) == 'Invalid coupon.'

def test_checkout_order(order_japanese):

    checkout.clear_data()
    exp = [
        {'name': 'salmon sushi', 'cost': 10, 'amount': 1},
        {'name': 'dorayaki', 'cost': 12, 'amount': 2}
    ]
    assert checkout.checkout_order(order_japanese) == exp

def test_checkout_bill_simple(order_japanese):
    assert checkout.checkout_bill(order_japanese) != {}

def test_checkout_bill_tip(order_japanese):
    checkout.clear_data()

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

def test_checkout_coupon(order_japanese):
    checkout.clear_data()

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

def test_checkout_coupon_delete():
    checkout.clear_data()

    checkout.checkout_coupon_create('catsz1', 50)
    assert checkout.checkout_coupon_view() == [{'code': 'catsz1', 'amount': 50}]

    checkout.checkout_coupon_delete('catsz1')
    assert checkout.checkout_coupon_view() == []


######################################
########## endpoint tests ############
######################################

def test_checkout_order_endpoint(client, table_id_1):
    resp = client.get(f'/checkout/order/{table_id_1}')
    assert resp.status_code == VALID

def test_checkout_bill_endpoint(client, table_id_1):
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

def test_checkout_coupon_create_endpoint(client, manager_token):
    resp = client.post('/checkout/coupon/create', json={'code': 'heps', 'amount': 10},
        headers=manager_token)    
    assert resp.status_code == VALID

    resp = client.post('/checkout/coupon/create', json={'code': 'heps', 'amount': 10},
        headers=manager_token)         
    assert resp.status_code == INPUTERROR

def test_checkout_coupon_view_endpoint(client, manager_token):
    resp = client.get('/checkout/coupon/view', headers=manager_token)
    assert resp.status_code == VALID


