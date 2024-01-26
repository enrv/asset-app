from flask import Flask
from standalone.database import Database, UnregisteredUserOrWrongPasswordException
from standalone.scraping import fetch_companies, get_historical_prices
from hashlib import sha256
from flask import request
import os
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from datetime import timedelta

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)

config = {
    "user": "root",
    "password": "Database10!",
    "host": "localhost",
    "database": "testdb"
}

with app.app_context():
    with Database(**config) as db:
        db.setup_tables()
        db.insert_mockery_clients()
        db.insert_mockery_managers()

@app.route("/api")
@jwt_required()
# curl -i -X GET -H "Content-Type: application/json" -H "Authorization: Bearer token" http://localhost:5000/api
def hello():
    email = get_jwt_identity()
    return {"message": f"Hello, World! Nice to see you, {email}"}

#### AUTH FUNCTIONS

@app.route("/api/login", methods=["POST"])
# curl -i -X POST -H "Content-Type: application/json" -d '{"email":"joao.silva@gmail.com","password":"qads", "kindofuser": "client"}' http://localhost:5000/api/login
# curl -i -X POST -H "Content-Type: application/json" -d '{"email":"joao.silva2@gmail.com","password":"qads", "kindofuser": "client"}' http://localhost:5000/api/login
# curl -i -X POST -H "Content-Type: application/json" -d '{"email":"joao.silva@gmail.com","password":"qadsss", "kindofuser": "client"}' http://localhost:5000/api/login
# curl -i -X POST -H "Content-Type: application/json" -d '{"email":"joao.silva@gmail.com","password":"qads"}' http://localhost:5000/api/login
# curl -i -X POST -H "Content-Type: application/json" -d '{"email":"josesousa1920@yahoo.com","password":"qadsklsad jkasd", "kindofuser": "manager"}' http://localhost:5000/api/login
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    kindofuser = request.json.get("kindofuser")

    if email is None or password is None or kindofuser is None:
        return {"message": "Missing parameters!"}, 400
    
    encrypted_password = sha256(password.encode("utf-8")).hexdigest()

    if kindofuser == "manager":
        db_search = lambda db, email, password: db.find_manager(email, password)
    elif kindofuser == "client":
        db_search = lambda db, email, password: db.find_client(email, password)
    else:
        return {"message": "Invalid kind of user!"}, 400
    
    with Database(**config) as db:
        try:
            first_name, last_name = db_search(db, email, encrypted_password)
            access_token = create_access_token(identity=email)
            return {"message": f"Welcome {first_name} {last_name}", "access_token": access_token}
        except UnregisteredUserOrWrongPasswordException as e:
            return {"message": str(e)}, 401

@app.route("/api/register", methods=["POST"])
# curl -i -X POST -H "Content-Type: application/json" -d '{"email":"abcdef@gmail.com","password":"xpto1290","first_name":"abc","last_name":"def","zip":"25678190","kindofuser":"client"}' http://localhost:5000/api/register
def register():
    email = request.json.get("email")
    password = request.json.get("password")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    zip_code = request.json.get("zip")
    kindofuser = request.json.get("kindofuser")

    if email is None or password is None or first_name is None or last_name is None or zip_code is None or kindofuser is None:
        return {"message": "Missing parameters!"}, 400
    
    encrypted_password = sha256(password.encode("utf-8")).hexdigest()

    if kindofuser == "manager":
        db_insert = lambda db, first_name, last_name, email, password, zip_code: db.insert_manager(first_name, last_name, email, password, zip_code)
    elif kindofuser == "client":
        db_insert = lambda db, first_name, last_name, email, password, zip_code: db.insert_client(first_name, last_name, email, password, zip_code)
    else:
        return {"message": "Invalid kind of user!"}, 400
    
    with Database(**config) as db:
        try:
            db_insert(db, first_name, last_name, email, encrypted_password, zip_code)
            return {"message": "User registered successfully!"}
        except Exception as e:
            return {"message": str(e)}, 400

#### MANAGER FUNCTIONS

