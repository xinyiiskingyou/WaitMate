import sqlite3
from src.error import InputError

class table_DB():
    TABLE_DB_PATH = "./database/table.db"
    def __init__(self, database=TABLE_DB_PATH) -> None:
        self.database = database
    
    def create_order_table(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('PRAGMA foreign_keys = OFF')
        con.commit()
        cur.execute('''CREATE TABLE IF NOT EXISTS Tables (
                        table_id INTEGER PRIMARY KEY NOT NULL,
                        status TEXT NOT NULL
                    )''')

        con.commit()
        con.close()

    def select_table_number(self, table_id: int):

        self.create_order_table()
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT * FROM Tables WHERE table_id = ?', (table_id,))

        result = cur.fetchone()

        if result or table_id < 0:
            raise InputError(description='This table number is not available') 

        cur.execute('INSERT INTO Tables (table_id, status) \
        VALUES (?, ?)', (table_id, 'OCCUPIED'))
        con.commit()
        con.close()

    def check_all_table_status(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT * FROM Tables ORDER BY table_id ASC')
        table_list = cur.fetchall()

        table_dict = {}

        for table_stat in table_list:
            table_id = table_stat[0]
            table_dict[table_id] = table_stat[1]
        
        con.close()
        return table_dict

    def update_table_status(self, table_id: int, status: str):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT * FROM Tables WHERE table_id = ?', (table_id,))

        result = cur.fetchone()

        if not result or table_id < 0:
            raise InputError(description='Table number is not available')

        if status not in ['OCCUPIED', 'ASSIST', 'BILL', 'EMPTY']:
            raise InputError(description="Unknown status")

        cur.execute("UPDATE Tables SET status = ? WHERE table_id = ?", (status, table_id))
        con.commit()

        con.close()

    def clear_tables_data(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        # Execute the DELETE statement to clear the table
        cur.execute("DELETE FROM Tables")

        # Commit the changes and close the connection
        con.commit()
        con.close()
