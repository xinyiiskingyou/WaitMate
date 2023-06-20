import sqlite3
import datetime

class OrderDB:
    ORDER_DB_PATH = "./database/order.db"

    def __init__(self, database=ORDER_DB_PATH):
        self.database = database

    def create_order_table(self):
        con = sqlite3.connect(self.database)
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
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        curr_time = datetime.datetime.now()
        timestamp = curr_time.strftime("%H:%M:%S")

        cur.execute("INSERT INTO Orders (timestamp, table_id, item_name, amount) \
        VALUES (?, ?, ?, ?)", (timestamp, table_id, item_name, amount))
        con.commit()
        con.close()

    def table_order_list(self, table_id):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute("SELECT item_name, amount FROM Orders WHERE table_id = ?", (table_id,))
        order_list = cur.fetchall()

        con.close()
        return order_list

    def get_all_orders(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute("SELECT * FROM Orders ORDER BY timestamp ASC")
        order_list = cur.fetchall()

        con.close()
        return order_list

class HistoryOrder:

    HISTORY_DB_PATH = "./database/history.db"

    def __init__(self, database=HISTORY_DB_PATH) -> None:
        self.database = database

    def create_history_table(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute("PRAGMA foreign_keys = OFF")
        con.commit()
        cur.execute('''CREATE TABLE IF NOT EXISTS HistoryOrder (
                        customer_id INTEGER NOT NULL,
                        item_name TEXT NOT NULL
                    )''')
        con.commit()
        con.close()

    def add_to_history(self, customer_id, item_name):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute("INSERT INTO HistoryOrder (customer_id, item_name) \
        VALUES (?, ?)", (customer_id, item_name))
        con.commit()

        con.close()

    def get_history(self, customer_id):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute("SELECT item_name FROM HistoryOrder WHERE customer_id = ?", (customer_id,))
        history_order_list = cur.fetchall()

        con.close()
        return history_order_list
