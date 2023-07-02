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
    
    if table_name == "Menu":
        update_menu_item_order(prev_order, new_order)
    
def update_menu_item_order(prev_order, new_order):
    con = sqlite3.connect(MENU_DB_PATH)
    cur = con.cursor()
    cur.execute('''UPDATE Items
        SET item_order = CASE
            WHEN item_order = ? THEN ?
            WHEN item_order = ? THEN ?
            ELSE item_order
        END''', 
    (prev_order, new_order, new_order, prev_order))
    con.commit()
    con.close()