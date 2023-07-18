from typing import Any, List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.db_model import Tables, Categories, Items, Orders
from src.error import NotFoundError, InputError

def check_table_exists(table_id: int, session: Session):
    # check if table number is valid
    if table_id is None or table_id < 0:
        raise InputError('Table id is not available.')

    try:
        result = session.query(Tables).filter_by(table_id=table_id).first()
    except Exception as e:
        raise InputError(str(e))
    finally:
        session.close()
    return result

def check_category_exists(category_name: str, session: Session):

    try:
        query = select(Categories).where(Categories.name.ilike(category_name))
        result = session.execute(query).fetchall()
    except Exception as e:
        raise InputError(str(e))
    finally:
        session.close()

    return result

def check_item_exists(item_name: str, session: Session):

    try:
        query = select(Items).where(Items.name.ilike(item_name))
        result = session.execute(query).fetchall()
    except Exception as e:
        raise InputError(str(e))
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
        raise InputError('The table_id does not refer to a valid table')

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

