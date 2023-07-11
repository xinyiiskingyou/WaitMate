'''
The `Tracking` module provides functionalites to tracking orders and managing their statuses.

This module provides the Tracking class, which allows tracking orders and marking them as
completed by different roles (such as kitchen and waitstaff).
'''

import sqlite3
from constant import DB_PATH
from src.helper import get_order
from src.error import AccessError, InputError

class Tracking:
    '''
    Tracking class implements functionalies for managing orders and tracking their statuses.

    Args:
        database_path (str): The path to the SQLite database file.
    '''
    def __init__(self, database=DB_PATH) -> None:
        self.database = database

    @staticmethod
    def customer_view_dish_status(table_id: int) -> list:
        '''
        Retrieves the status of dishes for a given table.

        Arguments:
            <table_id>  (<int>)    - unique id of a table
        Exceptions:
            N/A
        Return Value:
           Return Value <list>: A list of tuples containing (item_name, is_prepared, is_served).
        '''
        order_list = get_order(table_id)
        order_status = []
        for order in order_list:
            order_status.append((order[0], order[2], order[3]))
        return order_status

    def kitchen_mark_order_completed(self, table_id: int, item_name: str) -> None:
        '''
        Marks a kitchen order as completed.

        Arguments:
            <table_id>  (<int>)    - unique id of a table
            <item_name> (<str>)    - the name of the item to mark as completed.
        Exceptions:
            AccessError: If the dish is not ready to be served.
        Return Value:
            N/A
        '''
        self.mark_order_completed(table_id, item_name, "is_prepared")

    def waitstaff_mark_order_completed(self, table_id: int, item_name: str) -> None:
        '''
        Waitstaff to mark an order item as completed.

        Arguments:
            <table_id>  (<int>)    - unique id of a table
            <item_name> (<str>)    - the name of the item to mark as completed.
        Exceptions:
            AccessError: If the dish is not ready to be served.
        Return Value:
            N/A
        '''
        self.mark_order_completed(table_id, item_name, "is_served")

    def mark_order_completed(self, table_id: int, item_name: str, column_name: str) -> None:
        '''
        Helper function to mark the order as completed.

        Arguments:
            <table_id>  (<int>)    - unique id of a table
            <item_name> (<str>)    - the name of the item to mark as completed.
            <column_name> (<str>)  - the name of the column to update.
        Exceptions:
            AccessError - Occurs when all the items have been served and there is nothing to mark.
                        - Occurs when the dish is not ready to be served.
            InputError  - Occurs when the item to mark does not exist.
        Return Value:
            N/A
        '''
        table_order = get_order(table_id)

        # check if the item existed
        is_present = any(item[0] == item_name for item in table_order)
        if not is_present:
            raise InputError("Item not existed")

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        # check if all the items with the same name have been served
        is_prepared_values = [
            order[2] if column_name == "is_prepared" else order[3]
            for order in table_order
            if item_name == order[0]
        ]

        if not is_prepared_values.count(0):
            raise AccessError("Nothing to mark")

        # mark item to be served
        for order in table_order:
            value = order[2] if column_name == "is_prepared" else order[3]
            if order[0] == item_name and value != 1:
                # waitstaff cannot update the dish status unless it's ready to be served
                if column_name == "is_served" and order[2] != 1:
                    raise AccessError("Dish is not ready!")
                cur.execute(
                    '''UPDATE Orders SET {column} = ?
                    WHERE table_id = ? AND item_name = ? AND {column} != ?
                    '''.format(column=column_name),
                    (1, table_id, item_name, 1)
                )

                con.commit()
                break
        con.close()
