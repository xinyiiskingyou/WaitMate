'''
The `Notifications` module provides functionalites for managing notifications.

This module provides the Notifications class, which allows customers to send notifications,
and provides functionality for waitstaff to receive notifications from customers and
from the kitchen.
'''

import datetime
from typing import Any, List
import sqlalchemy.exc
from sqlalchemy import create_engine, update, and_
from sqlalchemy.orm import sessionmaker
from constant import DB_PATH
from src.db_model import Tables, Orders
from src.helper import check_table_exists
from src.error import InputError, NotFoundError

class Notifications:
    '''
    Notifications class for sending and receiving notifications.
    '''
    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)
        session_maker = sessionmaker(bind=self.engine)
        self.session = session_maker()

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
        if not check_table_exists(table_id, self.session):
            raise InputError(detail='Table id is not valid.')

        if status not in ['ASSIST', 'BILL']:
            raise InputError(detail='Unknown status')

        try:
            curr_time = datetime.datetime.now()

            stmt = (
                update(Tables)
                .where(Tables.table_id == table_id)
                .values(status=status, req_time=curr_time)
            )
            self.session.execute(stmt)
            self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            raise InputError(detail=f"Database error occurred: {str(err)}") from err
        finally:
            self.session.close()

    def waitstaff_receives_from_customer(self) -> List[Any]:
        '''
        Allows waitstaff to retrieves the tables notification that are not
        in the "OCCUPIED" status.

        Arguments:
            N/A
        Exceptions:
            Exception: If there is an issue executing the database query.
        Return Value:
            List[Any]: A list of tuples containing the table details.
        '''
        try:
            query = (
                self.session.query(Tables.table_id, Tables.status, Tables.req_time)
                .where(Tables.status != 'OCCUPIED')
                .order_by(Tables.req_time)
                .all()
            )
            return [tuple(row) for row in query]
        except sqlalchemy.exc.SQLAlchemyError as err:
            print(f"Database error occurred: {str(err)}")
            return []
        finally:
            self.session.close()

    def waitstaff_receives_from_kitchen(self) -> List[Any]:
        '''
        Allows waitstaff to receive notifications from kitchen staff
        when an order item is ready to served.

        Arguments:
            N/A
        Exceptions:
            Exception: If there is an issue executing the database query.
        Return Value:
            List[Any]: A list of tuples containing the table details.
        '''
        try:
            query = (
                self.session.query(Orders.table_id, Orders.item_name)
                .where(and_(Orders.is_prepared == 1, Orders.is_served == 0))
                .order_by(Orders.table_id)
                .all()
            )
            return [tuple(row) for row in query]
        except sqlalchemy.exc.SQLAlchemyError as err:
            print(f"Database error occurred: {str(err)}")
            return []
        finally:
            self.session.close()
