'''
The `table_db` module provides functionality for managing table information.

This module contains functions for creating, updating, and checking the tables.
It utilizes SQLite as the underlying database engine to store and retrieve table-related data.
'''

from sqlalchemy import create_engine, Table, MetaData, select, update, delete
from sqlalchemy.orm import sessionmaker
from src.db_model import Tables
from src.error import InputError
from src.helper import check_table_exists
from constant import TEST_PATH, DEFAULT_TABLE_STATUS
from src.helper import check_table_exists

class TableDB():
    '''
    The TableDB class implements operations related to tables.

    Args:
        database_path (str): The path to the SQLite database file.
    '''

    def __init__(self) -> None:
        self.engine = create_engine(TEST_PATH)
        # create table
        Tables.__table__.create(bind=self.engine, checkfirst=True)

        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def select_table_number(self, table_id: int) -> int:
        '''
        Selects a table_id and marks it as 'OCCUPIED' by default.

        Arguments:
            <table_id> (<int>)    - unique id of a table to select
        Exceptions:
            InputError  - Occurs when table_id has been selected
                        - Occurs when table_id is less than 0
        Return Value:
            N/A
        '''

        if check_table_exists(table_id, self.session):
            raise InputError('Table id is not available.')

        new_table = Tables(table_id=table_id, status=DEFAULT_TABLE_STATUS)
        self.session.add(new_table)
        self.session.commit()
        
        self.session.close()
        return table_id

    def get_all_tables_status(self) -> dict:
        '''
        Return Value the status of all tables from the Tables database.

        Arguments:
            N/A
        Exceptions:
            N/A
        Return Value:
            Return Value <table_dict> of table_id with respective table status.
        '''
        table_dict = {}

        statement = select(Tables.table_id, Tables.status)
        rows = self.session.execute(statement).all()
        self.session.close()

        for item in rows:
            table_dict[item[0]] = item[1]

        return table_dict

    def update_table_status(self, table_id: int, status: str) -> None:
        '''
        Updates the status of a table identified by table_id in the Tables database.

        Arguments:
            <table_id> (<int>)    - unique id of a table to select
            <status>   (<str>)    - the new status to set for the table.
        Exceptions:
            InputError  - Occurs when table_id is not available in the database
                        - Occurs when table_id is less than 0
                        - Occurs when status is not 'OCCUPIED', 'ASSIST', 'BILL', 'EMPTY'
        Return Value:
            Return Value <table_dict> of table_id with respective table status.
        '''

        if not check_table_exists(table_id, self.session):
            raise InputError('Table id is not available.')

        # check if the status is valid
        if status not in ['OCCUPIED', 'ASSIST', 'BILL', 'EMPTY']:
            raise InputError('Unknown status')

        stmt = (
            update(Tables)
            .where(Tables.table_id == table_id)
            .values(status=status)
        )
        self.session.execute(stmt)
        self.session.commit()
        
        self.session.execute(delete(Tables).where(Tables.status == 'EMPTY'))
        self.session.commit()
        self.session.close()

    def clear_tables_data(self):
        metadata = MetaData()
        tables_table = Table('Tables', metadata, autoload_with=self.engine)

        with self.engine.begin() as conn:
            delete_query = tables_table.delete()
            conn.execute(delete_query)
