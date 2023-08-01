'''
The `menu_db` module provides functionalites for managing the Menu table.

It includes functionality for adding categories and items to the menu,
updating item details and order, retrieving categories and items, and
removing menu items.
'''

from sqlalchemy import MetaData, Table, create_engine, select, update, delete
from sqlalchemy.orm import sessionmaker
from constant import DB_PATH, INVALID_LENGTH_MSG, INVALID_NAME_MSG, INVALID_ORDER_MSG
from src.db_model import Categories, Items
from src.error import InputError, AccessError, NotFoundError
from src.helper import check_category_exists, check_item_exists, check_categories_key_is_valid

class MenuDB:
    '''
    The TableDB class implements operations related to menu.
    '''

    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)

        # create categories and items table
        Categories.__table__.create(bind=self.engine, checkfirst=True)
        Items.__table__.create(bind=self.engine, checkfirst=True)

        session_maker = sessionmaker(bind=self.engine)
        self.session = session_maker()

    def category_add(self, name: str) -> None:
        '''
        Adds a category to the menu.

        Arguments:
            <name> (<str>)  - the name of a new category
        Exceptions:
            InputError  - Occurs when length of name is not between 1 and 15 characters inclusive
                        - Occurs when category name is already existed
        Return Value:
            N/A
        '''

        # check if the name length is valid
        if len(name) < 1 or len(name) > 15:
            raise InputError(detail=INVALID_LENGTH_MSG)

        # check if the name exists
        if check_category_exists(name, self.session):
            raise InputError(detail='Category not exist')

        try:
            # create new category
            new_cat = Categories(name=name)
            self.session.add(new_cat)
            self.session.commit()

            # update order
            new_cat.cat_order = new_cat.cat_id
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def item_add(self, item_data: dict) -> None:
        '''
        Adds an item to the menu.

        Arguments:
            <item_data> (<dict>): A dictionary containing item data including
                              category, name, cost, description, ingredients,
                              and is_vegan.
        Exceptions:
            InputError      - Occurs when a field is missing
                            - Occurs when length of name is not between 1 and 15 characters
                            - Occurs when the category does not exist
            AccessError     - Occurs when item has already existed in the same category
        Return Value:
            None
        '''

        try:
            category = item_data['category']
            name = item_data['name']
            cost = item_data['cost']
            description = item_data['description']
            ingredients = item_data['ingredients']
            is_vegan = item_data['is_vegan']
        except KeyError as err:
            raise InputError(detail=f"Missing field in item_data: {err.args[0]}") from err

        # check if the category exists
        if not check_category_exists(category.lower(), self.session):
            raise InputError(detail='Invalid category')

        # check if the name length is valid
        if len(name) < 1 or len(name) > 15:
            raise InputError(detail=INVALID_LENGTH_MSG)

        # check if the item name exists in the same category
        if check_item_exists(name.lower(), self.session):
            raise AccessError(detail=INVALID_NAME_MSG)

        try:
            # insert new item to the Items table
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

            order = (
                self.session.query(Items)
                .filter(Items.category_name == category, Items.name.isnot(None))
                .count()
            )
            stmt = (
                update(Items)
                .where(Items.name == name)
                .values(item_order = order)
            )
            self.session.execute(stmt)
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def get_all_categories(self) -> dict:
        '''
        Retrieves all the categories in the menu.

        Arguments:
            N/A
        Exceptions:
            N/A
        Return Value:
            Returns <dict> that contains all the categories in order
        '''

        try:
            query = select(Categories.cat_order, Categories.name).order_by(Categories.cat_order)
            results = self.session.execute(query).fetchall()
            return dict(results)
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def get_items_in_category(self, category_id: str) -> list:
        '''
        Retrieves all the items in a category.

        Arguments:
            <category_id> (<str>) - an unqiue id represented a category
        Exceptions:
            N/A
        Return Value:
            Returns <list> that contains all the items
        '''
        
        res = check_categories_key_is_valid('cat_order', int(category_id), self.session)

        # Check if the category ID exists
        if not res:
            raise InputError(detail='Invalid category ID')

        category_name = res.name
        try:
            results = self.session.query(Items)\
                .filter(Items.category_name == category_name)\
                .order_by(Items.item_order)\
                .all()

            items = []
            columns = ['name', 'cost', 'description', 'ingredients', 'is_vegan']
            for data in results:
                item_dict = {column: getattr(data, column) for column in columns}
                items.append(item_dict)
            return items
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def update_details_menu_items(self, category_name: str, index: int, **kwargs) -> None:
        '''
        Updates details of a menu item.

        Arguments:
            <category_name> (<str>) - The name of the category.
            <index>         (<int>) - The index of the menu item in a category.
            <**kwargs>              - Optional keyword arguments for updating the item.

        Exceptions:
            InputError      - Occurs when the category name is invalid
                            - Occurs when the item index is invalid
                            - Occurs when new_name length is invalid
                            - Occurs when the name is already used by another item
        Return Value:
            N/A
        '''

        # check if category name is valid
        if not check_categories_key_is_valid('name', category_name, self.session):
            raise InputError(detail='Invalid category')

        # check if the item is in the category
        result = self._get_item_in_category(index, category_name)
        if not result:
            raise InputError(detail='Invalid ID')

        print(result)
        old_name = result[0]
        new_name = kwargs.get('name')
        if new_name is not None:
            # invalid name length
            if len(new_name) < 1 or len(new_name) > 15:
                raise InputError(detail=INVALID_LENGTH_MSG)
            # item name is used by another item
            if check_item_exists(new_name, self.session) and old_name.lower() != new_name.lower():
                raise InputError(detail=INVALID_NAME_MSG)

        try:
            # update detail in Items table
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
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def update_details_category(self, old_name: str, new_name: str) -> None:
        '''
        Updates details of a category

        Arguments:
            <old_name> (<str>) - The original name of the category.
            <new_name> (<str>) - The name of the category to be updated.

        Exceptions:
            InputError  - Occurs when new_name length is invalid
                        - Occurs when the old category name is invalid
                        - Occurs when new category name already exists
        Return Value:
            N/A
        '''
        # if the name does not change then do nothing
        if old_name.lower() == new_name.lower():
            return
        # length is not between 1 to 15
        if len(new_name) < 1 or len(new_name) > 15:
            raise InputError(detail=INVALID_LENGTH_MSG)
        # old category name not exists
        if not check_category_exists(old_name.lower(), self.session):
            raise InputError(detail='Name not found')
        # new category name exists
        if old_name != new_name and check_category_exists(new_name.lower(), self.session):
            raise InputError(detail=INVALID_NAME_MSG)

        try:
            stmt = (
                update(Categories)
                .where(Categories.name == old_name)
                .values(name = new_name)
            )
            self.session.execute(stmt)
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def remove_menu_items(self, item_name: str) -> None:
        '''
        Remove a menu item from the menu.

        Arguments:
            <item_name> (<str>) - The name of a item.
        Exceptions:
            InputError  - Occurs when the name of the item is invalid
        Return Value:
            N/A
        '''

        # check if an item exists
        if not check_item_exists(item_name.lower(), self.session):
            raise InputError(detail='Invalid name')

        try:
            self.session.execute(delete(Items).where(Items.name==item_name))
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def update_order_menu_items(self, item_name: str, new_index: int) -> None:
        '''
        Updates the order of a menu item.

        Arguments:
            <item_name> (<str>)     - The name of the menu item to update.
            <is_up>     (<bool>)    - Indicates whether to move the item up (True) or down (False).
        Exceptions:
            InputError  - Occurs when the item name is invalid.
                        - Occurs when the order is invalid.
        Return Value:
            None
        '''
        # check if item exists
        if not check_item_exists(item_name.lower(), self.session):
            raise InputError(detail='Invalid name')

        prev_order = self.session.query(Items.item_order).filter_by(name=item_name).scalar()

        # get item count in a category
        cat_name = self.session.query(Items.category_name).filter_by(name=item_name).scalar()
        total_count = self.session.query(Items).where(Items.category_name==cat_name).count()

        # if item is the last one in the category
        if prev_order + 1 > total_count and new_index > prev_order:
            raise InputError(detail=INVALID_ORDER_MSG)

        # the first item of the table cannot move up
        if prev_order == 1 and new_index < prev_order:
            raise InputError(detail=INVALID_ORDER_MSG)

        try:
            row1 = (
                self.session.query(Items)
                .where(Items.category_name == cat_name)
                .filter_by(item_order=prev_order)
                .one()
            )

            row2 = (
                self.session.query(Items)
                .where(Items.category_name==cat_name)
                .filter_by(item_order=new_index).one()
            )
            row1.item_order, row2.item_order = row2.item_order, row1.item_order

            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def update_order_menu_category(self, category_name: str, new_index: int) -> None:
        '''
        Updates the order of a category.

        Arguments:
            <category_name> (<str>)     - The name of the category to update.
            <is_up>         (<bool>)    - Indicates whether to move the item up or down.
        Exceptions:
            InputError  - Occurs when the category name is invalid.
                        - Occurs when the order is invalid.
        Return Value:
            None
        '''
        print(self.get_all_categories())
        print(new_index)
        # check if category name is valid
        if not check_categories_key_is_valid('name', category_name, self.session):
            raise InputError(detail='Invalid category name')

        prev_order = self.session.query(Categories.cat_order).filter_by(name=category_name).scalar()

        total_count = self.session.query(Categories.name).count()

        # the last item of the database cannot move down
        if prev_order + 1 > total_count and new_index > prev_order:
            raise InputError(detail=INVALID_ORDER_MSG)

         # the first item of the table cannot move up
        if prev_order == 1 and new_index < prev_order:
            raise InputError(detail=INVALID_ORDER_MSG)

        try:
            # swap order
            row1 = self.session.query(Categories).filter_by(cat_order=prev_order).one()
            row2 = self.session.query(Categories).filter_by(cat_order=new_index).one()
            row1.cat_order, row2.cat_order = row2.cat_order, row1.cat_order
            self.session.commit()
        except Exception as error:
            self.session.rollback()
            raise InputError(detail=f'Error occurred: {str(error)}') from error
        finally:
            self.session.close()

    def clear_data(self):
        '''
        Helper function to clear table data.
        '''
        metadata = MetaData()
        items_table = Table('Items', metadata, autoload_with=self.engine)
        cat_table = Table('Categories', metadata, autoload_with=self.engine)

        with self.engine.begin() as conn:
            delete_query = cat_table.delete()
            conn.execute(delete_query)

            delete_query = items_table.delete()
            conn.execute(delete_query)

    def _get_item_in_category(self, item_order: int, category_name: str):
        '''
        Helper function to get item by index in a category.
        '''
        try:
            query = (
                select(Items.name)
                .where(Items.category_name.ilike(category_name))
                .where(Items.item_order==item_order)
            )
            result = self.session.execute(query).fetchone()
        except Exception as error:
            raise NotFoundError('Database not found.') from error
        finally:
            self.session.close()

        return result
