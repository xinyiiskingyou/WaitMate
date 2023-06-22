from src.error import InputError
from database.menu_db import (
    category_already, category_add_db, item_already, item_add_db, menu_view_db, 
    menu_item_update_details_db, menu_category_update_details_db, menu_item_remove_db,
    menu_item_update_order_db, menu_category_update_order_db, get_item_order,
    get_next_order_item, get_item_cat, get_next_order_cat, get_cat_order
)

def category_add(name: str) -> None:
    if len(name) < 1 or len(name) > 15:
        raise InputError('Invalid name length')
    if category_already(name):
        raise InputError('Name already used')
    category_add_db(name)

def item_add(category: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool) -> None:
    if len(name) < 1 or len(name) > 15:
        raise InputError('Invalid name length')
    if item_already(name):
        raise InputError('Name already used')    
    item_add_db(category, name, cost, description, ingredients, is_vegan)
    
def menu_view() -> dict[str, list[dict]]:
    menu: dict[str, list[dict]] = {}

    for item in menu_view_db():
        if item[0] not in menu:
            menu[item[0]] = []
        if item[1]:
            menu[item[0]].append(
                {"item": item[1], "cost": item[2], "description": item[3], "ingredients": item[4], "is_vegan": item[5]}
            )

    return menu 

def menu_item_update_details(item: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool):
    if len(name) < 1 or len(name) > 15:
        raise InputError('Invalid name length')
    if item != name and item_already(name):
        raise InputError('Name already used')
    
    menu_item_update_details_db(item, name, cost, description, ingredients, is_vegan)

def menu_category_update_details(old_name: str, new_name: str):
    if len(new_name) < 1 or len(new_name) > 15:
        raise InputError('Invalid name length')
    if category_already(new_name):
        raise InputError('Name already used')

    menu_category_update_details_db(old_name, new_name)

def menu_item_remove(item: str):
    menu_item_remove_db(item)

def menu_item_update_order(item_name: str, is_up: bool):
    if get_item_order(item_name) == 0 and is_up:
        raise InputError('Invalid order')
    elif get_item_order(item_name) == get_next_order_item(get_item_cat(item_name)) and not is_up:
        raise InputError('Invalid order')
    menu_item_update_order_db(item_name, is_up)

def menu_category_update_order(category, is_up):
    if get_cat_order(category) == 0 and is_up:
        raise InputError('Invalid order')
    elif get_cat_order(category) == get_next_order_cat() and not is_up:
        raise InputError('Invalid order')
    menu_category_update_order_db(category, is_up)


# if __name__ == "__main__":
    # con = sqlite3.connect("restaurant.db")
    # cur = con.cursor()
    # cur.execute("CREATE TABLE IF NOT EXISTS categories (name)")
    # con.commit()
    # con.close()
    # category_add("Yms")
    #item_add("Yms", "Jam", 5, "strawberry")
    # sql_show_all()
    # print(menu_view())





