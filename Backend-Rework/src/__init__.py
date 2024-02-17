#! /usr/bin/env python3

from flask import Flask
from flask_cors import CORS, cross_origin
# # from .controllers import *
# # from .middleware import *
# from .models import *
# from .services import *
from src.config import API_KEY, JWT_SECRET_KEY, MONGO_DB_NAME, MONGO_URI
from mongoengine import connect
from src.extenstions.jwt_extension import configure_jwt
from src.controllers.auth_controller import auth_blueprint


app = Flask(__name__)

CORS(app, resources={
    r"/*": {"origins": "http://localhost:19006"}}, supports_credentials=True)

app.secret_key = "production"  # os.random(24)
api_key = API_KEY
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

app.register_blueprint(auth_blueprint)


configure_jwt(app)

connect(
    db=MONGO_DB_NAME,
    host=MONGO_URI,
    alias='default'
)