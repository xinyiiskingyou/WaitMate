# import pyrebase
import json
import firebase

from firebase_admin import auth, credentials, initialize_app
from src.error import InputError, AccessError


WAITSTAFF_EMAIL = 'waitstaff@waitmate.com'
KITCHENSTAFF_EMAIL = 'kitchenstaff@waitmate.com'


class Auth:
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
        user = auth.create_user(
            email='manager@waitmate.com',
            email_verified=False,
            password='waitmate1',
            display_name='Manager',
            disabled=False)
        auth.set_custom_user_claims(user.uid, {'hasRole': 'manager'})
        print('Sucessfully created manager: {0}'.format(user.uid))

        user = auth.create_user(
            email=WAITSTAFF_EMAIL,
            email_verified=False,
            password='waitmate1',
            display_name='Waitstaff',
            disabled=False)
        auth.set_custom_user_claims(user.uid, {'hasRole': 'waitstaff'})
        print('Sucessfully created waitstaff: {0}'.format(user.uid))

        user = auth.create_user(
            email=KITCHENSTAFF_EMAIL,
            email_verified=False,
            password='waitmate1',
            display_name='Kitchenstaff',
            disabled=False)
        auth.set_custom_user_claims(user.uid, {'hasRole': 'kitchenstaff'})
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
        try:
            user = auth.verify_id_token(token)
            print('User is authenticated')
            return user
        except:
            raise AccessError('Authentication failed')

    
    def is_authorized(self, roles: list, user: dict):
        if not user['hasRole'] in roles:
            raise AccessError(f"{user['hasRole']} is not authorized")
        print('User is authorized')

    def change_password_mananger(self, user: dict, new_password: str):
        if len(new_password) == 0:
            raise InputError('Invalid password size')
        
        print(user)
        self.auth.send_password_reset_email(user['Email'])

        # auth.update_user(
        #     uid,
        #     password=new_password)
        print('Sucessfully updated manager password')

    def change_email_mananger(self, uid: str, new_email: str):
        if len(new_email) == 0:
            raise InputError('Invalid email size')
        user = self.auth.get_account_info()
        auth.send_email_verification(user['idToken'])

        auth.update_user(
            uid,
            email=new_email)
        print('Sucessfully updated manager emai')

    def change_password_staff(self, new_password: str, is_waitstaff: bool):
        if len(new_password) == 0:
            raise InputError('Invalid password size')
        
        email: str = WAITSTAFF_EMAIL if is_waitstaff else KITCHENSTAFF_EMAIL
        auth.update_user(
            'uid',
            password=new_password)
        print('Sucessfully updated staff password')

    def delete_all(self):
        for user in auth.list_users().iterate_all():
            result = auth.delete_user(user.uid)

            # if result.errors:
            #     return 
            # for _ in result.errors:
            #     print('error #{0}, reason: {1}'.format(result.index, result.reason))

        self.create_restaurant()

    def print_all(self):
        print("Printing users:")

        for user in auth.list_users().iterate_all():
            print('User: ' + user.uid + ' ' + user.email)    

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