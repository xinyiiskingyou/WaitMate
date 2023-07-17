from sqlalchemy import create_engine, Table, MetaData, select, update, delete
from sqlalchemy.orm import sessionmaker
from constant import TEST_PATH
from src.db_model import Categories, Items, Menu
from src.error import InputError, AccessError
from src.helper import (
    check_category_exists, check_item_exists, get_item_order_in_category,
    check_categories_key_is_valid, get_item_in_category
)

class Menu_db():
    def __init__(self) -> None:
        self.engine = create_engine(TEST_PATH)

        # create categories, items and menu tables
        Categories.__table__.create(bind=self.engine, checkfirst=True)
        Items.__table__.create(bind=self.engine, checkfirst=True)
        Menu.__table__.create(bind=self.engine, checkfirst=True)

        Session = sessionmaker(bind=self.engine)
        self.session = Session()
    
    def category_add(self, name: str) -> None:

        if len(name) < 1 or len(name) > 15:
            raise InputError('Invalid name length')
        
        if check_category_exists(name.lower(), self.session):
            raise InputError('Name already used')

        new_cat = Categories(name=name)
        self.session.add(new_cat)
        self.session.commit()
        
        new_cat.cat_order = new_cat.cat_id
        self.session.commit()
        
        menu_cat = Menu(category=name, item=None, item_order=0)
        self.session.add(menu_cat)

        self.session.close()
    
    def item_add(self, item_data: dict) -> None:

        try:
            category = item_data['category']
            name = item_data['name']
            cost = item_data['cost']
            description = item_data['description']
            ingredients = item_data['ingredients']
            is_vegan = item_data['is_vegan']
        except KeyError as err:
            raise InputError(f"Missing field in item_data: {err.args[0]}")

        if not check_category_exists(category.lower(), self.session):
            raise InputError('Invalid category')

        if len(name) < 1 or len(name) > 15:
            raise InputError('Invalid name length')
        
        if check_item_exists(name.lower(), self.session):
            raise AccessError('Name already used')

        new_item = Items(
            name=name,
            cost=cost,
            description=description,
            ingredients=ingredients,
            is_vegan=is_vegan,
            category_name=category
        )
        self.session.add(new_item)
        self.session.commit()

        order = get_item_order_in_category(category, self.session) + 1

        stmt = (
            update(Items)
            .where(Items.name == name)
            .values(item_order = order)
        ) 
        self.session.execute(stmt)
        self.session.commit()

        menu_item = Menu(category=category, item=name, item_order=order)
        self.session.add(menu_item)

        self.session.close()

    def get_all_categories(self) -> dict:

        query = select(Categories.cat_order, Categories.name).order_by(Categories.cat_order)
        results = self.session.execute(query).fetchall()

        self.session.close()

        categories_dict = {cat_order: name for cat_order, name in results}
        return categories_dict

    def get_items_in_category(self, category_id: str) -> list:

        res = check_categories_key_is_valid('cat_order', int(category_id), self.session)
        if not res:
            raise InputError('Invalid category ID')

        category_name = res.name
        
        results = self.session.query(Items)\
            .filter(Items.category_name == category_name)\
            .order_by(Items.item_order)\
            .all()

        items = []
        columns = ['name', 'cost', 'description', 'ingredients', 'is_vegan']
        for data in results:
            item_dict = {column: getattr(data, column) for column in columns}
            items.append(item_dict)

        # Close the session if necessary
        self.session.close()

        return items

    def update_details_menu_items(self, category_name: str, index: int, **kwargs) -> None:

        if not check_categories_key_is_valid('name', category_name, self.session):
            raise InputError('Invalid category')

        result = get_item_in_category(index, category_name, self.session)

        if not result:
            raise InputError('Invalid ID')

        old_name = result[0]
        new_name = kwargs.get('name')
        if new_name is not None:
            # invalid name length
            if len(new_name) < 1 or len(new_name) > 15:
                raise InputError('Invalid name length')
            if check_item_exists(new_name, self.session) and old_name.lower() != new_name.lower():
                raise InputError('Name already used')

            stmt = (
                update(Menu)
                .where(Menu.item_order == index)
                .where(Menu.category == category_name)
                .values(item = new_name)
            ) 
            self.session.execute(stmt)
            self.session.commit()

            update_query = (
                update(Items)
                .where(Items.item_order == index)
                .where(Items.category_name == category_name)
                .values(
                    name=kwargs.get('name') or Items.name,
                    cost=kwargs.get('cost') or Items.cost,
                    description=kwargs.get('description') or Items.description,
                    ingredients=kwargs.get('ingredients') or Items.ingredients,
                    is_vegan=kwargs.get('is_vegan') or Items.is_vegan
                )
            )
            self.session.execute(update_query)
            self.session.commit()

    def update_details_category(self, old_name: str, new_name: str) -> None:

        if old_name.lower() == new_name.lower():
            return
        # length is not between 1 to 15
        if len(new_name) < 1 or len(new_name) > 15:
            raise InputError('Invalid name length')
        # old category name not exists
        if not check_category_exists(old_name.lower()):
            raise InputError('Name not found')
        # new category name exists
        if old_name != new_name and check_category_exists(new_name.lower()):
            raise InputError('Name already used')

        stmt = (
            update(Categories)
            .where(Categories.name == old_name)
            .values(name = new_name)
        ) 
        self.session.execute(stmt)
        self.session.commit()

        stmt = (
            update(Menu)
            .where(Menu.category == old_name)
            .values(category = new_name)
        ) 
        self.session.execute(stmt)
        self.session.commit()

    def remove_menu_items(self, item_name: str) -> None:

        if not check_item_exists(item_name.lower(), self.session):
            raise InputError('Invalid name')
        
        self.session.execute(delete(Items).where(Items.name==item_name))
        self.session.commit()

        self.session.execute(delete(Menu).where(Menu.item==item_name))
        self.session.commit()

        self.session.close()

