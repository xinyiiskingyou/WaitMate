from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Tables(Base):
    __tablename__ = 'Tables'

    table_id = Column(Integer, primary_key=True)
    status = Column(String, nullable=False)
    req_time = Column(TIMESTAMP)

class Categories(Base):
    __tablename__ = 'Categories'

    cat_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    cat_order = Column(Integer, default=0)

class Items(Base):
    __tablename__ = 'Items'
    
    item_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    cost = Column(Integer, nullable=False)
    description = Column(String, nullable=False)
    ingredients = Column(String, nullable=False)
    is_vegan = Column(Boolean)
    item_order = Column(Integer)
    category_name = Column(String)

class Orders(Base):
    __tablename__ = 'Orders'

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(String, nullable=False)
    table_id = Column(Integer, nullable=False)
    item_name = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    is_prepared = Column(Integer, default=0)
    is_served = Column(Integer, default=0)

class Checkout(Base):
    __tablename__ = 'Checkout'

    table_id = Column(Integer, primary_key=True)
    coupon = Column(String)
    tip = Column(Integer)

class Coupons(Base):
    __tablename__ = 'Coupons'

    code = Column(String, primary_key=True)
    amount = Column(Integer)

class Memes(Base):
    __tablename__ = 'Memes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String)
    count = Column(Integer, default=0)
    
class Votes(Base):
    __tablename__ = 'Votes'
    
    email = Column(String, primary_key=True)
    filename = Column(String)
