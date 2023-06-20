import sqlite3


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

def get_next_order(category) -> int:
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute("SELECT * FROM menu m WHERE m.category = (?)",(category,))
    items = cur.fetchall()
    con.close()    
    return len(items)

def category_add(name: str) -> None:
    if len(name) < 1 or len(name) > 15:
        return
    if category_already(name):
        print("exist")
        return
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute("INSERT INTO categories values(?)",(name,))
    con.commit()
    con.close()


def item_add(category: str, name: str, cost: float, description: str) -> None:
    if len(name) < 1 or len(name) > 15:
        return
    if item_already(name):
        print("exist")
        return
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

def menu_view() -> dict[str, list[dict]]:
    menu: dict[str, list[dict]] = {}
    con = sqlite3.connect("restaurant.db")
    cur = con.cursor()
    cur.execute("SELECT * FROM categories")
    items = cur.fetchall()
    for item in items:
        menu[item[0]] = []

    cur.execute(
        """SELECT category, item, cost, description, order_id 
        FROM menu 
        INNER JOIN items 
        ON menu.item = items.name"""
    )
    items = cur.fetchall()
    for item in items:
        menu[item[0]].append({"item": item[1], "cost": item[2], "description": item[3]})
    con.close()  

    return menu  

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





