import sqlite3
import datetime

class Orders_db:
    ORDER_DB_PATH = "./database/order.db"

    def __init__(self, db=ORDER_DB_PATH):
        self.db = db

    def create_order_table(self):
        con = sqlite3.connect(self.db)
        cur = con.cursor()

        cur.execute("PRAGMA foreign_keys = OFF")
        con.commit()
        cur.execute('''CREATE TABLE IF NOT EXISTS Orders (
                        timestamp TIMESTAMP NOT NULL,
                        table_id INTEGER NOT NULL,
                        item_name TEXT NOT NULL,
                        amount INTEGER NOT NULL
                    )''')

        print("Table created successfully")
        con.commit()
        con.close()

    def add_order(self, table_id, item_name, amount):
        con = sqlite3.connect(self.db)
        cur = con.cursor()
        curr_time = datetime.datetime.now()
        timestamp = curr_time.strftime("%H:%M:%S")

        cur.execute("INSERT INTO Orders (timestamp, table_id, item_name, amount) \
        VALUES (?, ?, ?, ?)", (timestamp, table_id, item_name, amount))
        con.commit()
        con.close()

    def table_order_list(self, table_id):
        con = sqlite3.connect(self.db)
        cur = con.cursor()

        cur.execute("SELECT item_name, amount FROM Orders WHERE table_id = ?", (table_id,))
        order_list = cur.fetchall()

        con.close()
        return order_list

    def get_all_orders(self):
        con = sqlite3.connect(self.db)
        cur = con.cursor()

        cur.execute("SELECT * FROM Orders ORDER BY timestamp ASC")
        order_list = cur.fetchall()

        con.close()
        return order_list
