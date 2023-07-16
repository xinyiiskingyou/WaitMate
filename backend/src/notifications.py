'''
The `Notifications` module provides functionalites for managing notifications.

This module provides the Notifications class, which allows customers to send notifications,
and provides functionality for waitstaff to receive notifications from customers and
from the kitchen.
'''

import sqlite3
import datetime
from typing import Any, List
from constant import DB_PATH
from src.helper import check_table_exists
from src.error import InputError, NotFoundError

class Notifications:
    '''
    Notifications class for sending and receiving notifications.

    Args:
        database_path (str): The path to the SQLite database file.
    '''
    def __init__(self, database=DB_PATH) -> None:
        self.database = database

    def customer_send_notification(self, table_id: int, status: str) -> None:
        '''
        Allows customers to request assistance or the bill.

        Arguments:
            <table_id>  (<int>)    - unique id of a table
            <status>    (<str>)    - the status indicating the type of notification
        Exceptions:
            InputError      - Occurs when the table id does not exist.
                            - Occurs when the status is not valid.
            NotFoundError   - Occurs when table details not found.
        Return Value:
            N/A
        '''

        # check if table id exists
        if not check_table_exists(table_id):
            raise InputError('Table id is not valid.')

        if status not in ['ASSIST', 'BILL']:
            raise InputError('Unknown status')

        try:
            con = sqlite3.connect(self.database)
            cur = con.cursor()

            curr_time = datetime.datetime.now()
            timestamp = curr_time.strftime('%H:%M:%S')

            # update table status
            cur.execute('''
                UPDATE Tables
                SET status = ?,
                    req_time = ?
                WHERE table_id = ?
            ''', (status, timestamp, table_id))

            con.commit()
        except Exception:
            raise NotFoundError("Details not found")
        finally:
            con.close()

    def waitstaff_receives_from_customer(self) -> List[Any]:
        '''
        Allows waitstaff to retrieves the tables notification that are not
        in the "OCCUPIED" status.

        Arguments:
            N/A
        Exceptions:
            sqlite3.Error: If there is an issue executing the database query.
        Return Value:
            List[Any]: A list of tuples containing the table details.
        '''
        try:
            con = sqlite3.connect(self.database)
            cur = con.cursor()

            cur.execute("SELECT * FROM Tables WHERE status != 'OCCUPIED' ORDER BY req_time")
            res = cur.fetchall()
        except sqlite3.Error:
            return []
        finally:
            con.close()
        return res

    def waitstaff_receives_from_kitchen(self) -> List[Any]:
        '''
        Allows waitstaff to receive notifications from kitchen staff
        when an order item is ready to served.

        Arguments:
            N/A
        Exceptions:
            sqlite3.Error: If there is an issue executing the database query.
        Return Value:
            List[Any]: A list of tuples containing the table details.
        '''
        try:
            con = sqlite3.connect(self.database)
            cur = con.cursor()

            cur.execute('''
                        SELECT table_id, item_name 
                        FROM Orders 
                        WHERE is_prepared == 1 AND is_served == 0
                        ORDER BY table_id ASC
                        ''')
            res = cur.fetchall()
            con.close()
        except sqlite3.Error:
            return []
        finally:
            con.close()
        return res
