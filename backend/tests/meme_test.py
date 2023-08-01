import pytest
from src.error import InputError, NotFoundError
from tests.conftest import VALID, INPUTERROR, NOTFOUNDERROR
from src.meme import MemeDB
from src.checkout import CheckoutDB

meme = MemeDB()
checkout = CheckoutDB()

def test_upload_meme_invalid_url():

    with pytest.raises(InputError):
        meme.upload_meme('https://fakeIMG')
    with pytest.raises(InputError):
        meme.upload_meme('invalidlink')

def test_upload_meme_valid():
    meme.clear_data()
    meme.upload_meme('https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')
        
    meme.upload_meme('https://qph.cf2.quoracdn.net/main-qimg-935d575fe3e6983924fbc3ce0100c4dc.webp', filename='nono.png')
    res = meme.view_all_memes()

    assert len(res) == 2
    assert res[1][1] == './images/nono.png'
    
def test_upload_meme_invalid_filename():
    with pytest.raises(InputError):
        meme.upload_meme('https://qph.cf2.quoracdn.net/main-qimg-935d575fe3e6983924fbc3ce0100c4dc.webp', filename='nono.png')
    
def test_like_meme_invalid_email():
    with pytest.raises(InputError):
        meme.like_a_meme('123456', './images/nono.png')
    with pytest.raises(InputError):
        meme.like_a_meme('123456@notexist.unsw.com', './images/nono.png')    
    
def test_like_meme_invalid_image():
    with pytest.raises(NotFoundError):
        meme.like_a_meme('waitmate23@gmail.com', 'notExist.jpg')
    with pytest.raises(NotFoundError):
        meme.like_a_meme('waitmate23@gmail.com', ' ')
    with pytest.raises(NotFoundError):
        meme.like_a_meme('waitmate23@gmail.com', '_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.txt')
        
def test_like_meme_invalid_vote():
    meme.clear_data()
    meme.upload_meme('https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg', filename='frog.png')

    meme.like_a_meme('waitmate23@gmail.com', 'frog.png')
    
    with pytest.raises(InputError):
        meme.like_a_meme('waitmate23@gmail.com', 'frog.png')

def test_get_emails_valid():
    assert len(meme.get_emails_by_highest_vote()) == 1

def test_send_coupons_invalid_code():
    with pytest.raises(InputError):
        meme.send_coupons_by_votes('notexist')
    with pytest.raises(InputError):
        meme.send_coupons_by_votes('')

def test_send_coupon_valid():
    checkout.clear_data()
    checkout.checkout_coupon_create('MEMES', 5, '20/10/2023')
    meme.send_coupons_by_votes('MEMES')
    
    assert True

#####################################
######### endpoint tests ############
#####################################

def test_upload_meme_endpoint(client, manager_token):

    meme.clear_data()
    # valid case
    resp = client.post("/meme/upload", 
        json={
            "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrN-gYs0DEy8SJWL5KvUmPSFxrX11ux7fDQ&usqp=CAU"
        },
        headers=manager_token
    ) 
    assert resp.status_code == VALID

    resp = client.post("/meme/upload", 
        json={
            "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrN-gYs0DEy8SJWL5KvUmPSFxrX11ux7fDQ&usqp=CAU",
            "filename": 'meme1.png'
        },
        headers=manager_token
    ) 
    assert resp.status_code == VALID
    
    # invalid url
    resp = client.post("/meme/upload", 
        json={
            "url": "https://abcdefo"
        },
        headers=manager_token
    ) 
    assert resp.status_code == INPUTERROR
    
    # invalid name
    resp = client.post("/meme/upload", 
        json={
            "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrN-gYs0DEy8SJWL5KvUmPSFxrX11ux7fDQ&usqp=CAU",
            "filename": 'meme1.png'
        },
        headers=manager_token
    ) 
    assert resp.status_code == INPUTERROR
    
def test_view_all_memes_endpoint(client):
    
    resp = client.get('/meme/listall')
    assert resp.status_code == VALID

def test_like_a_meme_endpoint(client):
    # valid
    resp = client.post("/meme/like", 
        json={
            "email": "waitmate23@gmail.com",
            "filename": 'meme1.png'
        }
    )
    assert resp.status_code == VALID
    
    # invalid email
    resp = client.post("/meme/like", 
        json={
            "email": "123456@notexist.unsw.com",
            "filename": 'meme1.png'
        }
    ) 
    assert resp.status_code == INPUTERROR

    # invalid image
    resp = client.post("/meme/like", 
        json={
            "email": "waitmate23@gmail.com",
            "filename": 'meme1.jpg'
        }
    ) 
    assert resp.status_code == NOTFOUNDERROR
    
    # invalid vote from the same email
    resp = client.post("/meme/like", 
        json={
            "email": "waitmate23@gmail.com",
            "filename": 'meme1.png'
        }
    )
    assert resp.status_code == INPUTERROR
    
def test_get_emails_endpoint(client, manager_token):
    resp = client.get('/meme/listall/emails', headers=manager_token)
    assert resp.status_code == VALID
    
def test_send_email_endpoint(client, manager_token):

    # valid
    resp = client.post("/meme/send/emails", json={"code": "MEMES"}, headers=manager_token)
    assert resp.status_code == VALID
    
    # invalid coupon
    resp = client.post("/meme/send/emails", json={"code": "MEMES1123"}, headers=manager_token)
    assert resp.status_code == INPUTERROR
