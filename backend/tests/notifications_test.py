import pytest
from tests.conftest import VALID, INPUTERROR
from src.error import InputError
from src.notifications import Notifications
from src.table import TableDB
from src.order import OrderDB
from src.tracking import Tracking

notications = Notifications()
table = TableDB()
order = OrderDB()
track = Tracking()
 
def test_customer_request_assistance_invalid_id():
    with pytest.raises(InputError):
        notications.customer_send_notification(1000, "BILL")
    with pytest.raises(InputError):
        notications.customer_send_notification(-1, "BILL")
    with pytest.raises(InputError):
        notications.customer_send_notification(25, "BILL")
        
def test_customer_request_assistance_invalid_status(table_id_1):
    with pytest.raises(InputError):
        notications.customer_send_notification(table_id_1, "_")
    with pytest.raises(InputError):
        notications.customer_send_notification(table_id_1, "dfsdsfd")
    with pytest.raises(InputError):
        notications.customer_send_notification(table_id_1, "")
        
def test_customer_request_assistance_valid(table_id_1, table_id_2):
    
    notications.customer_send_notification(table_id_1, "BILL")
    assert table.get_all_tables_status()[table_id_1] == "BILL"
    
    notications.customer_send_notification(table_id_2, "ASSIST")
    assert table.get_all_tables_status()[table_id_2] == "ASSIST"

def test_waitstaff_receive_from_customer():
    
    # the waitstaff will receive notification when customer requested
    res = notications.waitstaff_receives_from_customer()
    assert len(res) != 0

def test_waitstaff_receive_from_kitchen(table_id_3, menu_japanese):
    
    order.add_order(table_id_3, "dorayaki", 1)
    # after the kitchen staff marks the order
    track.kitchen_mark_order_completed(table_id_3, "dorayaki")
    
    # the waitstaff will receive the notification
    res = notications.waitstaff_receives_from_kitchen()
    assert len(res) != 0

######################################
########## endpoint tests ############
######################################

def test_send_notification_endpoint(client):
    # valid
    resp = client.post("/notification/customer/send", json={
        "table_id": 1,
        "status": "BILL"
    })
    assert resp.status_code == VALID
    
    # invalid id
    resp = client.post("/notification/customer/send", json={
        "table_id": 100,
        "status": "BILL"
    })
    assert resp.status_code == INPUTERROR
    
    # invalid status
    resp = client.post("/notification/customer/send", json={
        "table_id": 100,
        "status": "_"
    })
    assert resp.status_code == INPUTERROR
    
def test_waitstaff_receive_customer_endpoint(client):
    resp = client.get('/notification/waitstaff/get/customer')
    assert resp.status_code == VALID
    
def test_waitstaff_receive_customer_endpoint(client):
    resp = client.get('/notification/waitstaff/get/customer')
    assert resp.status_code == VALID

def test_waitstaff_receive_kitchen_endpoint(client):
    resp = client.get('/notification/waitstaff/get/kitchen')
    assert resp.status_code == VALID