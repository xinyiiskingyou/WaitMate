'''
The `checkout` module provides functionalites for checkout related features.

These features includes customer viewing their bill, adding any coupons,
and tips. It also includes the coupons in relation to the manager
'''
import sqlite3
import datetime
from constant import DB_PATH
from src.error import InputError
from typing import List

class Checkout:
    def __init__(self, database=DB_PATH) -> None:
        self.database = database

    def checkout_order(self, table_id: int) -> List[dict]:
        ret: list

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        try:
            cur.execute('''SELECT name, cost, amount from Orders o 
                JOIN Items i on i.name = o.item_name 
                WHERE table_id = ?''', 
                (table_id,)
            )
            bill = cur.fetchall()
            ret = [{'name': i[0], 'cost': i[1] * i[2], 'amount': i[2]} for i in bill]

        except:
            ret = []

        con.close()
        return ret
    
    def checkout_bill(self, table_id: int) -> dict:
        coupon: str = ''
        bill: dict = {
            'items': self.checkout_order(table_id),
        }
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        try:
            cur.execute('''SELECT coupon, tip FROM Checkout 
                WHERE table_id = ?''',
                (table_id,)
            )
            data = cur.fetchone()
            if data[0]:
                coupon = data[0]
            if data[1]:
                bill['tip'] = data[1]
        except:
            pass

        con.close()
        total: float = 0
        for i in bill['items']:
            total += i['cost']

        
        bill['total'] = total

        if coupon:
            bill['coupon'] = bill['total']
            bill['total'] = bill['total'] * (100 - self.checkout_coupon_find(coupon))/100
            bill['total'] = round(bill['total'], 2) 
            bill['coupon'] = round(bill['coupon'] - bill['total'], 2)

        if 'tip' in bill:
            bill['total'] += bill['tip']

        return bill

    def checkout_bill_tips(self, table_id: int, amount: int):
        if amount <= 0:
            raise InputError('Invalid tip amount.')

        self.checkout_create()
        self.checkout_add(table_id)

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('''UPDATE Checkout 
            SET tip = (?) 
            WHERE table_id = (?)''',
            (amount, table_id)
        )
        con.commit()
        con.close()

    def checkout_bill_coupon(self, table_id: int, coupon: str):
        if not self.checkout_coupon_find(coupon):
            raise InputError('Invalid coupon.')
        
        self.checkout_create()
        self.checkout_add(table_id)

        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('''UPDATE Checkout 
            SET coupon = (?) 
            WHERE table_id = (?)''',
            (coupon, table_id)
        )
        con.commit()
        con.close()

    def checkout_coupon_create(self, code: str, amount: int, expiry: str):
        if self.checkout_coupon_find(code):
            raise InputError('Coupon code already in use')
        if amount <= 0:
            raise InputError('Invalid coupon amount')
        if expiry < str(datetime.date.today()):
            raise InputError('Invalid date.')
        
        con = sqlite3.connect(self.database)
        cur = con.cursor()

        cur.execute('INSERT INTO Coupons(code, amount, expiry) VALUES (?, ?, ?)', (code, amount, expiry))

        con.commit()
        con.close()

    def checkout_coupon_delete(self, code: str):
        if not self.checkout_coupon_find(code):
            return
        
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('DELETE FROM Coupons WHERE code = (?)', (code,))
        con.commit()
        con.close()

    def checkout_coupon_view(self) -> List[dict]: 
        self.coupon_create()
        self.coupon_expire()

        coupons = []

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('SELECT * FROM Coupons')
        data: list = cur.fetchall()
        con.close()

        coupons = [{'code': i[0], 'int': i[1], 'expiry': i[2]} for i in data]
        return coupons
    
    def checkout_remove(self, table_id: int):
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('DELETE FROM Checkout WHERE table_id = (?)', (table_id,))
        con.commit()
        con.close()

    # PRIVATE
    
    def checkout_coupon_find(self, code: str) -> int:
        self.coupon_create()
        self.coupon_expire()

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('SELECT * FROM Coupons WHERE code = ?',
            (code,)
        )

        data = cur.fetchall()
        con.close()

        if len(data) == 0:
            return None
        return data[0][1]
    
    def coupon_create(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS Coupons (
            code TEXT PRIMARY KEY,
            amount INTEGER,
            expiry TEXT)'''
        )
        con.commit()
        con.close()

    def checkout_create(self):
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS Checkout (
            table_id INTEGER PRIMARY KEY,
            coupon TEXT,
            tip INTEGER)'''
        )

        con.commit()
        con.close()

    def checkout_add(self, table_id: int):
        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('SELECT * FROM Checkout WHERE table_id = ?', (table_id,))
        if len(cur.fetchall()) == 0:
            cur.execute('INSERT INTO Checkout(table_id, coupon, tip) VALUES (?,?,?)', 
                (table_id, None, None)
            )

        con.commit()
        con.close()

    def coupon_expire(self):
        currentDateTime = str(datetime.date.today())

        con = sqlite3.connect(self.database)
        cur = con.cursor()
        cur.execute('DELETE FROM Coupons WHERE expiry < (?)', (currentDateTime,))
        con.commit()
        con.close()
