'''
The `order_db` module provides functionalites for managing order information.

This module provides functionality to interact with an order database,
including adding orders, retrieving orders etc.
'''

import datetime
from sqlalchemy import MetaData, Table, create_engine, and_
from sqlalchemy.orm import sessionmaker
from typing import Any, List
from constant import DB_PATH, DB_PATH
from src.db_model import Orders
from src.error import InputError
from src.helper import check_table_exists, check_item_exists, get_order

class OrderDB:
    '''
    The OrderDB class implements operations related to orders.
    '''

    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)

        # create orders table
        Orders.__table__.create(bind=self.engine, checkfirst=True)

        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def add_order(self, table_id: int, item_name: str, amount: int) -> None:
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

        # check if the table_id is valid
        if not check_table_exists(table_id, self.session):
            raise InputError('The table_id does not refer to a valid table')

        # check if item name is valid
        if not check_item_exists(item_name.lower(), self.session):
            raise InputError('The item_name does not refer to a valid item')

        # check if amount is valid
        if amount is None or amount < 1:
            raise InputError('The amount must be more than 1')

        try:
            curr_time = datetime.datetime.now()
            timestamp = curr_time.strftime('%H:%M:%S')

            # create new order
            new_order = Orders(
                timestamp=timestamp,
                table_id=table_id,
                item_name=item_name,
                amount=amount
            )
            self.session.add(new_order)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()

    def get_table_order(self, table_id: int) -> List[Any]:
        '''
        Return Value the order associated with the specified table ID.

        Arguments:
            <table_id>  (<int>)    - unique id of a table to select
        Exceptions:
            InputError  - Occurs when table_id does not exist
        Return Value:
            Return Value <order_list> that contains all the orders are placed by a table
        '''
        return get_order(table_id, self.session)

    def get_all_orders(self) -> List[Any]:
        '''
        Retrieves all orders that is sorted by timestamp from the database.

        Arguments:
            N/A
        Exceptions:
            N/A
        Return Value:
            Return Value <order_list> that containing all orders details
        '''

        try:
            query = (
                self.session.query(Orders.timestamp, Orders.table_id, Orders.item_name, Orders.amount)
                .filter(and_(Orders.is_prepared == 0, Orders.is_served == 0))
                .order_by(Orders.timestamp)
                .all()
            )
            order_list = [(timestamp, table_id, item_name, amount) for timestamp, table_id, item_name, amount in query]
            return order_list
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()

    def clear_order_table(self) -> None:
        '''
        Resets all the data of the order database.

        Arguments:
            N/A
        Exceptions:
            N /A
        Return Value:
            N/A
        '''
        metadata = MetaData()
        orders = Table('Orders', metadata, autoload_with=self.engine)

        with self.engine.begin() as conn:
            delete_query = orders.delete()
            conn.execute(delete_query)
