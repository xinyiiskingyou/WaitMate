import sqlite3

from constant import ORDER_DB_PATH
from src.helper import get_order
from src.error import AccessError, InputError

class Tracking:
    
    def __init__(self, order_db=ORDER_DB_PATH) -> None:
        self.order_db = order_db

    def customer_view_dish_status(self, table_id: int):
        
        order_list = get_order(table_id)

        order_status = []
        for order in order_list:
            order_status.append((order[0], order[2], order[3]))

        return order_status

    def kitchen_mark_order_completed(self, table_id: int, item_name: str) -> None:
        self.mark_order_completed(table_id, item_name, "is_prepared")
        
    def waitstaff_mark_order_completed(self, table_id: int, item_name: str) -> None:
        self.mark_order_completed(table_id, item_name, "is_served")
    
    def mark_order_completed(self, table_id: int, item_name: str, column_name: str):
    
        table_order = get_order(table_id)
        
        # check if the item existed
        is_present = any(item[0] == item_name for item in table_order)
        if not is_present:
            raise InputError("Item not existed")
        
        con = sqlite3.connect(self.order_db)
        cur = con.cursor()

        # check if all the items with the same name have been served
        is_prepared_values = [order[2] if column_name == "is_prepared" else order[3] 
                                for order in table_order if item_name == order[0]]
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
                    'UPDATE Orders SET {} = ? WHERE table_id = ? AND item_name = ? AND {} != ? LIMIT 1'
                    .format(column_name, column_name),
                    (1, table_id, item_name, 1)
                )
                con.commit()
                break
        con.close()
    
