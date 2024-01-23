from database import Database
from scraping import fetch_companies, get_historical_prices

companies = fetch_companies()
for company in companies:
    company["prices"] = get_historical_prices(company["code"])

config = {
    "user": "root",
    "password": "Database10!",
    "host": "localhost",
    "database": "testdb"
}

with Database(**config) as db:
    db.setup_tables()

    for company in companies:
        db.insert_company(company["name"], company["code"])

    for company in companies:
        for date, price in company["prices"].items():
            db.insert_price(date.strftime("%Y-%m-%d"), price, company["code"])

    db.cursor.execute("SELECT * FROM assets")
    print(db.cursor.fetchall())

    db.cursor.execute("SELECT * FROM prices_time_series")
    print(db.cursor.fetchall())