import sqlite3
from constant import DATABASE

#TODO
def category_count(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS categories(name, cat_order)')
    con.commit()

    cur.execute('SELECT 1 FROM categories c WHERE c.name = (?)',(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def category_already(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS categories(name, cat_order)')
    con.commit()

    cur.execute('SELECT 1 FROM categories c WHERE c.name = (?)',(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def item_already(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS items(name, cost, description, ingredients, is_vegan)')
    con.commit()

    cur.execute('SELECT 1 FROM items i WHERE i.name = (?)',(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def get_next_order_item(category: str) -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('SELECT * FROM menu m WHERE m.category = (?)',(category,))
    items = cur.fetchall()
    con.close()    
    return len(items)

def get_next_order_cat() -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('SELECT * FROM categories')
    items = cur.fetchall()
    con.close()    
    return len(items) 

def get_item_cat(item_name: str) -> str:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('SELECT category FROM menu WHERE item = (?)', (item_name,))
    category = cur.fetchone()
    con.close()    
    return category[0]

def get_cat_order(category: str) -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('SELECT cat_order FROM categories c WHERE c.name = (?)',(category,))
    items = cur.fetchone()
    con.close()    
    return items[0]

def get_item_order(item_name: str) -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute('SELECT item_order FROM menu m WHERE m.item = (?)',(item_name,))
    items = cur.fetchone()
    con.close()    
    return items[0]

def category_add_db(name: str):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    order: int = get_next_order_cat()
    cur.execute('INSERT INTO categories values(?,?)',(name,order))
    con.commit()
    con.close()

def item_add_db(category: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    cur.execute('INSERT INTO items values(?,?,?,?,?)',(name,cost,description,ingredients,is_vegan))
    con.commit()

    cur.execute('CREATE TABLE IF NOT EXISTS menu(category, item, item_order)')
    con.commit()

    order: int = get_next_order_item(category)
    cur.execute('INSERT INTO menu values(?,?,?)',(category,name,order))
    con.commit()
    con.close()

def menu_view_db() -> list[tuple]:
    items: list[tuple]
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    cur.execute('CREATE TABLE IF NOT EXISTS menu(category, item, item_order)')
    con.commit()

    cur.execute('CREATE TABLE IF NOT EXISTS items(name, cost, description, ingredients, is_vegan)')
    con.commit()

    cur.execute('CREATE TABLE IF NOT EXISTS categories(name, cat_order)')
    con.commit()

    cur.execute(
        '''SELECT c.name, item, cost, description, ingredients, is_vegan, cat_order, item_order 
        FROM categories c
        LEFT JOIN menu m
        ON m.category = c.name
        LEFT JOIN items i
        ON i.name = m.item
        ORDER BY c.cat_order, m.item_order'''
    )

    items = cur.fetchall()
    con.close() 
    print(items)

    return items

def menu_item_update_details_db(item: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool) -> None:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        '''UPDATE items
        SET name = (?), cost = (?), description = (?) , ingredients = (?), is_vegan = (?)
        WHERE name = (?)''',
        (name,cost,description,ingredients,is_vegan,item)
    )
    con.commit()

    cur.execute(
        '''UPDATE menu  
        SET item = (?)
        WHERE item = (?)''',
        (name,item)
    )
    con.commit()
    con.close()

def menu_category_update_details_db(old_name: str, new_name: str) -> None:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        '''UPDATE categories  
        SET name = (?)
        WHERE name = (?)''',
        (new_name,old_name)
    )
    con.commit()

    cur.execute(
        '''UPDATE menu  
        SET category = (?)
        WHERE category = (?)''',
        (new_name,old_name)
    )
    con.commit()
    con.close()

#TODO update order for others
def menu_item_remove_db(item: str) -> None:
    item_order = get_item_order(item)
    cat = get_item_cat(item)

    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        '''DELETE FROM items 
        WHERE name = (?)''',
        (item,)
    )
    con.commit()

    cur.execute(
        '''DELETE FROM menu 
        WHERE item = (?)''',
        (item,)
    )
    con.commit()

    cur.execute(
        '''UPDATE menu
        SET item_order = item_order - 1  
        WHERE category = (?) AND item_order > (?)''',
        (cat,item_order)
    )
    con.commit()
    con.close()   

def menu_item_update_order_db(item_name: str, is_up: bool) -> None:
    prev_order = get_item_order(item_name)
    new_order = prev_order
    if is_up:
        new_order -= 1
    else: 
        new_order += 1

    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        '''UPDATE menu  
        SET item_order = (?)
        WHERE item = (?)''',
        (new_order,item_name)
    )
    con.commit()

    cur.execute(
        '''UPDATE menu  
        SET item_order = (?)
        WHERE NOT item = (?) AND item_order = (?)''',
        (prev_order,item_name)
    )
    con.commit()
    con.close() 

def menu_category_update_order_db(category: str, is_up: bool) -> None:
    prev_order = get_cat_order(category)
    new_order = prev_order
    if is_up:
        new_order -= 1
    else: 
        new_order += 1

    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        '''UPDATE categories  
        SET cat_order = (?)
        WHERE name = (?)''',
        (new_order,category)
    )
    con.commit()

    cur.execute(
        '''UPDATE categories  
        SET cat_order = (?)
        WHERE NOT name = (?) AND cat_order = (?)''',
        (prev_order,category,new_order)
    )
    con.commit()
    con.close() 


# def sql_show_all() -> None:
#     con = sqlite3.connect("restaurant.db")
#     cur = con.cursor()
#     print("Categories")
#     cur.execute("SELECT rowid, * FROM categories")
#     items = cur.fetchall()
#     for item in items:
#         print(item)
#     con.commit()

#     print("Items")
#     cur.execute("SELECT rowid, * FROM items")
#     items = cur.fetchall()
#     for item in items:
#         print(item)   
#     con.commit()

#     print("Menu")
#     cur.execute("SELECT rowid, * FROM menu")
#     items = cur.fetchall()
#     for item in items:
#         print(item)  

#     con.commit()
#     con.close()
