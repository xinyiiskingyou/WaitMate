import sqlite3
from constant import TABLE_DB_PATH
from src.error import NotFoundError, InputError

def check_table_exists(table_id: int):
    
    if table_id < 0:
        raise InputError(description="Table id is not available.")

    try:
        con = sqlite3.connect(TABLE_DB_PATH)
        cur = con.cursor()
        cur.execute('SELECT * FROM Tables WHERE table_id = ?', (table_id,))
        result = cur.fetchone()
    except Exception:
        raise NotFoundError(description="Table database not found.")
    finally:
        con.close()

    return result