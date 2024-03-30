#! /usr/bin/env python3

from flask import Flask
from flask_cors import CORS, cross_origin
from .config import API_KEY, JWT_SECRET_KEY
from .extenstions import db_connect, configure_jwt

from .controllers import auth_blueprint, account_blueprint, budget_blueprint, fuel_station_blueprint, friend_blueprint, vehicle_blueprint, ocr_blueprint, user_admin_support_blueprint
from datetime import timedelta


app = Flask(__name__)

CORS(app, resources={
    r"/*": {"origins": "http://localhost:19006"}}, supports_credentials=True)

app.secret_key = "production"  # os.random(24)
api_key = API_KEY
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=31)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=31)
app.config['JWT_COOKIE_SECURE'] = True
app.config['JWT_COOKIE_CSRF_PROTECT'] = True

app.register_blueprint(auth_blueprint)
app.register_blueprint(account_blueprint)
app.register_blueprint(budget_blueprint)
app.register_blueprint(fuel_station_blueprint)
app.register_blueprint(friend_blueprint)
app.register_blueprint(vehicle_blueprint)
app.register_blueprint(ocr_blueprint)
app.register_blueprint(user_admin_support_blueprint)

configure_jwt(app)
db_connect()
