import sqlite3
from constant import DB_PATH
from src.helper import check_table_exists
from src.error import InputError, AccessError
from typing import Any, List

class Notifications:
    
    def __init__(self, table_db=DB_PATH, order_db=DB_PATH) -> None:
        self.table_db = table_db
        self.order_db = order_db
        
    def customer_send_notification(self, table_id: int, status: str) -> None:
        '''
        For customers to request assistance
        '''
        
        # check if table id exists
        if not check_table_exists(table_id):
            raise InputError('Table id is not valid.')

        if status not in ['ASSIST', 'BILL']:
            raise InputError('Unknown status')
        
        try:
            con = sqlite3.connect(self.table_db)
            cur = con.cursor()

            # update table status
            cur.execute('UPDATE Tables SET status = ? WHERE table_id = ?', (status, table_id))
            con.commit()
        except Exception:
            raise AccessError("Details not found")
        finally:
            con.close()
    
    def waitstaff_receives_from_customer(self) -> List[Any]:
        
        try:
            con = sqlite3.connect(self.table_db)
            cur = con.cursor()
            
            cur.execute("SELECT * FROM Tables WHERE status != 'OCCUPIED'")
            res = cur.fetchall()
        except Exception:
            return []
        finally:
            con.close()
        return res
    
    def waitstaff_receives_from_kitchen(self) -> List[Any]:
        
        try:
            con = sqlite3.connect(self.order_db)
            cur = con.cursor()
            
            cur.execute('''
                        SELECT table_id, item_name 
                        FROM Orders 
                        WHERE is_prepared == 1 AND is_served == 0
                        ORDER BY timestamp ASC
                        ''')
            res = cur.fetchall()
            con.close()
        except Exception:
            return []
        finally:
            con.close()
        return res
    