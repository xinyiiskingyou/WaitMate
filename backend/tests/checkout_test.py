import os
import pytest
from src.error import InputError, AccessError
from src.checkout import Checkout
from tests.conftest import VALID, INPUTERROR, ACCESSERROR

checkout = Checkout()

def checkout_pa():
    if os.path.exists("./src/database/restaurant.db"):
        os.remove("./src/database/restaurant.db")


def test_checkout_invalid_tip():
    pass

def test_checkout_invalid_coupon():
    pass