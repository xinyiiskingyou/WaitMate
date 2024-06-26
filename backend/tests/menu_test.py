import pytest
from src.error import InputError, AccessError
from src.menu import MenuDB
from tests.conftest import VALID, INPUTERROR, ACCESSERROR

menu = MenuDB()

def menu_1():
    menu.clear_data()

    menu.category_add('Fish')
    menu.category_add('Water')
    
    menu.item_add({
        'category': 'Fish',
        'name': 'SeaBass',
        'cost': 10,
        'description': '_',
        'ingredients': '_',
        'is_vegan': False
    })
    
    menu.item_add({
        'category': 'Fish',
        'name': 'FlatFish',
        'cost': 20,
        'description': '_',
        'ingredients': '_',
        'is_vegan': False
    })

def test_item_add_invalid_cat():
    with pytest.raises(InputError):
        menu.item_add({
            'category': 'Fish11',
            'name': 'hh',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False
        })
        
    with pytest.raises(InputError):
        menu.item_add({
            'category': '',
            'name': 'hh',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False
        })

def test_item_add_invalid_name():
    menu_1()

    with pytest.raises(InputError):
        menu.item_add({
            'category': 'Fish',
            'name': '',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False
        })
    with pytest.raises(InputError):
        menu.item_add({
            'category': 'Fish',
            'name': 'BigSeaBassTodayYum',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False
        })
    with pytest.raises(AccessError):
        menu.item_add({
            'category': 'Fish',
            'name': 'SeaBass',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False
        })

def test_item_add_missing_arguments():
    with pytest.raises(InputError):
        menu.item_add({
            'category': 'Fish',
            'cost': 10,
            'description': '_',
            'ingredients': '_',
            'is_vegan': False
        })
        
    with pytest.raises(InputError):
        menu.item_add({
            'category': 'Fish'
        })
        
    with pytest.raises(InputError):
        menu.item_add({
            'category': 'Fish',
            'is_vegan': False
        })
    
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

def test_item_update_details_invalid_cat():
    with pytest.raises(InputError):
        menu.update_details_menu_items(' ', 1)
    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish11', 1, new_name='Big')

def test_item_update_details_invalid_id():
    menu_1()

    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish', 100)
    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish', 3000, new_name='Big')
    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish', -1, new_name='fsd')

def test_item_update_details_invalid_name():

    menu_1()
    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish', 1, name='BigSeaBassTodayYum')
    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish', 1, name='')
    with pytest.raises(InputError):
        menu.update_details_menu_items('Fish', 1, name='FlatFish')
    
def test_item_update_details_valid_name():
    menu_1()
    original = menu.get_items_in_category(1)
    menu.update_details_menu_items('Fish', 1, name='Haddock')
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

    menu.update_details_category('Fish', 'Fish') 
    assert True

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
        menu.update_order_menu_category('Fish', 0) 
    with pytest.raises(InputError):
        menu.update_order_menu_category('Water', 3)

def test_cat_update_order_valid():
    menu_1()

    original = menu.get_all_categories()
    menu.update_order_menu_category('Fish', 2) 
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
    assert result == [{'name': 'SeaBass', 'cost': 10, 'description': '_', 'ingredients': '_', 'is_vegan': 0}, 
                {'name': 'FlatFish', 'cost': 20, 'description': '_', 'ingredients': '_', 'is_vegan': 0}]

def test_menu_remove_invalid_item():
    with pytest.raises(InputError):
        menu.remove_menu_items('naninani')
    with pytest.raises(InputError):
        menu.remove_menu_items(' ')

def test_menu_remove():
    menu_1()
    assert len(menu.get_items_in_category(1)) == 2

    menu.remove_menu_items('FlatFish')
    assert len(menu.get_items_in_category(1)) == 1

######################################
########## endpoint tests ############
#####################################

def test_category_add_endpoint(client, manager_token):
    # valid case
    resp = client.post("/menu/category/add", json={'name': 'pizza'}, headers=manager_token)
    assert resp.status_code == VALID

    resp = client.post("/menu/category/add", json={'name': 'dessert'}, headers=manager_token)
    assert resp.status_code == VALID

    # duplicate name
    resp = client.post("/menu/category/add", json={'name': 'pizza'}, headers=manager_token)
    assert resp.status_code == INPUTERROR

    # invalid length name
    resp = client.post("/menu/category/add", json={'name': 'fakdsjkdkfhdskfh'}, headers=manager_token)
    assert resp.status_code == INPUTERROR

