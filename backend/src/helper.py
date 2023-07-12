import sqlite3
from typing import Any, List
from constant import DB_PATH
from src.error import NotFoundError, InputError

def check_table_exists(table_id: int):
    if table_id is None or table_id < 0:
        raise InputError('Table id is not available.')

    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Tables WHERE table_id = ?', (table_id,))
        result = cur.fetchone()
    except Exception:
        return
    finally:
        con.close()

    return result

def check_if_category_exists(category_name: str):

    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Categories c WHERE lower(c.name) = (?)',(category_name,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def check_item_name_exists(item: str):
    
    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Items i WHERE lower(i.name) = (?)', (item,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_item_in_category(item_order: int, category_name: str):

    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Items WHERE category_name = (?) AND item_order = (?)', (category_name, item_order, ))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_menu_item_order_by_name(item_name: str):

    conn = sqlite3.connect(DB_PATH)
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
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Categories c WHERE c.{} = ?'.format(column), (value,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_category_order_by_name(category_name: str):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.execute('SELECT cat_order FROM Categories c WHERE c.name = (?)',(category_name,))
    items = cur.fetchone()
    con.close()    

    return items[0]

def get_total_count(table_name):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute('SELECT COUNT(*) FROM {}'.format(table_name))
    count = cur.fetchone()[0]
    con.close()

    return count  

def get_category_by_name(item_name: str):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    
    cur.execute('SELECT category FROM Menu WHERE item = ?', (item_name, ))
    result = cur.fetchone()

    return result[0]
    
def get_order_in_category(category_name: str):
    
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    cur.execute("SELECT COUNT(*) FROM Menu WHERE category = ? AND item IS NOT NULL", (category_name,))
    result = cur.fetchone()[0]

    cur.close()
    con.close()

    return int(result)

def get_order(table_id: int) -> List[Any]:
    
    if not check_table_exists(table_id):
        raise InputError('The table_id does not refer to a valid table')

    try:
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute('''
            SELECT o.item_name, o.amount, o.is_prepared, o.is_served, o.amount * i.cost
            FROM Orders o
            JOIN Items i
            on o.item_name = i.name
            WHERE table_id = ?
        ''', (table_id, ))
        order_list = cur.fetchall()
    except Exception:
        raise NotFoundError('Order database not found.')
    finally:
        con.close()

    return order_list

