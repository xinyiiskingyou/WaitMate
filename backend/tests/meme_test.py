import os
import pytest
import tempfile
from src.error import InputError, NotFoundError
from tests.conftest import VALID, INPUTERROR, ACCESSERROR
from src.meme import MemeDB
from src.checkout import CheckoutDB

meme = MemeDB()
checkout = CheckoutDB()

def test_upload_meme_invalid_url():

    with pytest.raises(InputError):
        meme.upload_meme('https://fakeIMG')
    with pytest.raises(InputError):
        meme.upload_meme('')

def test_upload_meme_valid():
    meme.clear_data()
    meme.upload_meme('https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')
        
    meme.upload_meme('https://qph.cf2.quoracdn.net/main-qimg-935d575fe3e6983924fbc3ce0100c4dc.webp')
    assert len(meme.view_all_memes()) == 2

def test_like_meme_invalid_email():
    with pytest.raises(InputError):
        meme.like_a_meme('123456', '_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')
    with pytest.raises(InputError):
        meme.like_a_meme('123456@notexist.unsw.com', '_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')    
    
def test_like_meme_invalid_image():
    with pytest.raises(NotFoundError):
        meme.like_a_meme('waitmate23@gmail.com', 'notExist.jpg')
    with pytest.raises(NotFoundError):
        meme.like_a_meme('waitmate23@gmail.com', ' ')
    with pytest.raises(NotFoundError):
        meme.like_a_meme('waitmate23@gmail.com', '_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.txt')
        
def test_like_meme_invalid_vote():
    meme.clear_data()
    meme.upload_meme('https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')

    meme.like_a_meme('waitmate23@gmail.com', '_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')
    
    with pytest.raises(InputError):
        meme.like_a_meme('waitmate23@gmail.com', '_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg')

def test_get_emails_valid():
    assert len(meme.get_emails_by_highest_vote()) == 1
    
def test_send_coupons_invalid_code():
    with pytest.raises(InputError):
        meme.send_coupons_by_votes('notexist')
    with pytest.raises(InputError):
        meme.send_coupons_by_votes('')

def test_send_coupon_valid():
    checkout.clear_data()
    checkout.checkout_coupon_create('MEMES', 5)
    meme.send_coupons_by_votes('MEMES')
    
    assert True

######################################
########## endpoint tests ############
######################################

# def test_upload_meme_endpoint():
    