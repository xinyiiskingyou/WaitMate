import sqlite3
from constant import DATABASE

#TODO
def category_count(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS categories(name, cat_order)")
    con.commit()

    cur.execute("SELECT 1 FROM categories c WHERE c.name = (?)",(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def category_already(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS categories(name, cat_order)")
    con.commit()

    cur.execute("SELECT 1 FROM categories c WHERE c.name = (?)",(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def item_already(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS items(name, cost, description, ingredients, is_vegan)")
    con.commit()

    cur.execute("SELECT 1 FROM items i WHERE i.name = (?)",(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def get_next_order(category: str) -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("SELECT * FROM menu m WHERE m.category = (?)",(category,))
    items = cur.fetchall()
    con.close()    
    return len(items)

def get_next_order_cat() -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("SELECT * FROM categories")
    items = cur.fetchall()
    con.close()    
    return len(items)

def get_cat_order(category: str) -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("SELECT * FROM categories c WHERE c.category = (?)",(category,))
    items = cur.fetchall()
    con.close()    
    return items[1]

def get_item_order(category: str, item_name: str) -> int:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("SELECT * FROM menu m WHERE m.category = (?)",(category,))
    items = cur.fetchall()
    con.close()    
    return items[6]

def category_add_db(name: str):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    order: int = get_next_order_cat()
    cur.execute("INSERT INTO categories values(?,?)",(name,order))
    con.commit()
    con.close()

def item_add_db(category: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    cur.execute("INSERT INTO items values(?,?,?,?,?)",(name,cost,description,ingredients,is_vegan))
    con.commit()

    cur.execute("CREATE TABLE IF NOT EXISTS menu(category, item, item_order)")
    con.commit()

    order: int = get_next_order(category)
    cur.execute("INSERT INTO menu values(?,?,?)",(category,name,order))
    con.commit()
    con.close()

def menu_view_db() -> list[tuple]:
    items: list[tuple]
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS menu(category, item, item_order)")
    con.commit()

    cur.execute("CREATE TABLE IF NOT EXISTS items(name, cost, description, ingredients, is_vegan)")
    con.commit()

    cur.execute("CREATE TABLE IF NOT EXISTS categories(name, cat_order)")
    con.commit()

    cur.execute(
        """SELECT c.name, item, cost, description, ingredients, is_vegan, cat_order, item_order 
        FROM categories c
        LEFT JOIN menu m
        ON m.category = c.name
        LEFT JOIN items i
        ON i.name = m.item
        ORDER BY c.cat_order, m.item_order"""
    )

    items = cur.fetchall()
    con.close() 
    print(items)

    return items

def menu_item_update_details_db(category: str, item: str, name: str, cost: float, description: str, ingredients: str, is_vegan: bool) -> None:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        """UPDATE item i 
        SET name = (?), cost = (?), description = (?) 
        WHERE i.name = (?)""",
        (name,cost,description,item)
    )
    con.commit()
    con.close()

def menu_category_update_details_db(old_name: str, new_name: str) -> None:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        """UPDATE categories c 
        SET name = (?) 
        WHERE c.name = (?)""",
        (new_name,old_name)
    )
    con.commit()
    con.close()

def menu_item_remove_db(category: str, item: str) -> None:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(
        """DELETE categories c 
        SET name = (?) 
        WHERE c.name = (?)""",
        (item)
    )
    con.commit()
    con.close()   

def menu_item_update_order_db(category: str, item_name: str, is_up: bool) -> None:
    pass

def menu_category_update_order_db(category: str, is_up: bool) -> None:
    pass