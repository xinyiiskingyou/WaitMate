import pytest
from src.error import InputError
from src.checkout import CheckoutDB
from tests.conftest import VALID, INPUTERROR

checkout = CheckoutDB()

def test_checkout_invalid_tip(table_id_1):

    checkout.clear_data()
    with pytest.raises(InputError):
        checkout.checkout_bill_tips(table_id_1, -1)

def test_checkout_invalid_coupon(table_id_1):

    checkout.clear_data()
    with pytest.raises(InputError):
        checkout.checkout_bill_coupon(table_id_1, 'Cats')

def test_checkout_bill_invalid_table():
    with pytest.raises(InputError):
        checkout.checkout_bill(29999)
    with pytest.raises(InputError):
        checkout.checkout_bill(-1)

def test_checkout_bill_simple(order_japanese):
    assert checkout.checkout_bill(order_japanese) != {}

def test_checkout_bill_tip_invalid_table():
    with pytest.raises(InputError):
        checkout.checkout_bill_tips(29999, 1)
    with pytest.raises(InputError):
        checkout.checkout_bill_tips(-1, 1)

def test_checkout_bill_tip(order_japanese):
    checkout.clear_data()

    checkout.checkout_bill_tips(order_japanese, 5)
    assert checkout.checkout_bill(order_japanese) != {}

def test_checkout_bill_coupon_invalid_table():
    with pytest.raises(InputError):
        checkout.checkout_bill_coupon(29999, 10)
    with pytest.raises(InputError):
        checkout.checkout_bill_coupon(-1, 10)

def test_checkout_coupon_create_invalid_amount():
    checkout.clear_data()

    with pytest.raises(InputError):
        checkout.checkout_coupon_create('catsz' ,-1)
    with pytest.raises(InputError):
        checkout.checkout_coupon_create('catsz', -100)

def test_checkout_coupon(order_japanese):
    checkout.clear_data()

    checkout.checkout_coupon_create('catsz', 50)
    checkout.checkout_bill_coupon(order_japanese, 'catsz')

    res = checkout.checkout_bill(order_japanese)
    assert res != {}
    assert res['total'] != 0

def test_checkout_coupon_invalid_code():
    with pytest.raises(InputError):
        checkout.checkout_coupon_delete('gdfgfdgfdg') 
    with pytest.raises(InputError):
        checkout.checkout_coupon_delete(' ')

def test_checkout_coupon_delete():
    checkout.clear_data()

    checkout.checkout_coupon_create('catsz1', 50)
    assert checkout.checkout_coupon_view() == [{'code': 'catsz1', 'amount': 50}]

    checkout.checkout_coupon_delete('catsz1')
    assert checkout.checkout_coupon_view() == []

######################################
########## endpoint tests ############
######################################

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