@app.route("/api/get-clients", methods=["GET"])
@jwt_required()
# curl -i X GET -H "Content-Type: application/json" -H "Authorization: Bearer token" http://localhost:5000/api/get-clients
def get_clients():
    manager_email = get_jwt_identity()
    
    with Database(**config) as db:
        try:
            if not db.does_manager_exist(manager_email):
                return {"message": "You are not a manager!"}, 403
            clients = db.get_all_clients()
            return {"clients": clients}
        except Exception as e:
            return {"message": str(e)}, 400

@app.route("/api/get-client-cash", methods=["GET"])
@jwt_required()
# curl -i X GET "http://localhost:5000/api/get-client-cash?email=joao.silva@gmail.com" -H "Content-Type: application/json" -H "Authorization: Bearer token"
def get_client_cash():
    manager_email = get_jwt_identity()
    client_email = request.args.get("email")

    if client_email is None:
        return {"message": "Missing parameters!"}, 400
    
    with Database(**config) as db:
        try:
            if not db.does_manager_exist(manager_email):
                return {"message": "You are not a manager!"}, 403
            
            if not db.does_client_exist(client_email):
                return {"message": "Client not found!"}, 400

            cash = db.get_client_cash(client_email)
            return {"cash": cash}
        except Exception as e:
            return {"message": str(e)}, 400

@app.route("/api/update-client-cash", methods=["POST"])
@jwt_required()
# curl -i X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"email":"joao.silva@gmail.com","cash":50.25}' http://localhost:5000/api/update-client-cash
def update_client_cash():
    manager_email = get_jwt_identity()
    client_email = request.json.get("email")
    cash = request.json.get("cash")

    if client_email is None or cash is None:
        return {"message": "Missing parameters!"}, 400
    
    with Database(**config) as db:
        try:
            if not db.does_manager_exist(manager_email):
                return {"message": "You are not a manager!"}, 403
            
            if not db.does_client_exist(client_email):
                return {"message": "Client not found!"}, 400

            db.update_client_cash(client_email, cash)
            return {"message": "Cash updated successfully!"}
        except Exception as e:
            return {"message": str(e)}, 400

#### GENERAL FUNCTIONS

@app.route("/api/get-all-companies", methods=["GET"])
# curl -i -X GET -H "Content-Type: application/json" http://localhost:5000/api/get-all-companies
def get_all_companies():
    with Database(**config) as db:
        try:
            companies = db.get_all_companies()
            return {"companies": companies}
        except Exception as e:
            return {"message": str(e)}, 400
        
@app.route("/api/get-company-history", methods=["GET"])
# curl -i -X GET "http://localhost:5000/api/get-company-history?name=PETR4.SA" -H "Content-Type: application/json"
def get_company_history():
    company_name = request.args.get("name")

    if company_name is None:
        return {"message": "Missing parameters!"}, 400
    
    with Database(**config) as db:
        try:
            if not db.does_company_exist(company_name):
                return {"message": "Company not found!"}, 400

            history = db.get_company_history(company_name)
            return {"prices": history}
        except Exception as e:
            return {"message": str(e)}, 400

@app.route("/api/update-company-list", methods=["POST"])
# curl -i -X POST -H "Content-Type: application/json" http://localhost:5000/api/update-company-list
def update_company_list():
    with Database(**config) as db:
        try:
            companies = fetch_companies()
            for company in companies:
                db.insert_company(company["name"], company["code"])
            return {"message": "Company list updated successfully!"}
        except Exception as e:
            return {"message": str(e)}, 400

@app.route("/api/update-company-history", methods=["POST"])
# curl -i -X POST -H "Content-Type: application/json" http://localhost:5000/api/update-company-history
def update_company_history():
    with Database(**config) as db:
        try:
            companies = db.get_all_companies()
            codes = [company["asset_code"] for company in companies]

            for code in codes:
                last_inserted = db.get_last_price_insertion_date(code)
                if last_inserted[0] is not None:
                    start_from = last_inserted[0] + timedelta(days=1)
                else:
                    start_from = None

                prices = get_historical_prices(code, from_date=start_from)
                for date_series, price in prices.items():
                    db.insert_price(date_series.strftime("%Y-%m-%d"), price, code)

            return {"message": "Company history updated successfully!"}
        except Exception as e:
            return {"message": str(e)}, 400

#### CLIENT FUNCTIONS

if __name__ == "__main__":
    app.run()