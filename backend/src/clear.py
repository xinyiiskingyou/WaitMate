'''
Clear the data that has been stored
'''
import sqlite3
from constant import DB_PATH 


def clear_database(database_name: str):
    '''
    Resets the internal data of the database.

    Arguments:
        N/A
    Exceptions:
        N/A
    Return Value:
        N/A
    '''
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    # Execute the DELETE statement to clear the table
    cur.execute(f'DROP TABLE IF EXISTS {database_name} ')

    # Commit the changes and close the connection
    con.commit()
    con.close()
    return {}
