import pytest
from src.error import InputError, AccessError
from src.tracking import Tracking
from src.table import TableDB
from src.order import OrderDB

track = Tracking()
table = TableDB()
order = OrderDB()

def test_customer_request_assistance_invalid_id():
    with pytest.raises(InputError):
        track.customer_request_assistance(100, "BILL")
    with pytest.raises(InputError):
        track.customer_request_assistance(-1, "BILL")
    with pytest.raises(InputError):
        track.customer_request_assistance(25, "BILL")
        
def test_customer_request_assistance_invalid_status(table_id_1):
    with pytest.raises(InputError):
        track.customer_request_assistance(table_id_1, "_")
    with pytest.raises(InputError):
        track.customer_request_assistance(table_id_1, "dfsdsfd")
    with pytest.raises(InputError):
        track.customer_request_assistance(table_id_1, "")
        
def test_customer_request_assistance_valid(table_id_1, table_id_2):
    
    track.customer_request_assistance(table_id_1, "BILL")
    assert table.get_all_tables_status()[table_id_1] == "BILL"
    
    track.customer_request_assistance(table_id_2, "ASSIST")
    assert table.get_all_tables_status()[table_id_2] == "ASSIST"
    
def test_customer_track_dish_invalid_id():
    with pytest.raises(InputError):
        track.customer_view_dish_status(100)
    with pytest.raises(InputError):
        track.customer_view_dish_status(-1)
    with pytest.raises(InputError):
        track.customer_view_dish_status(25)

def test_customer_track_dish_valid(table_id_3):
    
    # add the item with the same name 3 times
    order.add_order(table_id_3, "dorayaki", 2)
    order.add_order(table_id_3, "dorayaki", 1)
    order.add_order(table_id_3, "dorayaki", 3)
    
    res = track.customer_view_dish_status(table_id_3)
    assert len(res) == 3
    assert res[0][0] == "dorayaki"
    assert res[0][1] == 0
    assert res[0][2] == 0
    
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
        
def test_kitchen_mark_order_valid(table_id_3):
    
    track.kitchen_mark_order_completed(table_id_3, "dorayaki")
    res = track.customer_view_dish_status(table_id_3)
    assert len(res) == 3
    assert res[0][1] == 1
    # the other item with the same name will not be marked
    assert res[1][1] == 0
    assert res[2][1] == 0

def test_waitstaff_mark_order_invalid_item(table_id_1):
    with pytest.raises(InputError):
        track.waitstaff_mark_order_completed(table_id_1, "_")
    with pytest.raises(InputError):
        track.waitstaff_mark_order_completed(table_id_1, "")
    with pytest.raises(InputError):
        track.waitstaff_mark_order_completed(table_id_1, "tuna sushi")
        
def test_waitstaff_mark_order_valid(table_id_3):
    
    track.waitstaff_mark_order_completed(table_id_3, "dorayaki")
    res = track.customer_view_dish_status(table_id_3)
    assert res[0][0] == "dorayaki"
    assert res[0][1] == 1
    assert res[0][2] == 1

def test_waitstaff_mark_order_invalid_status():
    
    # if the waitstaff tries to mark an item that is not ready
    with pytest.raises(AccessError):
        track.waitstaff_mark_order_completed(3, "dorayaki")
        
    res = track.customer_view_dish_status(3)
    assert res[1][0] == "dorayaki"
    assert res[1][1] == 0
    assert res[1][2] == 0
    
def test_kitchen_mark_order_invalid_status():
    
    track.kitchen_mark_order_completed(3, "dorayaki")
    track.kitchen_mark_order_completed(3, "dorayaki")
    
    res = track.customer_view_dish_status(3)
    assert res[1][1] == 1
    assert res[2][1] == 1
    
    # raise error if all the dorayaki is served
    with pytest.raises(AccessError):
        track.kitchen_mark_order_completed(3, "dorayaki")

def test_waitstaff_mark_order_invalid_serve():
    
    track.waitstaff_mark_order_completed(3, "dorayaki")
    track.waitstaff_mark_order_completed(3, "dorayaki")
    
    res = track.customer_view_dish_status(3)
    assert res[1][2] == 1
    assert res[2][2] == 1
    
    # raise error if all the dorayaki is served
    with pytest.raises(AccessError):
        track.waitstaff_mark_order_completed(3, "dorayaki")