from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.order_db import OrderDB
from src.table_db import TableDB

app = FastAPI()
order = OrderDB()
table = TableDB()

origins = [
    'http://localhost:3000',
    'localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/', tags=['root'])
async def read_root() -> dict:
    return {'message': 'Welcome to our wait management system.'}

############ ORDER #################

@app.post('/order/cart/add/{table_id}')
def ordre_cart_add(table_id: int, item_name: str, amount: int):
    order.add_order(table_id, item_name, amount)
    return {}
    
@app.get('/order/cart/list/{table_id}')
def ordre_cart_list(table_id: int):
    return order.get_table_order(table_id)

@app.get('/order/listall')
def ordre_listall():
    return order.get_all_orders()

############ TABLE #################
@app.get('/table/select/{table_id}')
def table_select(table_id: int):
    table.select_table_number(table_id)
    return {}

@app.get('/table/status')
def table_status():
    return table.get_all_tables_status()

@app.post('/table/status/update')
def table_status_update(table_id: int, status: str):
    table.update_table_status(table_id, status)
    return {}