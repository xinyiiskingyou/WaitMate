import pytest
from src.error import InputError, AccessError
from src.tracking import Tracking
from src.table import TableDB
from src.order import OrderDB
from tests.conftest import VALID, INPUTERROR

track = Tracking()
table = TableDB()
order = OrderDB()

def test_customer_track_dish_valid(empty, menu_japanese, table_id_3):
    # add the item with the same name 3 times
    order.clear_order_table()

    order.add_order(table_id_3, menu_japanese[2], 1)
    order.add_order(table_id_3, menu_japanese[2], 1)
    order.add_order(table_id_3, menu_japanese[2], 1)

    res = order.get_table_order(3)
    assert len(res) == 3
    assert res[0][0] == "tempura"
    assert res[0][2] == 0
    assert res[0][3] == 0
    
def test_kitchen_mark_order_invalid_table_id():
    with pytest.raises(InputError):
        track.kitchen_mark_order_completed(100, "dorayaki")
    with pytest.raises(InputError):
        track.kitchen_mark_order_completed(-1, "dorayaki")
    with pytest.raises(InputError):
        track.kitchen_mark_order_completed(25, "dorayaki")

def test_kitchen_mark_order_invalid_item(table_id_1):
    with pytest.raises(InputError):
        track.kitchen_mark_order_completed(table_id_1, "_")
    with pytest.raises(InputError):
        track.kitchen_mark_order_completed(table_id_1, "")
    with pytest.raises(InputError):
        track.kitchen_mark_order_completed(table_id_1, "tuna sushi")
        
def test_kitchen_mark_order_valid(table_id_3, menu_japanese):

    track.kitchen_mark_order_completed(table_id_3, menu_japanese[2])
    res = order.get_table_order(table_id_3)
    assert len(res) == 3
    assert res[0][2] == 1
    # the other item with the same name will not be marked
    assert res[1][2] == 0
    assert res[2][2] == 0

def test_waitstaff_mark_order_invalid_item(table_id_1):
    with pytest.raises(InputError):
        track.waitstaff_mark_order_completed(table_id_1, "_")
    with pytest.raises(InputError):
        track.waitstaff_mark_order_completed(table_id_1, "")
    with pytest.raises(InputError):
        track.waitstaff_mark_order_completed(table_id_1, "tuna sushi")

def test_waitstaff_mark_order_invalid_status(table_id_3, menu_japanese):

    track.waitstaff_mark_order_completed(table_id_3, menu_japanese[2])
    
    # if the waitstaff tries to mark an item that is not ready
    with pytest.raises(AccessError):
        track.waitstaff_mark_order_completed(table_id_3, menu_japanese[2])

def test_kitchen_mark_order_invalid_status(menu_japanese):
    
    item = menu_japanese[2]
    track.kitchen_mark_order_completed(3, item)
    track.kitchen_mark_order_completed(3, item)
    
    res = order.get_table_order(3)

    assert res[1][2] == 1
    assert res[2][2] == 1
    
    # raise error if all the dorayaki is served
    with pytest.raises(AccessError):
        track.kitchen_mark_order_completed(3, item)

def test_waitstaff_mark_order_invalid_serve(menu_japanese):
    
    item = menu_japanese[2]
    
    track.waitstaff_mark_order_completed(3, item)
    track.waitstaff_mark_order_completed(3, item)
    
    res = order.get_table_order(3)
    assert res[1][3] == 1
    assert res[2][3] == 1
    
    # raise error if all the dorayaki is served
    with pytest.raises(AccessError):
        track.waitstaff_mark_order_completed(3, item)
        
######################################
########## endpoint tests ############
######################################
    
def test_kitchen_mark_order(client, kitchen_staff):
    # valid
    order.add_order(3, "salmon sushi", 2)

    resp = client.put("/track/kitchen/mark", 
        json={
            "order_req": {
                "item": "salmon sushi",
            },
            "table_req": {
                "table_id": 3,
            }
        },
        headers=kitchen_staff
    ) 
    assert resp.status_code == VALID
    
    # invalid id
    resp = client.put("/track/kitchen/mark", 
        json={
            "order_req": {
                "item": "dorayaki",
            },
            "table_req": {
                "table_id": 100,
            }
        },
        headers=kitchen_staff
    ) 
    assert resp.status_code == INPUTERROR
    
    # invalid item
    resp = client.put("/track/kitchen/mark", 
        json={
            "order_req": {
                "item": "_",
            },
            "table_req": {
                "table_id": 3,
            }
        },
        headers=kitchen_staff
    ) 
    assert resp.status_code == INPUTERROR

def test_waitstaff_mark_order(client, waitstaff_token):
    # valid
    resp = client.put("/track/waitstaff/mark", 
        json={
            "order_req": {
                "item": "salmon sushi",
            },
            "table_req": {
                "table_id": 3,
            }
        },
        headers=waitstaff_token
    ) 
    assert resp.status_code == VALID
    
    # invalid id
    resp = client.put("/track/waitstaff/mark", 
        json={
            "order_req": {
                "item": "dorayaki",
            },
            "table_req": {
                "table_id": 100,
            }
        },
        headers=waitstaff_token
    ) 
    assert resp.status_code == INPUTERROR
    
    # invalid item
    resp = client.put("/track/waitstaff/mark", 
        json={
            "order_req": {
                "item": "__",
            },
            "table_req": {
                "table_id": 3,
            }
        },
        headers=waitstaff_token
    ) 
    assert resp.status_code == INPUTERROR