def test_category_update_order_endpoint(client, manager_token):
    # valid case
    resp = client.put("/menu/category/update/order", json={"name": "pizza", "new_index": 2}, headers=manager_token)
    assert resp.status_code == VALID

    # invalid move
    resp = client.put("/menu/category/update/order", json={"name": "pizza", "new_index": 0}, headers=manager_token)
    assert resp.status_code == INPUTERROR

    # invalid category name
    resp = client.put("/menu/category/update/order", json={"name": "random", "new_index": 1}, headers=manager_token)
    assert resp.status_code == INPUTERROR

def test_category_update_name_endpoint(client, manager_token):
    # valid case
    resp = client.put("/menu/category/update/details", 
        json={
            "name": "pizza",
            "new_name": "Pizzas"
        },
        headers=manager_token
    )
    assert resp.status_code == VALID

    resp = client.put("/menu/category/update/details", 
        json={
            "name": "Pizzas",
            "new_name": "pizza"
        },
        headers=manager_token
    )
    assert resp.status_code == VALID

    # invalid name
    resp = client.put("/menu/category/update/details", 
        json={
            "name": "Pizzas",
            "new_name": "pizza"
        },
        headers=manager_token
    )
    assert resp.status_code == INPUTERROR

    # invalid name length
    resp = client.put("/menu/category/update/details", 
        json={
            "name": "pizza",
            "new_name": ""
        },
        headers=manager_token
    )
    assert resp.status_code == INPUTERROR

    # name already exists
    resp = client.put("/menu/category/update/details", 
        json={
            "name": "pizza",
            "new_name": "dessert"
        },
        headers=manager_token
    )
    assert resp.status_code == INPUTERROR

def test_add_item_endpoint(client, manager_token):

    # valid case
    resp = client.post("/menu/item/add", 
        json={
            "category": "pizza",
            "name": "pepperoni",
            "cost": 10,
            "description": "N/A",
            "ingredients": "pepperoni, cheese",
            "is_vegan": False
        },
        headers=manager_token
    )
    assert resp.status_code == VALID

    resp = client.post("/menu/item/add", 
        json={
            "category": "pizza",
            "name": "hawaiian",
            "cost": 10,
            "description": "N/A",
            "ingredients": "ham, pineapple, cheese",
            "is_vegan": False
        },
        headers=manager_token
    )
    assert resp.status_code == VALID

    # duplicate name
    resp = client.post("/menu/item/add", 
        json={
            "category": "pizza",
            "name": "pepperoni",
            "cost": 10,
            "description": "N/A",
            "ingredients": "pepperoni, cheese",
            "is_vegan": False
        },
        headers=manager_token
    )
    assert resp.status_code == ACCESSERROR

    # invalid length name
    resp = client.post("/menu/item/add", 
        json={
            "category": "pizza",
            "name": "gaskdlfjdsfldsfkldsjfls",
            "cost": 10,
            "description": "N/A",
            "ingredients": "pepperoni, cheese",
            "is_vegan": False
        },
        headers=manager_token
    )
    assert resp.status_code == INPUTERROR

def test_item_update_details(client, manager_token):

    # valid case
    resp = client.put("/menu/item/update/details", 
        json={
            "category": 'Fish',
            "id": 1,
            "name": "Haddock",
            "cost": 20,
        },
        headers=manager_token
    )
    assert resp.status_code == VALID

    # invalid id
    resp = client.put("/menu/item/update/details", 
        json={
            "category": 'Fish',
            "id": 100,
            "name": "Haddock",
            "cost": 20,
        }, 
        headers=manager_token
    )
    assert resp.status_code == INPUTERROR

def test_item_update_order_endpoint(client, manager_token):

    resp = client.put("/menu/item/update/order", 
        json={"name": "hawaiian", "is_up": True},
        headers=manager_token
    )
    assert resp.status_code == VALID

    resp = client.put("/menu/item/update/order", 
        json={"name": "hawaiian", "is_up": True},
        headers=manager_token
    )
    assert resp.status_code == INPUTERROR
