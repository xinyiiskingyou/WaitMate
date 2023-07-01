import sqlite3

from constant import TABLE_DB_PATH
from src.helper import (
    check_table_exists, mark_order_completed, get_order
)
from src.error import InputError

class Tracking:
    
    def __init__(self, table_db=TABLE_DB_PATH) -> None:
        self.table_db = table_db
    
    def customer_request_assistance(self, table_id: int, status: str) -> str:
        '''
        For customers to request assistance
        '''
        
        # check if table id exists
        if not check_table_exists(table_id):
            raise InputError('Table id is not valid.')

        if status not in ['ASSIST', 'BILL']:
            raise InputError('Unknown status')
        
        con = sqlite3.connect(self.table_db)
        cur = con.cursor()

        # update table status
        cur.execute('UPDATE Tables SET status = ? WHERE table_id = ?', (status, table_id))
        con.commit()
        return status

    def customer_view_dish_status(self, table_id: int):
        
        order_list = get_order(table_id)

        order_status = []
        for order in order_list:
            order_status.append((order[0], order[2], order[3]))

        return order_status

    def kitchen_mark_order_completed(self, table_id: int, item_name: str) -> None:
        mark_order_completed(table_id, item_name, "is_prepared")
        
    def waitstaff_mark_order_completed(self, table_id: int, item_name: str) -> None:
        mark_order_completed(table_id, item_name, "is_served")
