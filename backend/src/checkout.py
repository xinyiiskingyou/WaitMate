'''
The `checkout` module provides functionalites for checkout related features.

These features includes customer viewing their bill, adding any coupons,
and tips. It also includes the coupons in relation to the manager
'''
from typing import List
import sqlalchemy.exc
from sqlalchemy import MetaData, Table, create_engine, delete, update
from sqlalchemy.orm import sessionmaker
from constant import DB_PATH, INVALID_TABLE_MSG
from src.error import InputError
from src.db_model import Coupons, Checkout
from src.helper import get_order, check_table_exists, check_coupon_valid

class CheckoutDB:

    def __init__(self) -> None:
        self.engine = create_engine(DB_PATH)

        Coupons.__table__.create(bind=self.engine, checkfirst=True)
        Checkout.__table__.create(bind=self.engine, checkfirst=True)

        session_maker = sessionmaker(bind=self.engine)
        self.session = session_maker()

    def checkout_bill(self, table_id: int) -> dict:
        if not check_table_exists(table_id, self.session):
            raise InputError(detail=INVALID_TABLE_MSG)

        try:
            # Get the items for the checkout order
            items = self._checkout_order(table_id)

            # Get the coupon and tip from the Checkout table using SQLAlchemy
            checkout_data = self.session.query(Checkout).filter_by(table_id=table_id).first()
            bill = {
                'items': items,
                'tip': 0,
                'discount': 0,
                'coupon_code': ''
            }

            if checkout_data:
                if checkout_data.coupon:
                    bill['coupon_code'] = checkout_data.coupon
                if checkout_data.tip:
                    bill['tip'] = checkout_data.tip

            # Calculate the total cost of the items
            total = sum(item['cost'] for item in items)
            bill['total'] = total

            if bill['coupon_code']:
                # calculate the coupon discount
                coupon_discount = check_coupon_valid(bill['coupon_code'], self.session)
                new_total = bill['total'] * (100 - coupon_discount) / 100
                discount_amount = new_total - total
                bill['discount'] = round(discount_amount, 2) * -1
                bill['total'] = round(new_total, 2)

            bill['total'] += bill['tip']
            return bill
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return {}
        finally:
            self.session.close()

    def checkout_bill_tips(self, table_id: int, amount: int):

        if not check_table_exists(table_id, self.session):
            raise InputError(detail=INVALID_TABLE_MSG)

        if amount <= 0:
            raise InputError(detail='Invalid tip amount.')

        self._checkout_add(table_id)

        try:
            stmt = (
                update(Checkout)
                .where(Checkout.table_id == table_id)
                .values(tip = amount)
            )
            self.session.execute(stmt)
            self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            self.session.rollback()
            raise InputError(detail=f"Error occurred: {str(err)}") from err
        finally:
            self.session.close()

    def checkout_bill_coupon(self, table_id: int, coupon: str):

        if not check_table_exists(table_id, self.session):
            raise InputError(detail=INVALID_TABLE_MSG)
        if not check_coupon_valid(coupon, self.session):
            raise InputError(detail='Invalid coupon.')

        self._checkout_add(table_id)

        try:
            stmt = (
                update(Checkout)
                .where(Checkout.table_id == table_id)
                .values(coupon = coupon)
            )
            self.session.execute(stmt)
            self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            self.session.rollback()
            raise InputError(detail=f"Database error occurred: {str(err)}") from err
        finally:
            self.session.close()

    def checkout_coupon_create(self, code: str, amount: int):
        if check_coupon_valid(code, self.session):
            raise InputError(detail='Coupon code already in use')
        if amount <= 0:
            raise InputError(detail='Invalid coupon amount')

        try:
            new_coupon = Coupons(
                code = code,
                amount = amount
            )
            self.session.add(new_coupon)
            self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            self.session.rollback()
            raise InputError(detail=f"Database error occurred: {str(err)}") from err
        finally:
            self.session.close()

    def checkout_coupon_delete(self, code: str):
        if not check_coupon_valid(code, self.session):
            raise InputError(detail='Coupon code is not valid')

        try:
            self.session.execute(delete(Coupons).where(Coupons.code==code))
            self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            self.session.rollback()
            raise InputError(detail=f"Database error occurred: {str(err)}") from err
        finally:
            self.session.close()

    def checkout_coupon_view(self) -> List[dict]:
        try:
            coupons = self.session.query(Coupons).all()

            coupon_list = [{'code': coupon.code, 'amount': coupon.amount} for coupon in coupons]
            return coupon_list
        except sqlalchemy.exc.SQLAlchemyError:
            self.session.rollback()
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

    def _checkout_add(self, table_id: int):
        try:
            # Check if table id exists
            checkout_row = self.session.query(Checkout).filter_by(table_id=table_id).first()

            # If it does not exist, insert a new row with default values
            if not checkout_row:
                new_checkout = Checkout(table_id=table_id, coupon=None, tip=None)
                self.session.add(new_checkout)
                self.session.commit()
        except sqlalchemy.exc.SQLAlchemyError as err:
            self.session.rollback()
            raise InputError(detail=f"Database error occurred: {str(err)}") from err
        finally:
            self.session.close()
            
    def _checkout_order(self, table_id: int) -> List[dict]:

        result = get_order(table_id, self.session)
        ret = [{'name': i[0], 'cost': i[4], 'amount': i[1]} for i in result]

        return ret
