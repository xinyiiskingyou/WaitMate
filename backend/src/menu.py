'''
The `menu_db` module provides functionalites for managing the Menu table.

It includes functionality for adding categories and items to the menu,
updating item details and order, retrieving categories and items, and
removing menu items.
'''

import sqlite3
from constant import DB_PATH
from src.error import InputError, AccessError
from src.helper import (
    check_if_category_exists, get_category_order_by_name, get_menu_item_order_by_name,
    get_item_info, check_categories_key_is_valid, get_order_in_category,
    get_total_count, get_category_by_name, get_item_in_category
)

class MenuDB:
    '''
    The TableDB class implements operations related to menu.

    Args:
        database_path (str): The path to the SQLite database file.
    '''

    def __init__(self, database=DB_PATH) -> None:
        self.database = database

    def create_category_table(self) -> None:
        '''
        Creates the Categories table if it does not exist.
        '''
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('''CREATE TABLE IF NOT EXISTS Categories (
                        cat_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        cat_order INTEGER DEFAULT 0
                    )''')
        con.commit()

        con.close()

    def create_item_table(self) -> None:
        '''
        Creates the Items table if it does not exist.
        '''
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS Items (
                        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        cost INTEGER,
                        description TEXT,
                        ingredients TEXT,
                        is_vegan,
                        item_order INTEGER,
                        category_name TEXT
                    )''')
        con.commit()
        con.close()

    def create_menu_table(self) -> None:
        '''
        Creates the Categories table if it does not exist.
        '''
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS Menu (
                        category TEXT,
                        item TEXT,
                        item_order INTEGER DEFAULT 0
                    )''')
        con.commit()
        con.close()

    def category_add(self, name: str) -> None:
        '''
        Adds a category to the menu.

        Arguments:
            <name> (<str>)  - the name of a new category
        Exceptions:
            InputError  - Occurs when length of name is not between 1 and 15 characters inclusive
                        - Occurs when category name is already existed
        Return Value:
            N/A
        '''

        # create category table
        self.create_category_table()

        # check if the length is between 1 to 15
        if len(name) < 1 or len(name) > 15:
            raise InputError('Invalid name length')

        # check if the category exists
        if check_if_category_exists(name.lower()):
            raise InputError('Name already used')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('INSERT INTO Categories(name) VALUES(?)', (name,))
        con.commit()

        # update order column
        cur.execute('UPDATE Categories SET cat_order = cat_id WHERE name = ?', (name,))
        con.commit()

        # insert category in menu
        self.create_menu_table()
        cur.execute('''
            INSERT INTO Menu(category, item, item_order)
            VALUES (?, ?, ?)
        ''', (name, None, 0))

        con.commit()
        con.close()

    def item_add(self, item_data: dict) -> None:
        '''
        Adds an item to the menu.

        Arguments:
            <item_data> (<dict>): A dictionary containing item data including
                              category, name, cost, description, ingredients,
                              and is_vegan.
        Exceptions:
            InputError      - Occurs when a field is missing
                            - Occurs when length of name is not between 1 and 15 characters
                            - Occurs when the category does not exist
            AccessError     - Occurs when item has already existed in the same category
        Return Value:
            None
        '''
        self.create_item_table()

        try:
            category = item_data['category']
            name = item_data['name']
            cost = item_data['cost']
            description = item_data['description']
            ingredients = item_data['ingredients']
            is_vegan = item_data['is_vegan']
        except KeyError as err:
            raise InputError(f"Missing field in item_data: {err.args[0]}")

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

        cur.execute('''
            INSERT INTO Items(name, cost, description, ingredients, is_vegan, category_name)
            VALUES(?, ?, ?, ?, ?, ?)
        ''', (name, cost, description, ingredients, is_vegan, category))
        con.commit()

        order = get_order_in_category(category) + 1
        cur.execute('UPDATE Items SET item_order = (?) WHERE name = (?)', (order, name))
        con.commit()

        # insert to the menu
        self.create_menu_table()
        cur.execute('INSERT INTO Menu values(?,?,?)', (category, name, order))
        con.commit()

        con.close()

    def get_all_categories(self) -> dict:
        '''
        Retrieves all the categories in the menu.

        Arguments:
            N/A
        Exceptions:
            N/A
        Return Value:
            Returns <dict> that contains all the categories in order
        '''
        self.create_category_table()

        con = sqlite3.connect(self.database)
        cursor = con.cursor()

        cursor.execute("SELECT cat_order, name FROM Categories ORDER BY cat_order")
        info = cursor.fetchall()

        con.close()

        categories_dict = {}
        for item in info:
            cat_order, name = item
            categories_dict[cat_order] = name

        return categories_dict

    def get_items_in_category(self, category_id: str) -> list:
        '''
        Retrieves all the items in a category.

        Arguments:
            <category_id> (<str>) - an unqiue id represented a category
        Exceptions:
            N/A
        Return Value:
            Returns <list> that contains all the items
        '''
        self.create_category_table()
        self.create_item_table()
        self.create_menu_table()

        # Check if the category ID exists
        if not check_categories_key_is_valid('cat_id', int(category_id)):
            raise InputError('Invalid ID')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute(
            '''SELECT item, cost, description, ingredients, is_vegan, item_id
            FROM Categories c
            LEFT JOIN Menu m
                ON m.category = c.name
            LEFT JOIN Items i
                ON i.name = m.item
            WHERE c.cat_order = ? AND m.item IS NOT NULL
            ORDER BY m.item_order
            ''', (category_id,)
        )
        info = cur.fetchall()
        con.close()

        items = []
        columns = ['name', 'cost', 'description', 'ingredients', 'is_vegan']
        for data in info:
            item_dict = dict(zip(columns, data))
            items.append(item_dict)

        return items

    def update_details_menu_items(self, category_name: str, index: int, **kwargs) -> None:
        '''
        Updates details of a menu item.

        Arguments:
            <category_name> (<str>) - The name of the category.
            <index>         (<int>) - The index of the menu item in a category.
            <**kwargs>              - Optional keyword arguments for updating the item.

        Exceptions:
            InputError      - Occurs when the category name is invalid
                            - Occurs when the item index is invalid
                            - Occurs when new_name length is invalid
                            - Occurs when the name is already used by another item
        Return Value:
            N/A
        '''

        # check if category name is valid
        if not check_categories_key_is_valid('name', category_name):
            raise InputError('Invalid category')

        check_result = get_item_in_category(index, category_name)
        # check if item_id is valid
        if not check_result:
            raise InputError('Invalid ID')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        # get the old name of the menu item
        old_name = check_result[1]

        new_name = kwargs.get('name')
        if new_name is not None:
            # invalid name length
            if len(new_name) < 1 or len(new_name) > 15:
                raise InputError('Invalid name length')
            # item name is used by another item
            if get_item_info('name', new_name) and old_name != new_name:
                raise InputError('Name already used')
            # update the name in menu
            cur.execute(
                '''UPDATE Menu
                SET item = (?)
                WHERE item_order = (?) and category = (?)''',
                (new_name, index, category_name)
            )
            con.commit()

        # update item detail in Items table
        update_query = '''
            UPDATE Items
            SET
                name = COALESCE(?, name),
                cost = COALESCE(?, cost),
                description = COALESCE(?, description),
                ingredients = COALESCE(?, ingredients),
                is_vegan = COALESCE(?, is_vegan)
            WHERE item_order = (?) and category_name = (?)
        '''
        cur.execute(update_query, (
            kwargs.get('name'),
            kwargs.get('cost'),
            kwargs.get('description'),
            kwargs.get('ingredients'),
            kwargs.get('is_vegan'),
            index,
            category_name
        ))

        con.commit()
        con.close()

    def update_details_category(self, old_name: str, new_name: str) -> None:
        '''
        Updates details of a category

        Arguments:
            <old_name> (<str>) - The original name of the category.
            <new_name> (<str>) - The name of the category to be updated.

        Exceptions:
            InputError  - Occurs when new_name length is invalid
                        - Occurs when the old category name is invalid
                        - Occurs when new category name already exists
        Return Value:
            N/A
        '''

        # if the name does not change then do nothing
        if old_name.lower() == new_name.lower():
            return
        # length is not between 1 to 15
        if len(new_name) < 1 or len(new_name) > 15:
            raise InputError('Invalid name length')
        # old category name not exists
        if not check_if_category_exists(old_name.lower()):
            raise InputError('Name not found')
        # new category name exists
        if old_name != new_name and check_if_category_exists(new_name.lower()):
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

    def remove_menu_items(self, item_name: str) -> None:
        '''
        Remove a menu item from the menu.

        Arguments:
            <item_name> (<str>) - The name of a item.
        Exceptions:
            InputError  - Occurs when the name of the item is invalid
        Return Value:
            N/A
        '''

        if not get_item_info('name', item_name):
            raise InputError('Invalid name')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('''DELETE FROM Items WHERE name = (?)''', (item_name,))
        con.commit()

        cur.execute('''DELETE FROM Menu WHERE item = (?)''', (item_name,))
        con.commit()

        con.close()

    def update_order_menu_items(self, item_name: str, is_up: bool) -> None:
        '''
        Updates the order of a menu item.

        Arguments:
            <item_name> (<str>)     - The name of the menu item to update.
            <is_up>     (<bool>)    - Indicates whether to move the item up (True) or down (False).
        Exceptions:
            InputError  - Occurs when the item name is invalid.
                        - Occurs when the order is invalid.
        Return Value:
            None
        '''

        # item name not exists
        if not get_item_info('name', item_name):
            raise InputError('Invalid name')

        prev_order = get_menu_item_order_by_name(item_name)
        cat_name = get_category_by_name(item_name)

        # if the item is the last item in the category then it can move down
        if prev_order + 1 > get_order_in_category(cat_name) and not is_up:
            raise InputError('Invalid order')

        self.update_order('Menu', 'item_order', is_up, prev_order)

    def update_order_menu_category(self, category_name: str, is_up: bool) -> None:
        '''
        Updates the order of a category.

        Arguments:
            <category_name> (<str>)     - The name of the category to update.
            <is_up>         (<bool>)    - Indicates whether to move the item up or down.
        Exceptions:
            InputError  - Occurs when the category name is invalid.
                        - Occurs when the order is invalid.
        Return Value:
            None
        '''

        # check if the category name exists
        if not check_categories_key_is_valid('name', category_name):
            raise InputError('Invalid category name')

        prev_order = get_category_order_by_name(category_name)

        # the last item of the database cannot move down
        if prev_order + 1 > get_total_count('Categories') and not is_up:
            raise InputError('Invalid order')

        self.update_order('Categories', 'cat_order', is_up, prev_order)

    def update_order(self, table_name: str, column_name: str, is_up: bool, prev_order: int) -> None:
        '''
        Helper function to update the order of items or categories in the database.

        Arguments:
            <table_name>  (<str>)    - The name of the table to update.
            <column_name> (<str>)    - The name of the column to update.
            <is_up>       (<bool>)   - Indicates whether to move the items/categories up or down.
            <prev_order>  (<int>)    - The previous order value of the item/category.
        Exceptions:
            InputError  - Occurs when the order is invalid.
        Returns:
            None
        '''

        # the first item of the database cannot move up
        if prev_order == 1 and is_up:
            raise InputError('Invalid order')

        new_order = prev_order - 1 if is_up else prev_order + 1
        self.update_order_in_db(table_name, column_name, prev_order, new_order)

        if table_name == "Menu":
            self.update_order_in_db("Items", "item_order", prev_order, new_order)

    def update_order_in_db(self, table: str, column: str, prev_order: int, new_order: int) -> None:
        '''
        Helper function to update the order of items or categories in the database.

        Arguments:
            <table>       (<str>)    - The name of the table to update.
            <column>      (<str>)    - The name of the column to update.
            <prev_order>  (<int>)    - The previous order value of the item/category.
            <new_order>   (<int>)    - The new order value of the item/category.
        Exceptions:
            N/A
        Returns:
            None
        '''

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''
            UPDATE {table_name}
            SET {column_name} = CASE
                WHEN {column_name} = ? THEN ?
                WHEN {column_name} = ? THEN ?
                ELSE {column_name}
            END
        '''.format(table_name=table, column_name=column),
                    (prev_order, new_order, new_order, prev_order))

        con.commit()
        con.close()
