import uvicorn
from src.meme import MemeDB
if __name__ == '__main__':
    # meme = MemeDB()
    # meme.clear_data()
    uvicorn.run('app.api:app', host='0.0.0.0', port=8000, reload=True)
