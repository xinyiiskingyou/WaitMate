import firebase_admin
import json
from firebase_admin import auth, credentials, initialize_app

cred = credentials.Certificate("waitmate-ba463-firebase-adminsdk-ea5im-72b77a7f6f.json")
firebase_admin.initialize_app(cred)

class Auth:
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
            email='waitstaff@waitmate.com',
            email_verified=False,
            password='waitmate1',
            display_name='Waitstaff',
            disabled=False)
        auth.set_custom_user_claims(user.uid, {'hasRole': 'waitstaff'})
        print('Sucessfully created waitstaff: {0}'.format(user.uid))

        user = auth.create_user(
            email='kitchenstaff@waitmate.com',
            email_verified=False,
            password='waitmate1',
            display_name='Kitchenstaff',
            disabled=False)
        auth.set_custom_user_claims(user.uid, {'hasRole': 'kitchenstaff'})
        print('Sucessfully created kitchenstaff: {0}'.format(user.uid))

    def create_mananger():
        pass

    def login_mananger(self, email: str, password: str):
        # result = auth.sig
        pass

    def change_password_mananger(self, uid: str, new_password: str):
        auth.update_user(
            uid,
            password=new_password)
        print('Sucessfully updated manager password')

    def change_email_mananger(self, uid: str, new_email: str):
        auth.update_user(
            uid,
            email=new_email)
        print('Sucessfully updated manager emai')

    def change_password_staff(self):
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
    auth_system.print_all()
    auth_system.delete_all()

    # auth_system.create_user()