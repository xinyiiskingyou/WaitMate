import pytest
from backend.src.menu import menu_view, category_add, item_add

class TestMenu:
    def test_add_item():
        item_add("Yms", "Jam", 5, "strawberry")