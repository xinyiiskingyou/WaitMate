import sqlite3
from typing import Any, List
from constant import TABLE_DB_PATH, MENU_DB_PATH, ORDER_DB_PATH
from src.error import NotFoundError, InputError, AccessError

def check_table_exists(table_id: int):
    
    if table_id < 0:
        raise InputError('Table id is not available.')

    try:
        con = sqlite3.connect(TABLE_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Tables WHERE table_id = ?', (table_id,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def check_if_category_exists(category_name: str):

    try:
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Categories c WHERE lower(c.name) = (?)',(category_name,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_item_info(column_name: str, item: str):

    try:
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Items i WHERE i.{} = (?)'.format(column_name),(item,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_menu_item_order_by_name(item_name: str):

    conn = sqlite3.connect(MENU_DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT item_order FROM Menu WHERE item = ?", (item_name,))
    result = cur.fetchone()
    conn.close()

    if result is not None:
        item_id = result[0]
        return item_id
    else:
        return None

def check_categories_key_is_valid(column, value):
    try:
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Categories c WHERE c.{} = ?'.format(column), (value,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_category_order_by_name(category_name: str):
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()

    cur.execute('SELECT cat_order FROM Categories c WHERE c.name = (?)',(category_name,))
    items = cur.fetchone()
    con.close()    

    return items[0]

def get_total_count(table_name):
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()
    cur.execute('SELECT COUNT(*) FROM {}'.format(table_name))
    count = cur.fetchone()[0]
    con.close()

    return count  

def get_category_by_name(item_name: str):
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()
    
    cur.execute('SELECT category FROM Menu WHERE item = ?', (item_name, ))
    result = cur.fetchone()

    return result[0]
    
def get_order_in_category(category_name: str):
    
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()

    cur.execute("SELECT COUNT(*) FROM Menu WHERE category = ? AND item IS NOT NULL", (category_name,))
    result = cur.fetchone()[0]

    cur.close()
    con.close()

    return int(result)

def update_order(table_name, column_name, is_up, prev_order):

    if prev_order == 1 and is_up:
        raise InputError('Invalid order')

    new_order = prev_order - 1 if is_up else prev_order + 1

    update_order_in_db(table_name, column_name, prev_order, new_order)
    
    if table_name == "Menu":
        update_order_in_db("Items", "item_order", prev_order, new_order)

def update_order_in_db(table_name, column_name, prev_order, new_order):
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()
    cur.execute('''UPDATE {table}
        SET {column} = CASE
            WHEN {column} = ? THEN ?
            WHEN {column} = ? THEN ?
            ELSE {column}
        END'''.format(table=table_name, column=column_name), 
    (prev_order, new_order, new_order, prev_order))

    con.commit()
    con.close()

def get_order(table_id: int) -> List[Any]:
    
    if not check_table_exists(table_id):
        raise InputError('The table_id does not refer to a valid table')

    try:
        con = sqlite3.connect(ORDER_DB_PATH)
        cur = con.cursor()

        cur.execute('SELECT item_name, amount, is_prepared, is_served FROM Orders WHERE table_id = ?', (table_id,))
        order_list = cur.fetchall()
    except Exception:
        raise NotFoundError('Order database not found.')
    finally:
        con.close()

    return order_list

def mark_order_completed(table_id: int, item_name: str, column_name: str):
    
    table_order = get_order(table_id)
    
    # check if the item existed
    is_present = any(item[0] == item_name for item in table_order)
    if not is_present:
        raise InputError("Item not existed")
    
    con = sqlite3.connect(ORDER_DB_PATH)
    cur = con.cursor()

    # check if all the items with the same name have been served
    is_prepared_values = [order[2] if column_name == "is_prepared" else order[3] 
                            for order in table_order if item_name == order[0]]
    if not is_prepared_values.count(0):
        raise AccessError("Nothing to mark")
    
    # mark item to be served 
    for order in table_order:
        value = order[2] if column_name == "is_prepared" else order[3]
        if order[0] == item_name and value != 1:
            # waitstaff cannot update the dish status unless it's ready to be served
            if column_name == "is_served" and order[2] != 1:
                raise AccessError("Dish is not ready!")
            cur.execute(
                'UPDATE Orders SET {} = ? WHERE table_id = ? AND item_name = ? AND {} != ? LIMIT 1'
                .format(column_name, column_name),
                (1, table_id, item_name, 1)
            )
            con.commit()
            break
    con.close()
