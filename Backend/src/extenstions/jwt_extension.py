#! /usr/bin/env python3

from flask_jwt_extended import JWTManager

jwt = JWTManager()

def configure_jwt(app):
    jwt.init_app(app)