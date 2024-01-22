from mysql.connector import connect
from mysql.connector.cursor import MySQLCursor
from mysql.connector.connection import MySQLConnection
from typing import Any

class Database:
    def __init__(self, user: str, password: str, host: str, database: str):
        self.user = user
        self.password = password
        self.host = host
        self.database = database

        attempts = 0
        while attempts < 3:
            try:
                connection = connect(user=user, password=password, host=host, database=database)
                if isinstance(connection, MySQLConnection) and connection.is_connected():
                    self.connection = connection
                    self.cursor = connection.cursor()
                    break
            except:
                attempts += 1
        else:
            raise Exception("Could not connect to database")
        
    def __enter__(self) -> MySQLCursor:
        return self.cursor
    
    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        self.connection.close()

    def setup_tables(self) -> None:
        pass

if __name__ == "__main__":
    config = {
        "user": "root",
        "password": "!!!!!!!!",
        "host": "localhost",
        "database": "testdb"
    }

    with Database(**config) as db:
        db.execute("SELECT * FROM testdb.xpto")
        for row in db:
            print(row)