'''
The `auth` module provides functionalites for authentication and authorisation related features.

These features includes login and tokenised access, as well as user
management for the manager
'''
import re
import firebase
from firebase_admin import auth as fb_auth, credentials, initialize_app
from src.error import InputError, AccessError

WAITSTAFF_EMAIL = 'waitstaff@waitmate.com'
KITCHENSTAFF_EMAIL = 'kitchenstaff@waitmate.com'

class Auth:
    WAITSTAFF_EMAIL = 'waitstaff@waitmate.com'
    KITCHENSTAFF_EMAIL = 'kitchenstaff@waitmate.com'
    MANAGER_EMAIL= 'manager@waitmate.com'
    PASSWORD = 'waitmate1'
    EMAIL_CHECK = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

    def __init__(self):
        cred = credentials.Certificate("./firebase/waitmate-ba463-firebase-adminsdk-ea5im-72b77a7f6f.json")
        self.fb = initialize_app(cred)
        firebase_config = {
            'apiKey': 'AIzaSyDNdgqTGOb5nrj1-0EMr4bNcoaGpcpxk98',
            'authDomain': 'waitmate-ba463.firebaseapp.com',
            'projectId': 'waitmate-ba463',
            'storageBucket': 'waitmate-ba463.appspot.com',
            'messagingSenderId': '631290161826',
            'appId': '1:631290161826:web:95fdcaa4ffc306a33745fb',
            'measurementId': 'G-NR03X95M2H',
            'databaseURL': ''
        }
        firebase_app = firebase.initialize_app(firebase_config)
        self.auth = firebase_app.auth()

    def create_restaurant(self):
        user = fb_auth.create_user(
            email='manager@waitmate.com',
            email_verified=False,
            password=self.PASSWORD,
            display_name='Manager',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'manager'})

        user = fb_auth.create_user(
            email=self.WAITSTAFF_EMAIL,
            email_verified=False,
            password=self.PASSWORD,
            display_name='Waitstaff',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'waitstaff'})

        user = fb_auth.create_user(
            email=self.KITCHENSTAFF_EMAIL,
            email_verified=False,
            password=self.PASSWORD,
            display_name='Kitchenstaff',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'kitchenstaff'})

    def login_mananger(self, email: str, password: str):
        if not email or not password:
            raise InputError(detail='Enter your email and password')
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)
            return {'token': user['idToken']}
        except:
            raise AccessError(detail='Invalid email or password')

    def login_staff(self, password: str, is_waitstaff: bool):
        if not password:
            raise InputError(detail='Enter your password')

        email: str = WAITSTAFF_EMAIL if is_waitstaff else KITCHENSTAFF_EMAIL
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)

            return {'token': user['idToken']}
        except:
            raise AccessError(detail='Invalid password')

    def is_authenticated(self, token: str):
        try:
            user = fb_auth.verify_id_token(token)
            return user
        except:
            raise AccessError(detail='Authentication failed')

    def is_authorized(self, roles: list, user: dict):
        if not user['hasRole'] in roles:
            raise AccessError(detail=f"{user['hasRole']} is not authorized")

    def change_password_mananger(self, user: dict):
        self.auth.send_password_reset_email(user['user']['email'])

    def change_email_mananger(self, user: dict, new_email: str):
        if not re.search(self.EMAIL_CHECK, new_email):
            raise InputError(detail='Invalid email')

        fb_auth.update_user( user['uid'], email=new_email)

    def change_password_staff(self, new_password: str, is_waitstaff: bool):
        if len(new_password) == 0:
            raise InputError(detail='Invalid password size')

        email: str = WAITSTAFF_EMAIL if is_waitstaff else KITCHENSTAFF_EMAIL

        fb_auth.update_user(
            fb_auth.get_user_by_email(email).uid,
            password=new_password)

    def delete_all(self):
        for user in fb_auth.list_users().iterate_all():
            fb_auth.delete_user(user.uid)
        self.create_restaurant()

auth = Auth()
