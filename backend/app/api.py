from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.order_db import OrderDB
from src.table_db import TableDB

app = FastAPI()
order = OrderDB()
table = TableDB()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to our wait management system."}

############ ORDER #################

@app.post("order/cart/add")
def ordre_cart_add():
    order.add_order()
    return {}

@app.get("order/cart/list")
def ordre_cart_list(table_id: int):
    return order.get_table_order(table_id)

@app.get("order/listall")
def ordre_listall():
    return order.get_all_orders()

############ TABLE #################
@app.post("/table/select")
def table_select():
    table.select_table_number()
    return {}

@app.get("table/status")
def table_status():
    return table.check_all_tables_status()

@app.post("table/status/update")
def table_status_update(table_id: int, status: str):
    table.update_table_status(table_id, status)
    return {}