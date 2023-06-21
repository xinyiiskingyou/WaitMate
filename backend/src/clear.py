'''
Clear the data that has been stored
'''
import sqlite3

def clear_database(database: str, database_name: str):
    '''
    Resets the internal data of the database.

    Arguments:
        N/A
    Exceptions:
        N/A
    Return Value:
        N/A
    '''
    con = sqlite3.connect(database)
    cur = con.cursor()

    # Execute the DELETE statement to clear the table
    cur.execute(f"DELETE FROM {database_name}")

    # Commit the changes and close the connection
    con.commit()
    con.close()
    return {}
