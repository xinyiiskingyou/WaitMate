import sqlite3
from constant import TABLE_DB_PATH, MENU_DB_PATH
from src.error import NotFoundError, InputError

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
        cur.execute('SELECT * FROM Categories c WHERE c.name = (?)',(category_name,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def check_if_item_exists(item_name: str) -> bool:

    try:
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Items i WHERE i.name = (?)',(item_name,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def check_if_item_id_valid(item_id):
    
    try:
        con = sqlite3.connect(MENU_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Items i WHERE i.item_id = (?)',(item_id,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        con.close()

    return result

def get_item_id_by_name(item_name: str):

    conn = sqlite3.connect(MENU_DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT item_id FROM Items WHERE name = ?", (item_name,))
    result = cur.fetchone()

    conn.close()

    if result is not None:
        item_id = result[0]
        return item_id
    else:
        return None

def get_item_order_by_name(item_name: str):

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

def get_total_item_count():
    conn = sqlite3.connect(MENU_DB_PATH)
    cur = conn.cursor()

    cur.execute('SELECT COUNT(*) FROM Items')
    count = cur.fetchone()[0]
    return count

def get_category_order_by_name(category_name: str):
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()

    cur.execute('SELECT cat_order FROM Categories c WHERE c.name = (?)',(category_name,))
    items = cur.fetchone()
    con.close()    

    return items[0]

def get_total_category_count():
    conn = sqlite3.connect(MENU_DB_PATH)
    cur = conn.cursor()

    cur.execute('SELECT COUNT(*) FROM Categories')
    count = cur.fetchone()[0]
    return count

def get_new_order_num(is_up: bool, new_order):
    if is_up:
        new_order -= 1
    else: 
        new_order += 1

    return new_order

