import uvicorn
# from src.tracking import Tracking
# from src.order import OrderDB

if __name__ == '__main__':

    # track = Tracking()
    # order = OrderDB()
    # # order.add_order(5, 'meat lover', 1)
    # track.kitchen_mark_order_completed(22, 'dorayaki')
    # print(order.get_table_order(5))
    uvicorn.run('app.api:app', host='0.0.0.0', port=8000, reload=True)

# # # from database import order_db

# # # order = order_db.Orders_db()
# # # order.create_order_table()
# # # order.add_order(4, 'sushi', 1)
# # # print('order:')
# # # print(order.table_order_list(3))
# # # print('all orders:')
# # # order.get_all_orders()


# from src.table import TableDB
# from src.order import OrderDB

# table = TableDB()
# # table.select_table_number(1)

# order = OrderDB()
# # order.add_order(1, "dorayaki",3)
# # order.add_order(1, "dorayaki",3)
# # order.add_order(1, "dorayaki",3)

# # print(order.get_table_order(1))
# # # print(order.get_all_orders())

# # track.waitstaff_mark_order_completed(1, 'dorayaki')
# print(track.customer_view_dish_status(1))
# # print("AFTER: ")
# # print(order.get_table_order(1))

# # print(order.get_all_orders())


