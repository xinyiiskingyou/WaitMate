from src.error import InputError
# from src.database.menu_db import (
#     menu_view_db, 
# )

import sqlite3
from constant import MENU_DB_PATH
from src.clear import clear_database
from src.helper import (
    check_if_category_exists, check_if_item_exists, get_item_id_by_name,
    get_category_order_by_name, get_new_order_num, check_if_item_id_valid,
    get_total_item_count, get_total_category_count, get_item_order_by_name
)

class MenuDB:
    
    def __init__(self, database=MENU_DB_PATH) -> None:
        self.database = database

    def create_category_table(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('''CREATE TABLE IF NOT EXISTS Categories (
                        cat_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        cat_order INTEGER DEFAULT 0
                    )''')
        con.commit()

        con.close()

    def create_item_table(self):
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS Items (
                        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        cost INTEGER,
                        description TEXT,
                        ingredients TEXT,
                        is_vegan
                    )''')
        con.commit()
        con.close()

    def create_menu_table(self):
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS Menu(category, item, item_order)')
        con.commit()
        con.close()

    def category_add(self, name: str) -> None:

        # create category table
        self.create_category_table()
        
        # check if the length is between 1 to 15
        if len(name) < 1 or len(name) > 15:
            raise InputError('Invalid name length')
        
        # check if the category exists
        if check_if_category_exists(name):
            raise InputError('Name already used')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('INSERT INTO Categories(name) VALUES(?)', (name,))
        con.commit()

        # order = get_category_id_by_name(name)
        cur.execute('UPDATE Categories SET cat_order = cat_id WHERE name = ?', (name,))
        con.commit()
        con.close()

    def item_add(
        self, category: str, name: str, cost: float, description: str, 
        ingredients: str, is_vegan: bool
    ) -> None:

        self.create_item_table()

        #TODO invalid category

        # check if the length is between 1 to 15
        if len(name) < 1 or len(name) > 15:
            raise InputError('Invalid name length')

        # check if the item name exists
        if check_if_item_exists(name):
            raise InputError('Name already used')    
        
        # insert new item to the Items table
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''INSERT INTO Items(name, cost, description, ingredients, is_vegan)
            VALUES(?,?,?,?,?)''',
            (name, cost, description, ingredients, is_vegan)
        )
        con.commit()

        # insert to the menu
        self.create_menu_table()
        order = get_item_id_by_name(name)
        cur.execute('INSERT INTO Menu values(?,?,?)',(category, name, order))
        con.commit()

        con.close()

    # def menu_view() -> dict[str, list[dict]]:
    #     menu: dict[str, list[dict]] = {}

    #     for item in menu_view_db():
    #         if item[0] not in menu:
    #             menu[item[0]] = []
    #         if item[1]:
    #             menu[item[0]].append({
    #                 "item": item[1],
    #                 "cost": float(item[2]),
    #                 "description": item[3],
    #                 "ingredients": item[4],
    #                 "is_vegan": item[5]
    #             })

    #     return menu 

    def menu_item_update_details(self, item_id: int, name=None, cost=None, description=None, 
        ingredients=None, is_vegan=None):

        if not check_if_item_id_valid(item_id):
            raise InputError('Invalid ID')

        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()

        if name is not None:
            if (len(name) < 1 or len(name) > 15):
                raise InputError('Invalid name length')
            elif check_if_item_exists(name):
                raise InputError('Name already used')
            else:
                # update the name in menu
                cur.execute(
                    '''UPDATE Menu  
                    SET item = (?)
                    WHERE item_order = (?)''',
                    (name, item_id)
                )
                con.commit()

        cur.execute('''UPDATE Items
            SET
                name = COALESCE(?, name),
                cost = COALESCE(?, cost),
                description = COALESCE(?, description),
                ingredients = COALESCE(?, ingredients),
                is_vegan = COALESCE(?, is_vegan)
            WHERE item_id = (?)''',
            (name, cost, description, ingredients, is_vegan, item_id)
        )
        con.commit()
        
        con.close()

    def menu_category_update_details(self, old_name: str, new_name: str):

        if len(new_name) < 1 or len(new_name) > 15:
            raise InputError('Invalid name length')
        if old_name == new_name and check_if_category_exists(new_name):
            raise InputError('Name already used')

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute(
            '''UPDATE categories  
            SET name = (?)
            WHERE name = (?)''',
            (new_name, old_name)
        )
        con.commit()

        cur.execute(
            '''UPDATE menu  
            SET category = (?)
            WHERE category = (?)''',
            (new_name, old_name)
        )
        con.commit()
        con.close()

    def menu_item_remove(self, item: str):

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute(
            '''DELETE FROM Items 
            WHERE name = (?)''',
            (item,)
        )
        con.commit()

        cur.execute(
            '''DELETE FROM Menu 
            WHERE item = (?)''',
            (item,)
        )
        con.commit()
        con.close() 

    def menu_item_update_order(self, item_name: str, is_up: bool):

        prev_order: int = get_item_order_by_name(item_name)

        new_order = get_new_order_num(is_up, prev_order)

        if prev_order == 1 and is_up:
            raise InputError('Invalid order')
        elif prev_order + 1 > get_total_item_count() and not is_up:
            raise InputError('Invalid order')

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''UPDATE Menu SET item_order = 
            CASE
                WHEN item_order = ? THEN ?
                WHEN item_order = ? THEN ?
                ELSE item_order
            END''',
        (prev_order, new_order, new_order, prev_order))
        con.commit()

        con.close() 

    def menu_category_update_order(self, category_name, is_up):

        prev_order = get_category_order_by_name(category_name)

        new_order = get_new_order_num(is_up, prev_order)
        print(category_name, prev_order)

        if prev_order == 1 and is_up:
            raise InputError('Invalid order')
        elif prev_order + 1 > get_total_category_count() and not is_up:
            raise InputError('Invalid order')

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''UPDATE Categories SET cat_order = 
            CASE
                WHEN cat_order = ? THEN ?
                WHEN cat_order = ? THEN ?
                ELSE cat_order
            END''',
        (prev_order, new_order, new_order, prev_order))
        con.commit()

        con.close() 

    # def print_info(self):
    #     conn = sqlite3.connect(MENU_DB_PATH)
    #     cursor = conn.cursor()

    #     cursor.execute("SELECT * FROM Categories ORDER BY cat_order")
    #     rows = cursor.fetchall()

    #     for row in rows:
    #         print(row)

    #     cursor.close()
    #     conn.close()

# def menu_view_db() -> list[tuple]:
#     items: list[tuple]
#     con = sqlite3.connect(MENU_DB_PATH)
#     cur = con.cursor()

#     cur.execute('CREATE TABLE IF NOT EXISTS menu(category, item, item_order)')
#     con.commit()

#     cur.execute('CREATE TABLE IF NOT EXISTS items(name, cost, description, ingredients, is_vegan)')
#     con.commit()

#     cur.execute('CREATE TABLE IF NOT EXISTS categories(name, cat_order)')
#     con.commit()

#     cur.execute(
#         '''SELECT c.name, item, cost, description, ingredients, is_vegan, cat_order, item_order 
#         FROM categories c
#         LEFT JOIN menu m
#         ON m.category = c.name
#         LEFT JOIN items i
#         ON i.name = m.item
#         ORDER BY c.cat_order, m.item_order'''
#     )

#     items = cur.fetchall()
#     con.close() 
    
#     print(items) #TODO
#     return items