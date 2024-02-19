#! /usr/bin/env python3

from flask import Flask
from flask_cors import CORS, cross_origin
# # from .controllers import *
# # from .middleware import *
# from .models import *
# from .services import *
from src.config import API_KEY, JWT_SECRET_KEY
from src.extenstions.db_connection import db_connect
from src.extenstions.jwt_extension import configure_jwt
from src.controllers.auth_controller import auth_blueprint
from src.controllers.account_controller import account_blueprint
from src.controllers.budget_controller import budget_blueprint
from src.controllers.fuel_station_controller import fuel_station_blueprint
from src.controllers.friend_controller import friend_blueprint


app = Flask(__name__)

CORS(app, resources={
    r"/*": {"origins": "http://localhost:19006"}}, supports_credentials=True)

app.secret_key = "production"  # os.random(24)
api_key = API_KEY
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

app.register_blueprint(auth_blueprint)
app.register_blueprint(account_blueprint)
app.register_blueprint(budget_blueprint)
app.register_blueprint(fuel_station_blueprint)
app.register_blueprint(friend_blueprint)

configure_jwt(app)

db_connect()
