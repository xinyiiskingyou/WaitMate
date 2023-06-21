from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.table_db import table_DB

app = FastAPI()
table = table_DB()

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

@app.post("/table/select")
def table_select():
    table.select_table_number()

@app.get("table/status")
def table_status():
    return table.check_all_tables_status()

@app.post("table/status/update")
def table_status_update(table_id: int, status: str):
    table.update_table_status(table_id, status)