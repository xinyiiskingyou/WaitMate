import json
import os
import pytest
from src.error import InputError
from src.menu import MenuDB

menu = MenuDB()
def test_endpoint(client):
    resp = client.post("/menu/category/add", json={'name': 'pizza'})
    assert resp.status_code == 200

def test_used_category_name(client):
    resp = client.post("/menu/category/add", json={'name': 'pizza'})
    assert resp.status_code == 400

def fill_menu():
    if os.path.exists("../src/database/menu.db"):
        os.remove("../src/database/menu.db")

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
    with pytest.raises(InputError):
        menu.item_add('Fish', 'SeaBass', '1', '_', '_', False) 

def test_cat_add_invalid_name():
    menu_1()

    with pytest.raises(InputError):
        menu.category_add('') 
    with pytest.raises(InputError):
        menu.category_add('BigSeaBassTodayYum')
    with pytest.raises(InputError):
        menu.category_add('Fish')
    
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