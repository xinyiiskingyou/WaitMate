'''
The `Tracking` module provides functionalites to tracking orders and managing their statuses.

This module provides the Tracking class, which allows tracking orders and marking them as
completed by different roles (such as kitchen and waitstaff).
'''
import sqlalchemy.exc
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from constant import DB_PATH
from src.db_model import Orders
from src.helper import get_order
from src.error import AccessError, InputError

class Tracking:
    '''
    Tracking class implements functionalies for managing orders and tracking their statuses.
    '''
    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)
        session_maker = sessionmaker(bind=self.engine)
        self.session = session_maker()

    def customer_view_dish_status(self, table_id: int) -> list:
        '''
        Retrieves the status of dishes for a given table.

        Arguments:
            <table_id>  (<int>)    - unique id of a table
        Exceptions:
            N/A
        Return Value:
           Return Value <list>: A list of tuples containing (item_name, is_prepared, is_served).
        '''
        order_list = get_order(table_id, self.session)
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
        self._mark_order_completed(table_id, item_name, "is_prepared")

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
        self._mark_order_completed(table_id, item_name, "is_served")

    def _mark_order_completed(self, table_id: int, item_name: str, column_name: str) -> None:
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
        table_order = get_order(table_id, self.session)

        # check if the item existed
        if not any(item[0] == item_name for item in table_order):
            raise InputError("Item not existed")

        # check if all the items with the same name have been served
        is_prepared_values = [
            order[2] if column_name == "is_prepared" else order[3]
            for order in table_order
            if item_name == order[0]
        ]
        if not is_prepared_values.count(0):
            raise AccessError("Nothing to mark")

        # mark item to be served
        try:
            self._update_item_status(table_order, table_id, item_name, column_name)
            self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            self.session.rollback()
            raise InputError(f"Database error occurred: {str(err)}") from err
        finally:
            self.session.close()

    def _update_item_status(self, orders: list, table_id: int, item_name: str, column: str) -> None:
        '''
        Helper function to update status
        '''
        for order in orders:
            value = order[2] if column == "is_prepared" else order[3]
            if order[0] == item_name and value != 1:
                if column == "is_served" and order[2] != 1:
                    raise AccessError("Dish is not ready!")

                subquery = (
                    self.session.query(Orders.id)
                    .filter(Orders.table_id == table_id, Orders.item_name == item_name,
                            getattr(Orders, column) != 1)
                    .limit(1)
                    .scalar_subquery()
                )

                self.session.query(Orders) \
                    .filter(Orders.id == subquery) \
                    .update({getattr(Orders, column): 1}, synchronize_session=False)
                break
