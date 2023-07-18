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
        print('Sucessfully created manager: {0}'.format(user.uid))

        user = fb_auth.create_user(
            email=self.WAITSTAFF_EMAIL,
            email_verified=False,
            password=self.PASSWORD,
            display_name='Waitstaff',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'waitstaff'})
        print('Sucessfully created waitstaff: {0}'.format(user.uid))

        user = fb_auth.create_user(
            email=self.KITCHENSTAFF_EMAIL,
            email_verified=False,
            password=self.PASSWORD,
            display_name='Kitchenstaff',
            disabled=False)
        fb_auth.set_custom_user_claims(user.uid, {'hasRole': 'kitchenstaff'})
        print('Sucessfully created kitchenstaff: {0}'.format(user.uid))

    def create_customer(self):
        #TODO
        self.auth.sign_in_anonymous()

    def login_mananger(self, email: str, password: str):
        if not email or not password:
            raise InputError('Enter your email and password')
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)
            print('Successfully logged in: manager')

            return {'token': user['idToken']}
        except:
            raise AccessError('Invalid email or password')
        
    def login_staff(self, password: str, is_waitstaff: bool):
        if not password:
            raise InputError('Enter your password')
        
        email: str = WAITSTAFF_EMAIL if is_waitstaff else KITCHENSTAFF_EMAIL
        print(email)
        try:
            user = self.auth.sign_in_with_email_and_password(email, password)
            print('Successfully logged in: waitstaff')

            return {'token': user['idToken']}
        except:
            raise AccessError('Invalid password')

    def is_authenticated(self, token: str):
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
        print(user)
        self.auth.send_password_reset_email(user['user']['email'])
        print('Sucessfully updated manager password')

    def change_email_mananger(self, user: dict, new_email: str):
        if not re.search(self.EMAIL_CHECK, new_email):
            raise InputError('Invalid email')

        print(user['uid'], new_email)
        fb_auth.update_user( user['uid'], email=new_email)
        
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
            fb_auth.delete_user(user.uid)
        self.create_restaurant()

    def print_all(self):
        print("Printing users:")

        for user in fb_auth.list_users().iterate_all():
            print('User: ' + user.uid + ' ' + user.email)


auth = Auth()

if __name__ == '__main__':  
    auth_system = Auth()
    token = auth_system.login_mananger('manager@waitmate.com', 'waitmate1')['token']
    auth_user = auth_system.is_authenticated(token)
    auth_system.is_authorized(['manager'], auth_user)
