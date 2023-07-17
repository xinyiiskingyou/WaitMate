# import uvicorn
# # from src.tracking import Tracking
# # from src.order import OrderDB

# if __name__ == '__main__':

#     # track = Tracking()
#     # order = OrderDB()
#     # # order.add_order(5, 'meat lover', 1)
#     # track.kitchen_mark_order_completed(22, 'dorayaki')
#     # print(order.get_table_order(5))
#     uvicorn.run('app.api:app', host='0.0.0.0', port=8000, reload=True)


from src.table import TableDB
from src.menu_db import Menu_db
t = TableDB()
m = Menu_db()
# t.clear_tables_data()
# t.select_table_number(1)

# t.clear_tables_data()
# t.select_table_number(1)
# t.select_table_number(2)
# t.update_table_status(2, 'EMPTY')
# print(t.get_all_tables_status())
# t.select_table_number(1)

# m.category_add('Japanese')
# m.item_add({
#         'category': 'Japanese',
#         'name': 'salmon sushi',
#         'cost': 10,
#         'description': '_',
#         'ingredients': '_',
#         'is_vegan': False
#     })
print(m.get_all_categories())
# print(m.get_items_in_category(1))
# print()
m.update_details_menu_items('Japanese', 1)