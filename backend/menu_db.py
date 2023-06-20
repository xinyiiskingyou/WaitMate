import sqlite3
from constant import DATABASE

def category_count(name: str) -> bool:
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS categories(name)")
    con.commit()

    cur.execute("SELECT 1 FROM categories c WHERE c.name = (?)",(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def category_already(name: str) -> bool:
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS categories(name)")
    con.commit()

    cur.execute("SELECT 1 FROM categories c WHERE c.name = (?)",(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def item_already(name: str) -> bool:
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS items(name, cost, description)")
    con.commit()

    cur.execute("SELECT 1 FROM items i WHERE i.name = (?)",(name,))
    items = cur.fetchall()
    con.close()
    
    if len(items) == 1:
        return True
    return False

def get_next_order(category: str) -> int:
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute("SELECT * FROM menu m WHERE m.category = (?)",(category,))
    items = cur.fetchall()
    con.close()    
    return len(items)

def category_add_db(name: str):
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()

    cur.execute("INSERT INTO categories values(?)",(name,))
    con.commit()
    con.close()

def item_add_db(category: str, name: str, cost: float, description: str):
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()

    cur.execute("INSERT INTO items values(?,?,?)",(name,cost,description))
    con.commit()

    cur.execute("CREATE TABLE IF NOT EXISTS menu(category, item, order_id)")
    con.commit()

    order: int = get_next_order(category)
    cur.execute("INSERT INTO menu values(?,?,?)",(category,name,order))
    con.commit()
    con.close()

def menu_view_db() -> list[tuple]:
    items: list[tuple]
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute(
        """SELECT category, item, cost, description, order_id 
        FROM menu 
        INNER JOIN items 
        ON menu.item = items.name"""
    )

    items = cur.fetchall()
    con.close() 
    return items

def menu_item_update_details_db(category: str, item: str, name: str, cost: float, description: str) -> None:
    con = sqlite3.connect("restaurant.db")
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
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute(
        """UPDATE categories c 
        SET name = (?) 
        WHERE c.name = (?)""",
        (new_name,old_name)
    )
    con.commit()
    con.close()