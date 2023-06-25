import os
import pytest
from src.error import InputError
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

def test_item_update_details_invalid_id():
    menu_1()

    with pytest.raises(InputError):
        menu.menu_item_update_details(100)
    with pytest.raises(InputError):
        menu.menu_item_update_details(3000, name='Big')
    with pytest.raises(InputError):
        menu.menu_item_update_details(-1, name='fsd')

def test_item_update_details_invalid_name():

    menu_1()
    with pytest.raises(InputError):
        menu.menu_item_update_details(1, name='SeaBass')
    with pytest.raises(InputError):
        menu.menu_item_update_details(1, name='BigSeaBassTodayYum')
    with pytest.raises(InputError):
        menu.menu_item_update_details(1, name='')

# # def test_item_update_details_valid_name():
#     # menu.menu_item_update_details(1, name='Haddock')
        
def test_cat_update_details_invalid():
    menu_1()
    with pytest.raises(InputError):
        menu.menu_category_update_details('Fish', '') 
    with pytest.raises(InputError):
        menu.menu_category_update_details('Fish', 'BigSeaBassTodayYum')  

def test_item_update_order_invalid():
    menu_1()
    with pytest.raises(InputError):
        menu.menu_item_update_order('SeaBass', True) 
    with pytest.raises(InputError):
        menu.menu_item_update_order('FlatFish', False)

def test_cat_update_order_invalid():
    menu_1()
    with pytest.raises(InputError):
        menu.menu_category_update_order('Fish', True) 
    with pytest.raises(InputError):
        menu.menu_category_update_order('Water', False)

# # # def test_menu_view():
# # #     fill_menu()
# # #     assert menu_view() == {
# # #         'Fish': [
# # #             {'item': 'SeaBass',
# # #             'cost': 10,
# # #             'description': '_',
# # #             'ingredients': '_',
# # #             'is_vegan': False},
# # #             {'item': 'FlatFish',
# # #             'cost': 10,
# # #             'description': '_',
# # #             'ingredients': '_',
# # #             'is_vegan': False},
            
# # #         ], 
# # #         'Water': []}

# # # def test_menu_remove():
# # #     fill_menu()
# # #     menu_item_remove('FlatFish')
# # #     assert menu_view() == {
# # #         'Fish': [
# # #             {'item': 'SeaBass',
# # #             'cost': 10,
# # #             'description': '_',
# # #             'ingredients': '_',
# # #             'is_vegan': False},           
# # #         ], 
# # #         'Water': []}