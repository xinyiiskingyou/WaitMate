import os
import shutil
from sqlalchemy import MetaData, Table, create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import File, UploadFile
from constant import DB_PATH
from src.db_model import Memes
from src.error import InputError

class Meme():
    
    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)

        # create memes table
        Memes.__table__.create(bind=self.engine, checkfirst=True)

        session_maker = sessionmaker(bind=self.engine)
        self.session = session_maker()
    
    def upload_meme(self, img_url: str = None, img: UploadFile = File(None)):
        
        try:
            upload_directory = "uploaded_images"
            os.makedirs(upload_directory, exist_ok=True)

            # if image_url:  # If an image URL is provided, download and save the image
            #     response = requests.get(image_url, stream=True)
            #     if response.status_code != 200:
            #         raise HTTPException(status_code=400, detail="Failed to download image")

            #     image_extension = image_url.split(".")[-1]
            #     image_path = f"{upload_directory}/image.{image_extension}"
            #     with open(image_path, "wb") as image_file:
            #         shutil.copyfileobj(response.raw, image_file)
            # else:  # If no URL is provided, save the uploaded image from local directory
            #     save_uploaded_image(image, upload_directory)

            # return {"message": "Image uploaded successfully"}
        except Exception as e:
            raise InputError(detail=str(e))

    
    def view_all_memes(self):
        pass
    
    def like_a_meme(self):
        pass
    
    def check_votes(self):
        pass
    
    def send_coupons_by_votes(self):
        pass