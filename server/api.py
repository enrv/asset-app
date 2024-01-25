from flask import Flask
from standalone.database import Database, UnregisteredUserOrWrongPasswordException
from hashlib import sha256
from flask import request
import os
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

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

@app.route("/api/get-clients", methods=["GET"])
@jwt_required()
# curl -i X GET -H "Content-Type: application/json" -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNjIyMDg0OCwianRpIjoiZDhiMzBjYWItYzU4NC00YjQxLTk0N2EtOGRjZTVmODBjYmEzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Impvc2Vzb3VzYTE5MjBAeWFob28uY29tIiwibmJmIjoxNzA2MjIwODQ4LCJjc3JmIjoiZmQyMzFiNDQtYzdjMC00NzIwLWJmMzctMmE5MTAxMjliMjA1IiwiZXhwIjoxNzA2MjIxNzQ4fQ.nsZ9AQD14p65pEJhQ-BF8IYFKgRcac77RbdcgmEgwUI" http://localhost:5000/api/get-clients
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
# curl -i X GET "http://localhost:5000/api/get-client-cash?email=joao.silva@gmail.com" -H "Content-Type: application/json" -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNjIyMDg0OCwianRpIjoiZDhiMzBjYWItYzU4NC00YjQxLTk0N2EtOGRjZTVmODBjYmEzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Impvc2Vzb3VzYTE5MjBAeWFob28uY29tIiwibmJmIjoxNzA2MjIwODQ4LCJjc3JmIjoiZmQyMzFiNDQtYzdjMC00NzIwLWJmMzctMmE5MTAxMjliMjA1IiwiZXhwIjoxNzA2MjIxNzQ4fQ.nsZ9AQD14p65pEJhQ-BF8IYFKgRcac77RbdcgmEgwUI"
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
# curl -i X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwNjIyMDg0OCwianRpIjoiZDhiMzBjYWItYzU4NC00YjQxLTk0N2EtOGRjZTVmODBjYmEzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Impvc2Vzb3VzYTE5MjBAeWFob28uY29tIiwibmJmIjoxNzA2MjIwODQ4LCJjc3JmIjoiZmQyMzFiNDQtYzdjMC00NzIwLWJmMzctMmE5MTAxMjliMjA1IiwiZXhwIjoxNzA2MjIxNzQ4fQ.nsZ9AQD14p65pEJhQ-BF8IYFKgRcac77RbdcgmEgwUI" -d '{"email":"joao.silva@gmail.com","cash":50.25}' http://localhost:5000/api/update-client-cash
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

if __name__ == "__main__":
    app.run()