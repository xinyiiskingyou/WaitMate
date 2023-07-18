from typing import List
from sqlalchemy import MetaData, Table, create_engine, delete, update
from sqlalchemy.orm import sessionmaker
from constant import DB_PATH, DB_PATH
from src.error import InputError
from src.db_model import Coupons, CheckoutDB
from src.helper import get_order, check_table_exists

class Checkout:

    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)

        Coupons.__table__.create(bind=self.engine, checkfirst=True)
        CheckoutDB.__table__.create(bind=self.engine, checkfirst=True)

        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def checkout_order(self, table_id: int) -> List[dict]:
        ret: list = []

        result = get_order(table_id, self.session)
        ret = [{'name': i[0], 'cost': i[4], 'amount': i[1]} for i in result]

        return ret

    def checkout_bill(self, table_id: int) -> int:
        if not check_table_exists(table_id, self.session):
            raise InputError('The table_id does not refer to a valid table')

        try:
            # Get the items for the checkout order
            items = self.checkout_order(table_id)

            # Get the coupon and tip from the Checkout table using SQLAlchemy
            checkout_data = self.session.query(CheckoutDB).filter_by(table_id=table_id).first()
            bill = {'items': items}

            if checkout_data:
                if checkout_data.coupon:
                    bill['coupon'] = checkout_data.coupon
                if checkout_data.tip:
                    bill['tip'] = checkout_data.tip

            # Calculate the total cost of the items
            total = sum(item['cost'] for item in items)
            bill['total'] = total

            if 'coupon' in bill:
                coupon_discount = self._checkout_coupon_find(bill['coupon'])
                bill['total'] = bill['total'] * (100 - coupon_discount) / 100
                bill['total'] = round(bill['total'], 2)

            if 'tip' in bill:
                bill['total'] += bill['tip']

            return bill['total']
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return {}
        finally:
            self.session.close()

    def checkout_bill_tips(self, table_id: int, amount: int):

        if not check_table_exists(table_id, self.session):
            raise InputError('The table_id does not refer to a valid table')

        if amount <= 0:
            raise InputError('Invalid tip amount.')

        self._checkout_add(table_id)

        try:
            stmt = (
                update(CheckoutDB)
                .where(CheckoutDB.table_id == table_id)
                .values(tip = amount)
            ) 
            self.session.execute(stmt)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()

    def checkout_bill_coupon(self, table_id: int, coupon: str):

        if not check_table_exists(table_id, self.session):
            raise InputError('The table_id does not refer to a valid table')

        if not self._checkout_coupon_find(coupon):
            raise InputError('Invalid coupon.')
        
        self._checkout_add(table_id)

        try:
            stmt = (
                update(CheckoutDB)
                .where(CheckoutDB.table_id == table_id)
                .values(coupon = coupon)
            ) 
            self.session.execute(stmt)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()

    def checkout_coupon_create(self, code: str, amount: int):
        if self._checkout_coupon_find(code):
            raise InputError('Coupon code already in use')
        if amount <= 0:
            raise InputError('Invalid coupon amount')
        
        try:
            new_coupon = Coupons(
                code = code,
                amount = amount
            )
            self.session.add(new_coupon)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()

    def checkout_coupon_delete(self, code: str):
        if not self._checkout_coupon_find(code):
            return
        
        try:
            self.session.execute(delete(Coupons).where(Coupons.code==code))
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()

    def checkout_coupon_view(self) -> List[dict]: 
        try:
            coupons = self.session.query(Coupons).all()

            coupon_list = [{'code': coupon.code, 'amount': coupon.amount} for coupon in coupons]
            return coupon_list
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return []
        finally:
            self.session.close()

    def clear_data(self):
        metadata = MetaData()
        check_table = Table('Checkout', metadata, autoload_with=self.engine)
        coupons_table = Table('Coupons', metadata, autoload_with=self.engine)

        with self.engine.begin() as conn:
            delete_query = check_table.delete()
            conn.execute(delete_query)

            delete_query = coupons_table.delete()
            conn.execute(delete_query)

    # PRIVATE HELPER FUNCTIONS
    
    def _checkout_coupon_find(self, code: str) -> int:

        try:
            coupon = self.session.query(Coupons).filter_by(code=code).first()
            if not coupon:
                return None
            return coupon.amount
        except Exception as e:
            self.session.rollback()
            print(f"Error occurred: {str(e)}")
            raise
        finally:
            self.session.close()

    def _checkout_add(self, table_id: int):

        try:
            # Check if table id exists
            checkout_row = self.session.query(CheckoutDB).filter_by(table_id=table_id).first()

            # If it does not exist, insert a new row with default values
            if not checkout_row:
                new_checkout = CheckoutDB(table_id=table_id, coupon=None, tip=None)
                self.session.add(new_checkout)
                self.session.commit()
        except Exception as e:
            self.session.rollback()
            print(f"Error occurred: {str(e)}")
            raise
        finally:
            self.session.close()

    def _checkout_remove(self, table_id: int):
        try:
            self.session.execute(delete(CheckoutDB).where(CheckoutDB.table_id==table_id))
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise InputError(f"Error occurred: {str(e)}")
        finally:
            self.session.close()
