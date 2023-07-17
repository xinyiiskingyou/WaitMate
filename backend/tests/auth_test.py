import os
import pytest
from src.error import AccessError, InputError
from src.auth import auth
from tests.conftest import VALID, ACCESSERROR, INPUTERROR

# add a restet here
def test_auth_invalid_token(restart_auth):
    with pytest.raises(AccessError) as error:
        auth.is_authenticated('')
    assert str(error.value) == 'Authentication failed'
    
def test_auth_invalid_login_manager():
    with pytest.raises(InputError) as error:
        auth.login_mananger('', auth.MANAGER_EMAIL)
    assert str(error.value) == 'Enter your email and password'

    with pytest.raises(InputError) as error:
        auth.login_mananger(auth.PASSWORD, '')
    assert str(error.value) == 'Enter your email and password'

    with pytest.raises(AccessError) as error:
        auth.login_mananger(auth.PASSWORD + ':)', auth.MANAGER_EMAIL)
    assert str(error.value) == 'Invalid email or password'

def test_auth_invalid_login_staff():
    with pytest.raises(InputError) as error:
        auth.login_staff('', True)
    assert str(error.value) == 'Enter your password'

    with pytest.raises(InputError) as error:
        auth.login_staff('', False)
    assert str(error.value) == 'Enter your password'

    with pytest.raises(AccessError) as error:
        auth.login_staff(auth.PASSWORD + ':)', False)
    assert str(error.value) == 'Invalid password'

def test_auth_not_authorised(waitstaff_token_plain):
    waitstaff: dict = auth.is_authenticated(waitstaff_token_plain)
    with pytest.raises(AccessError) as error:
        auth.is_authorized(['manager'], waitstaff)
    assert str(error.value) == 'waitstaff is not authorized'

def test_auth_invalid_email():
    with pytest.raises(InputError) as error:
        auth.change_email_mananger({}, '')
    assert str(error.value) == 'Invalid email'

def test_auth_invalid_password_staff():
    with pytest.raises(InputError) as error:
        auth.change_password_staff('', True)
    assert str(error.value) == 'Invalid password size'

def test_login_manager():
    token = auth.login_mananger(auth.MANAGER_EMAIL, auth.PASSWORD)
    assert token['token']

def test_login_waitstaff():
    token = auth.login_staff(auth.PASSWORD, True)
    assert token['token']

def test_login_kitchenstaff():
    token = auth.login_staff(auth.PASSWORD, False)
    assert token['token']

def test_authenticate_token(manager_token_plain):
    user = auth.is_authenticated(manager_token_plain)
    assert user != {}

def test_authorised_token(manager_token_plain):
    auth.is_authorized(['manager'], auth.is_authenticated(manager_token_plain))

def test_change_email_mananger(manager_token_plain):
    user = auth.is_authenticated(manager_token_plain)
    auth.change_email_mananger(user, 'waitmatebycc@gmail.com')
    token = auth.login_mananger(auth.WAITSTAFF_EMAIL, auth.PASSWORD)
    assert token['token'] != ''

def test_change_password_staff():
    auth.change_password_staff('HappyPot', True)
    token = auth.login_staff('HappyPot', True)

    assert token['token'] != ''

######################################
########## endpoint tests ############
######################################

def test_auth_user_endpoint(restart_auth, client, waitstaff_token):
    resp = client.post('/auth/user', json={'stafftype': ['manager']},
        headers=waitstaff_token)
    assert resp.status_code == ACCESSERROR

    resp = client.post('/auth/user', json={'stafftype': ['waitstaff']},
        headers=waitstaff_token)
    assert resp.status_code == VALID

def test_staff_login(client):
    resp = client.post('/auth/kitchenstaff/login', json={'password': ':L'})
    assert resp.status_code == ACCESSERROR

    resp = client.post('/auth/kitchenstaff/login', json={'password': auth.PASSWORD})
    assert resp.status_code == VALID

    resp = client.post('/auth/waitstaff/login', json={'password': auth.PASSWORD})
    assert resp.status_code == VALID

def test_auth_update_password_endpoint(client, manager_token, waitstaff_token):
    resp = client.post('/auth/manager/update/password',
        headers=waitstaff_token)
    assert resp.status_code == ACCESSERROR

    resp = client.post('/auth/manager/update/password',
        headers=manager_token)
    assert resp.status_code == VALID

def test_auth_update_email_endpoint(client, manager_token):
    resp = client.post('/auth/manager/update/email', json={'email': 'hi'}, 
        headers=manager_token)
    assert resp.status_code == INPUTERROR

    resp = client.post('/auth/manager/update/email', json={'email': 'waitmatebycc@gmail.com'}, 
        headers=manager_token)
    assert resp.status_code == VALID

    