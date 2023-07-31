import uvicorn
from src.meme import MemeDB
if __name__ == '__main__':
    # meme = MemeDB()
    # meme.like_a_meme("aypasha2@gmail.com", "./images/meme1.png")
    # meme.like_a_meme("aypasha23@gmail.com", "./images/meme1.png")
    # meme.like_a_meme("aypasha235@gmail.com", "./images/meme1.png")
    # meme.like_a_meme("aypasha2352@gmail.com", "./images/meme1.png")
    # meme.like_a_meme("test@gmail.com", "./images/meme1.png")
    # meme.like_a_meme("123@gmail.com", "./images/meme1.png")
    # meme.like_a_meme("123456@gmail.com", "./images/images?q=tbn:ANd9GcTwrN-gYs0DEy8SJWL5KvUmPSFxrX11ux7fDQ&usqp=CAU.png")
    
    # meme.clear_data()
    uvicorn.run('app.api:app', host='0.0.0.0', port=8000, reload=True)
