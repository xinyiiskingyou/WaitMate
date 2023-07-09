'''
The `table_db` module provides functionality for managing table information.

This module contains functions for creating, updating, and checking the tables.
It utilizes SQLite as the underlying database engine to store and retrieve table-related data.
'''

import sqlite3
from src.error import InputError, NotFoundError
from src.clear import clear_database
from src.helper import check_table_exists
from constant import DB_PATH

class TableDB():
    '''
    The TableDB class implements operations related to tables.

    Args:
        database_path (str): The path to the SQLite database file.
    '''

    def __init__(self, database=DB_PATH) -> None:
        self.database = database

    def create_tables_db(self) -> None:
        '''
        Create a database for tables

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
        cur.execute('''CREATE TABLE IF NOT EXISTS Tables (
                        table_id INTEGER PRIMARY KEY NOT NULL,
                        status TEXT NOT NULL
                    )''')

        con.commit()
        con.close()

    def select_table_number(self, table_id: int) -> int:
        '''
        Selects a table_id and marks it as 'OCCUPIED' by default.

        Arguments:
            <table_id> (<int>)    - unique id of a table to select
        Exceptions:
            InputError  - Occurs when table_id has been selected
                        - Occurs when table_id is less than 0
        Return Value:
            N/A
        '''

        self.create_tables_db()
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        # check if table id exists
        result = check_table_exists(table_id)

        if result:
            raise InputError('Table id is not available.')

        cur.execute('INSERT INTO Tables (table_id, status) \
        VALUES (?, ?)', (table_id, 'OCCUPIED'))
        con.commit()
        con.close()

        return table_id

    def get_all_tables_status(self) -> dict:
        '''
        Return Value the status of all tables from the Tables database.

        Arguments:
            N/A
        Exceptions:
            N/A
        Return Value:
            Return Value <table_dict> of table_id with respective table status.
        '''
        try:
            con = sqlite3.connect(self.database)
            cur = con.cursor()

            cur.execute('SELECT * FROM Tables ORDER BY table_id ASC')
            table_list = cur.fetchall()
        except Exception:
            raise NotFoundError('Table database not found.')
        finally:
            con.close()

        table_dict = {}

        for table_stat in table_list:
            table_id = table_stat[0]
            table_dict[table_id] = table_stat[1]

        return table_dict

    def update_table_status(self, table_id: int, status: str) -> None:
        '''
        Updates the status of a table identified by table_id in the Tables database.

        Arguments:
            <table_id> (<int>)    - unique id of a table to select
            <status>   (<str>)    - the new status to set for the table.
        Exceptions:
            InputError  - Occurs when table_id is not available in the database
                        - Occurs when table_id is less than 0
                        - Occurs when status is not 'OCCUPIED', 'ASSIST', 'BILL', 'EMPTY'
        Return Value:
            Return Value <table_dict> of table_id with respective table status.
        '''

        # check if table number exists
        if not check_table_exists(table_id):
            raise InputError('Table id is not available.')

        # if the status is not valid
        if status not in ['OCCUPIED', 'ASSIST', 'BILL', 'EMPTY']:
            raise InputError('Unknown status')

        try:
            con = sqlite3.connect(self.database)
            cur = con.cursor()

            # update table status
            cur.execute('UPDATE Tables SET status = ? WHERE table_id = ?', (status, table_id))
            con.commit()

            # if the status is empty the table_id will be available again
            cur.execute('DELETE FROM Tables WHERE status = ?', ('EMPTY',))
            con.commit()
        except Exception:
            raise NotFoundError('Table database not found.')
        finally:
            con.close()

    def clear_tables_data(self) -> None:
        '''
        Resets all the data of the table database.

        Arguments:
            N / A
        Exceptions:
            N /A
        Return Value:
            N/A
        '''
        clear_database('Tables')
