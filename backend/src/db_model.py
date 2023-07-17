from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, PrimaryKeyConstraint
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

class Menu(Base):
    __tablename__ = 'Menu'

    category = Column(String)
    item = Column(String)
    item_order = Column(Integer, default=0)

    __table_args__ = (
        PrimaryKeyConstraint(category, item),
    )
