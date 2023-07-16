# import pyrebase
import json
import firebase
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from firebase_admin import auth as fb_auth, credentials, initialize_app
from src.error import InputError, AccessError


WAITSTAFF_EMAIL = 'waitstaff@waitmate.com'
KITCHENSTAFF_EMAIL = 'kitchenstaff@waitmate.com'


class Auth:
    WAITSTAFF_EMAIL = 'waitstaff@waitmate.com'
    KITCHENSTAFF_EMAIL = 'kitchenstaff@waitmate.com'
    MANAGER_EMAIL= 'manager@waitmate.com'
    PASSWORD = 'waitmate1'

    def __init__(self):
        cred = credentials.Certificate("./src/waitmate-ba463-firebase-adminsdk-ea5im-72b77a7f6f.json")
        self.fb = initialize_app(cred)
        firebaseConfig = { 
            'apiKey': 'AIzaSyDNdgqTGOb5nrj1-0EMr4bNcoaGpcpxk98',
            'authDomain': 'waitmate-ba463.firebaseapp.com',
            'projectId': 'waitmate-ba463',
            'storageBucket': 'waitmate-ba463.appspot.com',
            'messagingSenderId': '631290161826',
            'appId': '1:631290161826:web:95fdcaa4ffc306a33745fb',
            'measurementId': 'G-NR03X95M2H',
            'databaseURL': ''
        }
        pb = firebase.initialize_app(firebaseConfig)
        self.auth = pb.auth()

    def create_restaurant(self):
        user = fb_auth.create_user(
            email='manager@waitmate.com',
            email_verified=False,
            password='waitmate1',
            display_name='Manager',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'manager'})
        print('Sucessfully created manager: {0}'.format(user.uid))

        user = fb_auth.create_user(
            email=self.WAITSTAFF_EMAIL,
            email_verified=False,
            password='waitmate1',
            display_name='Waitstaff',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'waitstaff'})
        print('Sucessfully created waitstaff: {0}'.format(user.uid))

        user = fb_auth.create_user(
            email=self.KITCHENSTAFF_EMAIL,
            email_verified=False,
            password='waitmate1',
            display_name='Kitchenstaff',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'kitchenstaff'})
        print('Sucessfully created kitchenstaff: {0}'.format(user.uid))

    def create_customer(self):
        self.auth.sign_in_anonymous()

    def login_mananger(self, email: str, password: str):
        if not email or not password:
            raise AccessError('Enter your email and password')
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)            
            print('Successfully logged in: manager')    

            return {'token': user['idToken']}
        except:
            raise AccessError('Invalid email or password')
        
    def logout(self, token):
        pass

    def login_staff(self, password: str, is_waitstaff: bool):
        if not password:
            raise AccessError('Enter your password')
        
        email: str = WAITSTAFF_EMAIL if is_waitstaff else KITCHENSTAFF_EMAIL
        print(email)
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)            
            print('Successfully logged in: waitstaff')    

            return {'token': user['idToken']}
        except:
            raise AccessError('Invalid password')

    def is_authenticated(self, token):
        print(token)

        try:
            user = fb_auth.verify_id_token(token)
            print('User is authenticated')
            return user
        except:
            raise AccessError('Authentication failed')

    
    def is_authorized(self, roles: list, user: dict):
        print(user)
        if not user['hasRole'] in roles:
            raise AccessError(f"{user['hasRole']} is not authorized")
        print('User is authorized')

    def change_password_mananger(self, user: dict):
        # if len(new_password) == 0:
        #     raise InputError('Invalid password size')
        
        print(user)
        self.auth.send_password_reset_email(user['user']['email'])

        # auth.update_user(
        #     uid,
        #     password=new_password)

        print('Sucessfully updated manager password')

    def send_password_reset_email(self, email: str):
        msg = MIMEMultipart()  # instance of MIMEMultipart
        msg['From'] = 'waitmatebycc@gmail.com'
        msg['To'] = email
        msg["Subject"] = "Hello from Python!"

        session = smtplib.SMTP('smtp.gmail.com', 587)
        session.starttls()
        session.login('waitmatebycc@gmail.com', 'waitmate1')
        session.sendmail(
                'waitmatebycc@gmail.com', email, msg.as_string()
            )
        # html = """\
        # <html>
        # <body>
        #     <p>Hello,<br> I'm sending you a test email because I'm learning how to send email with Python!
        #     </p>
        # </body>
        # </html>
        # """        
        # part2 = MIMEText(html, "html")
        # msg.attach(part2)

        # context = ssl.create_default_context()
        # with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        #     server.login('waitmatebycc@gmail.com', 'waitmate1')
        #     server.sendmail(
        #         'waitmatebycc@gmail', email, msg.as_string()
        #     )

    def change_email_mananger(self, user: dict, token: str, new_email: str):
        if len(new_email) == 0:
            raise InputError('Invalid email size')

        print(user['uid'], new_email)
        new_user = fb_auth.update_user(
            user['uid'],
            email=new_email)
        
        sender = 'waitmatebycc@gmail.com'
        receivers = [new_email]
        message = """Hey,
        Thank you for using our system, you have recently
        changed your email address and this is an email to
        confirm your changes.
        """
        # self.send_password_reset_email(new_email)
        # self.auth.send_email_verification(token)

        print("Successfully sent email")
        # except:
        #     raise AccessError('Failed to send verification email')

        # self.auth.send_email_verification(new_user['token'])

        print('Sucessfully updated manager email')

    def change_password_staff(self, new_password: str, is_waitstaff: bool):
        if len(new_password) == 0:
            raise InputError('Invalid password size')
        
        email: str = WAITSTAFF_EMAIL if is_waitstaff else KITCHENSTAFF_EMAIL
        print(fb_auth.get_user_by_email(email).uid)
        fb_auth.update_user(
            fb_auth.get_user_by_email(email).uid,
            password=new_password)
        print('Sucessfully updated staff password')

    def delete_all(self):
        for user in fb_auth.list_users().iterate_all():
            result = fb_auth.delete_user(user.uid)

            # if result.errors:
            #     return 
            # for _ in result.errors:
            #     print('error #{0}, reason: {1}'.format(result.index, result.reason))

        self.create_restaurant()

    def print_all(self):
        print("Printing users:")

        for user in fb_auth.list_users().iterate_all():
            print('User: ' + user.uid + ' ' + user.email)    


auth = Auth()

if __name__ == '__main__':  
    auth_system = Auth()

    # Iterate through all users. This will still retrieve users in batches,
    # buffering no more than 1000 users in memory at a time.
    # auth_system.print_all()

    token = auth_system.login_mananger('manager@waitmate.com', 'waitmate1')['token']
    auth_user = auth_system.is_authenticated(token)
    auth_system.is_authorized(['manager'], auth_user)

    # auth_system.delete_all()

    # auth_system.create_restaurant()