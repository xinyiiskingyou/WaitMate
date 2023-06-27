import json
import os
import pytest
from src.error import InputError, AccessError
from src.menu import MenuDB

menu = MenuDB()

def menu_1():
    if os.path.exists("./src/database/menu.db"):
        os.remove("./src/database/menu.db")

    menu.category_add('Fish')
    menu.category_add('Water')
    menu.item_add('Fish', 'SeaBass', '10', '_', '_', False)
    menu.item_add('Fish', 'FlatFish', '20', '_', '_', False)

def test_item_add_invalid_name():
    menu_1()

    with pytest.raises(InputError):
        menu.item_add('Fish', '', '1', '_', '_', False) 
    with pytest.raises(InputError):
        menu.item_add('Fish', 'BigSeaBassTodayYum', '1', '_', '_', False) 
    with pytest.raises(AccessError):
        menu.item_add('Fish', 'SeaBass', '1', '_', '_', False) 

def test_cat_add_invalid_name():
    menu_1()

    with pytest.raises(InputError):
        menu.category_add('') 
    with pytest.raises(InputError):
        menu.category_add('BigSeaBassTodayYum')
    with pytest.raises(InputError):
        menu.category_add('Fish')
    with pytest.raises(InputError):
        menu.category_add('fish')
    
def test_get_categories_valid():
    menu_1()

    res = menu.get_all_categories()
    assert len(res) == 2

def test_item_update_details_invalid_id():
    menu_1()

    with pytest.raises(InputError):
        menu.update_details_menu_items(100)
    with pytest.raises(InputError):
        menu.update_details_menu_items(3000, name='Big')
    with pytest.raises(InputError):
        menu.update_details_menu_items(-1, name='fsd')

def test_item_update_details_invalid_name():

    menu_1()
    with pytest.raises(InputError):
        menu.update_details_menu_items(1, name='SeaBass')
    with pytest.raises(InputError):
        menu.update_details_menu_items(1, name='BigSeaBassTodayYum')
    with pytest.raises(InputError):
        menu.update_details_menu_items(1, name='')

def test_item_update_details_valid_name():
    menu_1()
    original = menu.get_items_in_category(1)
    menu.update_details_menu_items(1, name='Haddock')
    result = menu.get_items_in_category(1)

    assert result != original
        
def test_cat_update_details_invalid():
    menu_1()
    with pytest.raises(InputError):
        menu.update_details_category('Fish', '') 
    with pytest.raises(InputError):
        menu.update_details_category('Fish', 'BigSeaBassTodayYum')  

def test_cat_update_details_valid():
    menu_1()

    orig = menu.get_all_categories()
    menu.update_details_category('Fish', 'Seafood') 
    res = menu.get_all_categories()

    assert orig != res

def test_item_update_order_invalid():
    menu_1()
    with pytest.raises(InputError):
        menu.update_order_menu_items('SeaBass', True) 
    with pytest.raises(InputError):
        menu.update_order_menu_items('FlatFish', False)

def test_item_update_order_valid():
    menu_1()
    original = menu.get_items_in_category(1)
    menu.update_order_menu_items('SeaBass', False) 
    res = menu.get_items_in_category(1)

    assert original != res

def test_cat_update_order_invalid():
    menu_1()
    with pytest.raises(InputError):
        menu.update_order_menu_category('Fish', True) 
    with pytest.raises(InputError):
        menu.update_order_menu_category('Water', False)

def test_cat_update_order_valid():
    menu_1()

    original = menu.get_all_categories()
    menu.update_order_menu_category('Fish', False) 
    result = menu.get_all_categories()
    assert original != result

def test_invalid_view_menu_item_in_category():
    menu_1()

    with pytest.raises(InputError):
        menu.get_items_in_category(3) 
    with pytest.raises(InputError):
        menu.get_items_in_category(4) 
    with pytest.raises(InputError):
        menu.get_items_in_category(-1) 

def test_valid_view_menu_item_in_category():
    menu_1()
    
    result = menu.get_items_in_category(1)
    assert result == [('SeaBass', 10, '_', '_', 0), ('FlatFish', 20, '_', '_', 0)]

def test_menu_remove():
    menu_1()
    assert len(menu.get_items_in_category(1)) == 2

    menu.remove_menu_items('FlatFish')
    assert len(menu.get_items_in_category(1)) == 1

