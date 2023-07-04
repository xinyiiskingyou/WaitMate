import sqlite3
# from constant import ORDER_DB_PATH, MENU_DB_PATH, DB_PATH
# from src.error import InputError, AccessError
DB_PATH = './src/database/restaurant.db'
def checkout_bill(table_id: int) -> list[dict]:
    #if there is no order
    ret: list = []

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute('''SELECT name, cost, amount from Orders o 
        JOIN Items i on i.name = o.item_name 
        WHERE table_id = ?''', 
        (table_id,)
    )
    bill = cur.fetchall()
    print(ret)
    con.close()

    ret = [{'name': i[0], 'cost': i[1] * i[2], 'amount': i[2]} for i in bill]
    return ret

def checkout_bill_tips():
    pass

def checkout_bill_coupon():
    pass

def checkout_coupon_create():
    pass

if __name__ == '__main__':
    checkout_bill(1)
