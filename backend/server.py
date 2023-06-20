from fastapi import FastAPI

app = FastAPI()

@app.get("/menu/category/add")
def category_add(name: str):
    return {}