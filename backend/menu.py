from menu_db import category_already, category_add_db, item_already, item_add_db, menu_view_db

def category_add(name: str) -> None:
    if len(name) < 1 or len(name) > 15:
        return
    if category_already(name):
        return
    
    category_add_db(name)

def item_add(category: str, name: str, cost: float, description: str) -> None:
    if len(name) < 1 or len(name) > 15:
        return
    if item_already(name):
        return
    
    item_add_db(category, name, cost, description)
    
def menu_view() -> dict[str, list[dict]]:
    menu: dict[str, list[dict]] = {}
    for item in menu_view_db():
        if item[0] not in menu:
            menu[item[0]] = []
        menu[item[0]].append(
            {"item": item[1], "cost": item[2], "description": item[3]}
        )

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





