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

if __name__ == "__main__":
    app.run()