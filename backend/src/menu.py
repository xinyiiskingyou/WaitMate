import sqlite3
from constant import MENU_DB_PATH
from src.error import InputError, AccessError
from src.helper import (
    check_if_category_exists, get_item_id_by_name, get_category_order_by_name, 
    get_menu_item_order_by_name, get_item_info, check_categories_key_is_valid, update_order
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

        # check if the category name exists
        if not check_categories_key_is_valid('name', category):
            raise InputError('Invalid category')

        # check if the length is between 1 to 15
        if len(name) < 1 or len(name) > 15:
            raise InputError('Invalid name length')

        # check if the item name exists in the same category
        if get_item_info('name', name):
            raise AccessError('Name already used')

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

    def get_all_categories(self):

        self.create_category_table()
        
        con = sqlite3.connect(MENU_DB_PATH)
        cursor = con.cursor()

        cursor.execute("SELECT cat_order, name FROM Categories ORDER BY cat_order")
        info = cursor.fetchall()

        con.close()

        categories_dict = {}
        for item in info:
            cat_order, name = item
            categories_dict[cat_order] = name

        return categories_dict

    def get_items_in_category(self, category_id: int):
        
        self.create_category_table()
        self.create_item_table()
        self.create_menu_table()

        # check if the category id exists
        if not check_categories_key_is_valid('cat_id', category_id):
            raise InputError('Invalid ID')

        items: list[tuple]

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute(
            '''SELECT item, cost, description, ingredients, is_vegan, item_id
            FROM Categories c
            LEFT JOIN Menu m
                ON m.category = c.name
            LEFT JOIN Items i
                ON i.name = m.item
            where c.cat_id = ?
            ORDER BY m.item_order
            ''', (category_id,)
        )

        items = cur.fetchall()
        con.close()
        
        return items

    def update_details_menu_items(self, item_id: int, name=None, cost=None, description=None,
        ingredients=None, is_vegan=None):

        if not get_item_info('item_id', item_id):
            raise InputError('Invalid ID')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        if name is not None:
            if (len(name) < 1 or len(name) > 15):
                raise InputError('Invalid name length')
            if get_item_info('name', name):
                raise InputError('Name already used')
            # update the name in menu
            cur.execute(
                '''UPDATE Menu  
                SET item = (?)
                WHERE item_order = (?)''',
                (name, item_id)
            )
            con.commit()

        # update item detail in Items table
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

    def update_details_category(self, old_name: str, new_name: str):

        print(self.get_all_categories())
        # length is not between 1 to 15
        if len(new_name) < 1 or len(new_name) > 15:
            raise InputError('Invalid name length')
        # old category name not exists
        if not check_if_category_exists(old_name):
            raise InputError('Name not found')
        # new category name exists
        if old_name == new_name or check_if_category_exists(new_name):
            raise InputError('Name already used')

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute(
            '''UPDATE Categories  
            SET name = (?)
            WHERE name = (?)''',
            (new_name, old_name)
        )
        con.commit()

        cur.execute(
            '''UPDATE Menu  
            SET category = (?)
            WHERE category = (?)''',
            (new_name, old_name)
        )
        con.commit()
        con.close()

    def remove_menu_items(self, item_name: str):

        if not get_item_info('name', item_name):
            raise InputError('Invalid name')
    
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute(
            '''DELETE FROM Items 
            WHERE name = (?)''',
            (item_name,)
        )
        con.commit()

        cur.execute(
            '''DELETE FROM Menu 
            WHERE item = (?)''',
            (item_name,)
        )
        con.commit()
        con.close()

    def update_order_menu_items(self, item_name: str, is_up: bool):
        
        if not get_item_info('name', item_name):
            raise InputError('Invalid name')

        prev_order = get_menu_item_order_by_name(item_name)
        update_order('Menu', 'item_order', is_up, prev_order)

    def update_order_menu_category(self, category_name: str, is_up: bool):

        # check if the category name exists
        if not check_categories_key_is_valid('name', category_name):
            raise InputError('Invalid category name')

        prev_order = get_category_order_by_name(category_name)
        update_order('Categories', 'cat_order', is_up, prev_order)