######################################
########## endpoint tests ############
######################################

def test_category_add_endpoint(client):
    # valid case
    resp = client.post("/menu/category/add", json={'name': 'pizza'})
    assert resp.status_code == 200

    resp = client.post("/menu/category/add", json={'name': 'dessert'})
    assert resp.status_code == 200

    # duplicate name
    resp = client.post("/menu/category/add", json={'name': 'pizza'})
    assert resp.status_code == 400

    # invalid length naem
    resp = client.post("/menu/category/add", json={'name': 'fakdsjkdkfhdskfh'})
    assert resp.status_code == 400

def test_category_update_order_endpoint(client):
    # valid case
    resp = client.put("/menu/category/update/order", json={"name": "pizza"}, params={"is_up": False})
    assert resp.status_code == 200

    # invalid move
    resp = client.put("/menu/category/update/order", json={"name": "pizza"}, params={"is_up": False})
    assert resp.status_code == 400

    # invalid category name
    resp = client.put("/menu/category/update/order", json={"name": "random"}, params={"is_up": False})
    assert resp.status_code == 400

def test_category_update_name_endpoint(client):
    # valid case
    resp = client.put("/menu/category/update/details", json={
        "name": "pizza",
        "new_name": "Pizzas"
    })
    assert resp.status_code == 200

    resp = client.put("/menu/category/update/details", json={
        "name": "Pizzas",
        "new_name": "pizza"
    })
    assert resp.status_code == 200

    # invalid name
    resp = client.put("/menu/category/update/details", json={
        "name": "Pizzas",
        "new_name": "pizza"
    })
    assert resp.status_code == 400

    resp = client.put("/menu/category/update/details", json={
        "name": "pizza",
        "new_name": ""
    })
    assert resp.status_code == 400

def test_add_item_endpoint(client):

    # valid case
    resp = client.post("/menu/item/add", json={
        "category": "pizza",
        "name": "pepperoni",
        "cost": 10,
        "description": "N/A",
        "ingredients": "pepperoni, cheese",
        "is_vegan": False
    })
    assert resp.status_code == 200

    resp = client.post("/menu/item/add", json={
        "category": "pizza",
        "name": "hawaiian",
        "cost": 10,
        "description": "N/A",
        "ingredients": "ham, pineapple, cheese",
        "is_vegan": False
    })
    assert resp.status_code == 200

    # duplicate name
    resp = client.post("/menu/item/add", json={
        "category": "pizza",
        "name": "pepperoni",
        "cost": 10,
        "description": "N/A",
        "ingredients": "pepperoni, cheese",
        "is_vegan": False
    })
    assert resp.status_code == 403

    # invalid length name
    resp = client.post("/menu/item/add", json={
        "category": "pizza",
        "name": "gaskdlfjdsfldsfkldsjfls",
        "cost": 10,
        "description": "N/A",
        "ingredients": "pepperoni, cheese",
        "is_vegan": False
    })
    assert resp.status_code == 400

def test_remove_item_endpoint(client):
    resp = client.put("/menu/item/remove", json={
        "name": "hawaiian",
    })
    assert resp.status_code == 200

    # invalid remove
    resp = client.put("/menu/item/remove", json={
        "name": "hawaiian",
    })

    assert resp.status_code == 400

def test_item_update_details(client):

    # valid case
    resp = client.put("/menu/item/update/details", json={
        "id": 1,
        "name": "Haddock",
        "cost": 20,
    })
    assert resp.status_code == 200

    # invalid id
    resp = client.put("/menu/item/update/details", json={
        "id": 100,
        "name": "Haddock",
        "cost": 20,
    })
    assert resp.status_code == 400

def test_item_update_order_endpoint(client):
    resp = client.post("/menu/item/add", json={
        "category": "pizza",
        "name": "hawaiian",
        "cost": 10,
        "description": "N/A",
        "ingredients": "ham, pineapple, cheese",
        "is_vegan": False
    })
    assert resp.status_code == 200

    resp = client.put("/menu/item/update/order", json={"name": "hawaiian"}, params={"is_up": True})
    assert resp.status_code == 200

    resp = client.put("/menu/item/update/order", json={"name": "hawaiian"}, params={"is_up": False})
    assert resp.status_code == 400
