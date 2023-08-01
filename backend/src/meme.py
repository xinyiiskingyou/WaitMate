import os
import shutil
import requests
import random
import smtplib
import textwrap
import re
import dns.resolver
import socket
from email.mime.text import MIMEText
from typing import Any, List
from sqlalchemy import MetaData, Table, create_engine, select, desc
from sqlalchemy.orm import sessionmaker
from constant import DB_PATH
from src.db_model import Memes, Votes
from src.error import InputError, NotFoundError
from src.helper import check_coupon_valid

class MemeDB():

    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)

        # create memes table
        Memes.__table__.create(bind=self.engine, checkfirst=True)
        Votes.__table__.create(bind=self.engine, checkfirst=True)

        session_maker = sessionmaker(bind=self.engine)
        self.session = session_maker()

    def upload_meme(self, img_url: str, filename: str = None):
        
        if filename:
            existing_meme = self.session.query(Memes).filter(Memes.filename.ilike(f'%{filename}%')).first()
            if existing_meme:
                raise InputError(detail="Meme with the same filename already exists")

        try:
            upload_dir = "./images"
            os.makedirs(upload_dir, exist_ok=True)

            response = requests.get(img_url, stream=True)
            if response.status_code != 200:
                raise InputError(detail="Image url is not valid")
        
            img_name = filename if filename else img_url.split("/")[-1]
    
            if any(img_name.lower().endswith(ext) for ext in ('.jpg', '.jpeg', '.png')):
                image_path = f"{upload_dir}/{img_name}"
            else:
                image_path = f"{upload_dir}/{img_name}.png"

            # save a copy of image to local dir
            with open(image_path, "wb") as image_file:
                shutil.copyfileobj(response.raw, image_file)

            # add memes to table
            new_meme = Memes(filename=image_path, count=0, url=img_url)
            self.session.add(new_meme)
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def view_all_memes(self) -> List[Any]:

        try:
            statement = select(Memes.id, Memes.filename, Memes.count, Memes.url)
            rows = self.session.execute(statement).all()

            return [tuple(row) for row in rows]
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def like_a_meme(self, email: str, filename: str) -> None:

        if not self._check_valid_email(email):
            raise InputError("Email is not valid.")

        meme = self.session.query(Memes).filter(Memes.filename.ilike(f'%{filename}%')).first()
        if not meme:
            raise NotFoundError("Image not found.")

        existing_vote = self.session.query(Votes).filter(Votes.email == email).first()
        if existing_vote:
            raise InputError(detail="Each email can only vote once.")

        try:
            meme.count += 1
            self.session.commit()
            
            new_vote = Votes(filename=meme.filename, email=email)
            self.session.add(new_vote)
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def get_emails_by_highest_vote(self) -> List[Any]:
        meme = self.session.query(Memes).order_by(desc(Memes.count)).first()

        votes = self.session.query(Votes).filter(Votes.filename==meme.filename).all()
        emails = [vote.email for vote in votes]

        emails = random.sample(emails, min(5, len(emails)))
        
        return emails
        
    def send_coupons_by_votes(self, coupon_code: str) -> None:
        if not check_coupon_valid(coupon_code, self.session):
            raise InputError(detail='Invalid coupon.')

        try:
            emails = self.get_emails_by_highest_vote()

            # Email content
            subject = 'Coupon Code for You!'
            body = textwrap.dedent(f'''
                Hi there!
                
                Thank you for voting. Here is your coupon code: \b{coupon_code}
                
                Use it for a discount on your next visit!
                
                Best regards,
                Team WaitMate
            ''')

            sender = 'waitmate23@gmail.com'
            for email in emails:
                msg = MIMEText(body)
                msg['Subject'] = subject
                msg['From'] = sender
                msg['To'] = email

                # Connect to the SMTP server and send the email
                with smtplib.SMTP('smtp.gmail.com', 587) as server:
                    server.starttls()
                    server.login(sender, 'rhczgnokozlpecqa')
                    server.sendmail(sender, email, msg.as_string())
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            server.close()
            self.session.close()

    def clear_data(self):
        metadata = MetaData()
        vote_table = Table('Votes', metadata, autoload_with=self.engine)
        memes_table = Table('Memes', metadata, autoload_with=self.engine)

        with self.engine.begin() as conn:
            delete_query = vote_table.delete()
            conn.execute(delete_query)

            delete_query = memes_table.delete()
            conn.execute(delete_query)

        for filename in os.listdir("./images"):
            file_path = os.path.join("./images", filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

    def _check_valid_email(self, email: str) -> bool:
        
        # Address used for SMTP MAIL FROM command.
        sender = 'test@example.com'

        # Simple Regex for syntax checking
        search = r'\b^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$\b'
        if not re.search(search, email):
            raise InputError(detail='This email is of invalid form')

        # Get domain for DNS lookup
        address = email.split('@')
        domain = str(address[1])

        server = None
        try:
            # MX record lookup
            records = dns.resolver.resolve(domain, 'MX')
            mx_record = records[0].exchange
            mx_record = str(mx_record)
            
            host = socket.gethostname()
            server = smtplib.SMTP()
            server.set_debuglevel(0)

            server.connect(mx_record)
            server.helo(host)
            server.mail(sender)
            code, _ = server.rcpt(str(email))
            return code == 250
        except Exception as err:
            raise InputError(detail='Error: '+ str(err)) from err
        finally:
            if server:
                server.quit()
