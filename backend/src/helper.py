from typing import Any, List, Optional
import sqlalchemy.exc
from sqlalchemy import select
from sqlalchemy.orm import Session
from constant import INVALID_TABLE_MSG
from src.db_model import Tables, Categories, Items, Orders, Coupons
from src.error import NotFoundError, InputError

def check_table_exists(table_id: int, session: Session):
    # check if table number is valid
    if table_id is None or table_id < 0:
        raise InputError(detail=INVALID_TABLE_MSG)

    try:
        result = session.query(Tables).filter_by(table_id=table_id).first()
    except Exception as e:
        raise InputError(detail=str(e))
    finally:
        session.close()
    return result

def check_category_exists(category_name: str, session: Session):

    try:
        query = select(Categories).where(Categories.name.ilike(category_name))
        result = session.execute(query).fetchall()
    except Exception as e:
        raise InputError(detail=str(e))
    finally:
        session.close()

    return result

def check_item_exists(item_name: str, session: Session):

    try:
        query = select(Items).where(Items.name.ilike(item_name))
        result = session.execute(query).fetchall()
    except Exception as e:
        raise InputError(detail=str(e))
    finally:
        session.close()

    return result

def check_categories_key_is_valid(column: str, value: str, session: Session):
    try:
        query = session.query(Categories).filter(getattr(Categories, column) == value)
        result = query.first()
    except Exception:
        raise NotFoundError('Database not found.')
    finally:
        session.close()

    return result

def get_order(table_id: int, session: Session) -> List[Any]:

    if not check_table_exists(table_id, session):
        raise InputError(detail=INVALID_TABLE_MSG)

    try:
        res = (
            session.query(Orders.item_name, Orders.amount, Orders.is_prepared, Orders.is_served, (Orders.amount * Items.cost))
            .join(Items, Orders.item_name == Items.name)
            .filter(Orders.table_id == table_id)
            .all()
        )

        order_list = [(item_name, amount, is_prepared, is_served, total_cost) for item_name, amount, is_prepared, is_served, total_cost in res]
        return order_list
    except Exception:
        raise NotFoundError('Order database not found.')
    finally:
        session.close()

def check_coupon_valid(code: str, session: Session) -> Optional[int]:

    try:
        coupon = session.query(Coupons).filter_by(code=code).first()
        if not coupon:
            return None
        return coupon.amount
    except sqlalchemy.exc.SQLAlchemyError as err:
        session.rollback()
        raise InputError(detail=f"Database error occurred: {str(err)}") from err
    finally:
        session.close()