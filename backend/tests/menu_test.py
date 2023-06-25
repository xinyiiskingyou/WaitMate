import pytest
import json
from src.menu import (
    menu_view, category_add, item_add, menu_item_update_details, menu_item_remove,
    menu_category_update_details, menu_item_update_order, menu_category_update_order)
from src.error import InputError
import os

def test_endpoint(client):
    resp = client.post("/menu/category/add", json={'name': 'pizza'})
    assert resp.status_code == 200

def test_used_category_name(client):
    resp = client.post("/menu/category/add", json={'name': 'pizza'})
    assert resp.status_code == 400

def fill_menu():
    if os.path.exists("../src/database/menu.db"):
        os.remove("../src/database/menu.db")

    category_add('Fish')
    category_add('Water')
    item_add('Fish', 'SeaBass', '10', '_', '_', False)
    item_add('Fish', 'FlatFish', '10', '_', '_', False)

def test_item_add_invalid_name():
    fill_menu()
    with pytest.raises(InputError):
        item_add('Fish', '', '1', '_', '_', False) 
    with pytest.raises(InputError):
        item_add('Fish', 'BigSeaBassTodayYum', '1', '_', '_', False) 
    with pytest.raises(InputError):
        item_add('Fish', 'SeaBass', '1', '_', '_', False) 

def test_cat_add_invalid_name():
    fill_menu()
    with pytest.raises(InputError):
        category_add('') 
    with pytest.raises(InputError):
        category_add('BigSeaBassTodayYum')
    with pytest.raises(InputError):
        category_add('Fish')

def test_item_update_details_invalid():
    fill_menu()
    with pytest.raises(InputError):
        menu_item_update_details('SeaBass', '', '1', '_', '_', False) 
    with pytest.raises(InputError):
        menu_item_update_details('SeaBass', 'BigSeaBassTodayYum', '1', '_', '_', False) 
    with pytest.raises(InputError):
        menu_item_update_details('SeaBass', 'SeaBass', None, '_', '_', False) 

def test_cat_update_details_invalid():
    fill_menu()
    with pytest.raises(InputError):
        menu_category_update_details('Fish', '') 
    with pytest.raises(InputError):
        menu_category_update_details('Fish', 'BigSeaBassTodayYum')  

def test_item_update_order_invalid():
    fill_menu()
    with pytest.raises(InputError):
        menu_item_update_order('SeaBass', True) 
    with pytest.raises(InputError):
        menu_item_update_order('FlatFish', False)

def test_item_update_order_invalid():
    fill_menu()
    with pytest.raises(InputError):
        menu_item_update_order('SeaBass', True) 
    with pytest.raises(InputError):
        menu_item_update_order('FlatFish', False)

def test_cat_update_order_invalid():
    fill_menu()
    with pytest.raises(InputError):
        menu_category_update_order('Fish', True) 
    with pytest.raises(InputError):
        menu_category_update_order('Water', False)

def test_menu_view():
    fill_menu()
    assert menu_view() == {
        'Fish': [
            {'item': 'SeaBass',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False},
            {'item': 'FlatFish',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False},
            
        ], 
        'Water': []}

def test_menu_remove():
    fill_menu()
    menu_item_remove('FlatFish')
    assert menu_view() == {
        'Fish': [
            {'item': 'SeaBass',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False},           
        ], 
        'Water': []}