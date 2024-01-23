from mysql.connector import connect
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
        
    def __enter__(self):
        self.cursor.execute(f"USE {self.database}")
        return self
    
    def __exit__(self, exc_type: Any, exc_value: Any, traceback: Any) -> None:
        self.connection.commit()
        self.connection.close()

    def setup_tables(self) -> None:
        self.cursor.execute("DROP TABLE IF EXISTS cash_positions;")
        self.cursor.execute("DROP TABLE IF EXISTS portfolio_positions;")
        self.cursor.execute("DROP TABLE IF EXISTS prices_time_series;")
        self.cursor.execute("DROP TABLE IF EXISTS assets;")
        self.cursor.execute("DROP TABLE IF EXISTS managers;")
        self.cursor.execute("DROP TABLE IF EXISTS clients;")
        self.cursor.execute("""
            CREATE TABLE assets (
                asset_id INT PRIMARY KEY AUTO_INCREMENT,
                asset_code VARCHAR(50) UNIQUE NOT NULL,
                asset_name VARCHAR(50)
            );
        """)
        self.cursor.execute("""
            CREATE TABLE prices_time_series (
                price_date DATE NOT NULL,
                price_value DECIMAL(10, 6) NOT NULL,
                asset_id INT NOT NULL,
                FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
                UNIQUE (price_date, asset_id)
            );
        """)
        self.cursor.execute("""
            CREATE TABLE managers (
                user_id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                user_password CHAR(64) NOT NULL,
                zip CHAR(8) NOT NULL
            );
        """)
        self.cursor.execute("ALTER TABLE managers AUTO_INCREMENT = 1000;")
        self.cursor.execute("""
            CREATE TABLE clients LIKE managers;
        """)
        self.cursor.execute("ALTER TABLE clients AUTO_INCREMENT = 500000;")
        self.cursor.execute("""
            CREATE TABLE portfolio_positions (
                position_date DATE NOT NULL,
                position_asset INT NOT NULL,
                position_value DECIMAL(10, 6) NOT NULL,
                position_client INT NOT NULL,
                FOREIGN KEY (position_asset) REFERENCES assets(asset_id),
                FOREIGN KEY (position_client) REFERENCES clients(user_id),
                UNIQUE (position_date, position_asset, position_client)
            );
        """)
        self.cursor.execute("""
            CREATE TABLE cash_positions (
                cash_value DECIMAL(10, 6) NOT NULL,
                cash_client INT PRIMARY KEY,
                FOREIGN KEY (cash_client) REFERENCES clients(user_id)
            );
        """)

    def insert_mockery_companies(self) -> None:
        self.cursor.execute("INSERT INTO assets (asset_name, asset_code) VALUES ('PETROBRAS', 'PETR4.SA');")
        self.cursor.execute("INSERT INTO assets (asset_name, asset_code) VALUES ('ITAUSA', 'ITSA4.SA')")
        self.cursor.execute("INSERT INTO assets (asset_name, asset_code) VALUES ('KLABIN S/A', 'KLBN11.SA')")

    def insert_mockery_prices(self) -> None:
        self.cursor.execute(f"""
            INSERT INTO prices_time_series (price_date, price_value, asset_id) VALUES (
                "2022-05-12",
                28.445,
                (SELECT asset_id FROM assets WHERE asset_code="PETR4.SA")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO prices_time_series (price_date, price_value, asset_id) VALUES (
                "2022-05-13",
                35.455,
                (SELECT asset_id FROM assets WHERE asset_code="PETR4.SA")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO prices_time_series (price_date, price_value, asset_id) VALUES (
                "2022-05-14",
                35.455,
                (SELECT asset_id FROM assets WHERE asset_code="PETR4.SA")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO prices_time_series (price_date, price_value, asset_id) VALUES (
                "2022-05-13",
                35.455,
                (SELECT asset_id FROM assets WHERE asset_code="ITSA4.SA")
            );
        """)

    def insert_mockery_managers(self) -> None:
        self.cursor.execute(f"""
            INSERT INTO managers (first_name, last_name, email, user_password, zip) VALUES (
                "João",
                "Silva",
                "joao.silva@gmail.com",
                "2edda3d63d25cd51b714778e471edb2803ab6ae24b06f48ae023860b12e042a3",
                "25387556"
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO managers (first_name, last_name, email, user_password, zip) VALUES (
                "José",
                "Sousa",
                "josesousa1920@yahoo.com",
                "a7d46b112536de423306ae260390ef6cbaa14046c936655888d077e44e538d73",
                "34866201"
            );
        """)

    def insert_mockery_clients(self) -> None:
        self.cursor.execute(f"""
            INSERT INTO clients (first_name, last_name, email, user_password, zip) VALUES (
                "João",
                "Silva",
                "joao.silva@gmail.com",
                "2edda3d63d25cd51b714778e471edb2803ab6ae24b06f48ae023860b12e042a3",
                "25387556"
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO clients (first_name, last_name, email, user_password, zip) VALUES (
                "José",
                "Sousa",
                "josesousa1920@yahoo.com",
                "a7d46b112536de423306ae260390ef6cbaa14046c936655888d077e44e538d73",
                "34866201"
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO clients (first_name, last_name, email, user_password, zip) VALUES (
                "Maria",
                "Cunha",
                "mariazinha@hotmail.com",
                "80f71d555c6493b5c8e7b84223ea55c775e2c9d3539eb2b9c49bdba306016c7b",
                "34866201"
            );
        """)

    def insert_mockery_positions(self) -> None:
        self.cursor.execute(f"""
            INSERT INTO portfolio_positions (position_date, position_asset, position_value, position_client) VALUES (
                "2022-05-13",
                (SELECT asset_id FROM assets WHERE asset_code="PETR4.SA"),
                100.00,
                (SELECT user_id FROM clients WHERE email="josesousa1920@yahoo.com")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO portfolio_positions (position_date, position_asset, position_value, position_client) VALUES (
                "2022-05-13",
                (SELECT asset_id FROM assets WHERE asset_code="ITSA4.SA"),
                50.00,
                (SELECT user_id FROM clients WHERE email="josesousa1920@yahoo.com")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO portfolio_positions (position_date, position_asset, position_value, position_client) VALUES (
                "2022-05-14",
                (SELECT asset_id FROM assets WHERE asset_code="ITSA4.SA"),
                70.00,
                (SELECT user_id FROM clients WHERE email="josesousa1920@yahoo.com")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO portfolio_positions (position_date, position_asset, position_value, position_client) VALUES (
                "2022-05-13",
                (SELECT asset_id FROM assets WHERE asset_code="PETR4.SA"),
                230.00,
                (SELECT user_id FROM clients WHERE email="joao.silva@gmail.com")
            );
        """)
        self.cursor.execute(f"""
            INSERT INTO portfolio_positions (position_date, position_asset, position_value, position_client) VALUES (
                "2022-05-13",
                (SELECT asset_id FROM assets WHERE asset_code="ITSA4.SA"),
                80.00,
                (SELECT user_id FROM clients WHERE email="mariazinha@hotmail.com")
            );
        """)

    def insert_mockery_cash(self) -> None:
        self.cursor.execute(f"""
            INSERT INTO cash_positions (cash_value, cash_client) VALUES (
                1000.00,
                (SELECT user_id FROM clients WHERE email="josesousa1920@yahoo.com")
            ) ON DUPLICATE KEY UPDATE cash_value=1000.00;
        """)
        self.cursor.execute(f"""
            INSERT INTO cash_positions (cash_value, cash_client) VALUES (
                2000.00,
                (SELECT user_id FROM clients WHERE email="josesousa1920@yahoo.com")
            ) ON DUPLICATE KEY UPDATE cash_value=2000.00;
        """)
        self.cursor.execute(f"""
            INSERT INTO cash_positions (cash_value, cash_client) VALUES (
                150.00,
                (SELECT user_id FROM clients WHERE email="joao.silva@gmail.com")
            ) ON DUPLICATE KEY UPDATE cash_value=150.00;
        """)
        self.cursor.execute(f"""
            INSERT INTO cash_positions (cash_value, cash_client) VALUES (
                500.00,
                (SELECT user_id FROM clients WHERE email="mariazinha@hotmail.com")
            ) ON DUPLICATE KEY UPDATE cash_value=500.00;
        """)

if __name__ == "__main__":
    config = {
        "user": "root",
        "password": "Database10!",
        "host": "localhost",
        "database": "testdb"
    }

    with Database(**config) as db:
        db.setup_tables()
        db.insert_mockery_companies()
        db.insert_mockery_prices()
        db.insert_mockery_managers()
        db.insert_mockery_clients()
        db.insert_mockery_positions()
        db.insert_mockery_cash()

        db.cursor.execute("SELECT * FROM portfolio_positions")
        for row in db.cursor.fetchall():
            print(row)

        db.cursor.execute("SELECT * FROM cash_positions")
        for row in db.cursor.fetchall():
            print(row)

        db.cursor.execute("SELECT * FROM prices_time_series")
        for row in db.cursor.fetchall():
            print(row)

        db.cursor.execute("SELECT * FROM assets")
        for row in db.cursor.fetchall():
            print(row)