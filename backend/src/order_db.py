'''
The `order_db` module provides functionality for managing order information.

This module provides functionality to interact with an order database,
including adding orders, retrieving orders etc.
'''

import sqlite3
import datetime
from constant import ORDER_DB_PATH
from src.error import InputError
from src.clear import clear_database
from src.helper import check_table_exists

class OrderDB:
    '''
    The OrderDB class implements operations related to orders.

    Args:
        database_path (str): The path to the SQLite database file.
    '''

    def __init__(self, database=ORDER_DB_PATH):
        self.database = database

    def create_order_table(self):
        '''
        Create a database for orders.

        Arguments:
            N / A
        Exceptions:
            N /A
        Return Value:
            N/A
        '''

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
        '''
        Adds an order for a specific table number.

        Arguments:
            <table_id>  (<int>)    - unique id of a table to select
            <item_name> (<int>)    - the name of the item being ordered
            <amount>    (<int>)    - the amount of the item being ordered.
        Exceptions:
            InputError  - Occurs when table_id does not exist
                        - Occurs when item_name does not exist
                        - Occurs when amount is less than 0
        Return Value:
            N/A
        '''

        self.create_order_table()

        # check if the table_id is valid
        result = check_table_exists(table_id)
        if not result:
            raise InputError('The table_id does not refer to a valid table')

        # if not isinstance(item_name, str):
        #     raise InputError('The item_name does not refer to a valid item')

        if amount < 1:
            raise InputError('The amount must be more than 1')

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        curr_time = datetime.datetime.now()
        timestamp = curr_time.strftime('%H:%M:%S')

        cur.execute('INSERT INTO Orders (timestamp, table_id, item_name, amount) \
        VALUES (?, ?, ?, ?)', (timestamp, table_id, item_name, amount))
        con.commit()
        con.close()

    def get_table_order(self, table_id: int):
        '''
        Returns the order associated with the specified table ID.

        Arguments:
            <table_id>  (<int>)    - unique id of a table to select
        Exceptions:
            InputError  - Occurs when table_id does not exist
        Return Value:
            Returns <order_list> that contains all the orders are placed by a table
        '''
        result = check_table_exists(table_id)

        if not result:
            raise InputError('The table_id does not refer to a valid table')

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT item_name, amount FROM Orders WHERE table_id = ?', (table_id,))
        order_list = cur.fetchall()

        con.close()
        return order_list

    def get_all_orders(self):
        '''
        Retrieves all orders that is sorted by timestamp from the database.

        Arguments:
            N/A
        Exceptions:
            N/A
        Return Value:
            Returns <order_list> that containing all orders details
        '''
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('SELECT * FROM Orders ORDER BY timestamp ASC')
        order_list = cur.fetchall()

        con.close()
        return order_list

    def clear_order_table(self):
        '''
        Resets all the data of the order database.

        Arguments:
            N/A
        Exceptions:
            N /A
        Return Value:
            N/A
        '''
        clear_database(self.database, 'Orders')
