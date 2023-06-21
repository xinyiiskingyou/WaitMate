import sqlite3
import datetime
from src.error import InputError
from src.clear import clear_database

class OrderDB:
    ORDER_DB_PATH = './src/database/order.db'

    def __init__(self, database=ORDER_DB_PATH):
        self.database = database

    def create_order_table(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('PRAGMA foreign_keys = OFF')
        con.commit()
        cur.execute('''CREATE TABLE IF NOT EXISTS Orders (
                        timestamp TIMESTAMP NOT NULL,
                        table_id INTEGER NOT NULL,
                        item_name TEXT NOT NULL,
                        amount INTEGER NOT NULL
                    )''')

        con.commit()
        con.close()

    def add_order(self, table_id: int, item_name: str, amount: int):

        self.create_order_table()

        if table_id < 0:
            raise InputError(description = 'The table_id does not refer to a valid table')
        
        # if not isinstance(item_name, str):
        #     raise InputError(description = 'The item_name does not refer to a valid item')
        
        if amount < 1:
            raise InputError(description = 'The amount must be more than 1')
            
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        curr_time = datetime.datetime.now()
        timestamp = curr_time.strftime('%H:%M:%S')

        cur.execute('INSERT INTO Orders (timestamp, table_id, item_name, amount) \
        VALUES (?, ?, ?, ?)', (timestamp, table_id, item_name, amount))
        con.commit()
        con.close()

    def get_table_order(self, table_id: int):
        if table_id < 0:
            raise InputError(description = 'The table_id does not refer to a valid table')
            
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT item_name, amount FROM Orders WHERE table_id = ?', (table_id,))
        order_list = cur.fetchall()

        con.close()
        return order_list

    def get_all_orders(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT * FROM Orders ORDER BY timestamp ASC')
        order_list = cur.fetchall()

        con.close()
        return order_list
    
    def clear_order_table(self):
        clear_database(self.database, "Orders")
