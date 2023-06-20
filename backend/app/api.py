from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from menu import category_add, item_add, menu_view


app = FastAPI()

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

@app.post("/menu/category/add")
def category_add_api(name: str):    
    category_add(name)
    return {}

@app.post("/menu/item/add")
def item_add_api(category: str, name: str, cost: float, description: str):    
    item_add(category, name, cost, description)
    return {}

@app.get("/menu/listall")
def menu_view_api():
    return menu_view()