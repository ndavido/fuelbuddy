#! /usr/bin/env python3

from flask import Blueprint
from ..services import register, verify, login, login_verify

auth_blueprint = Blueprint('auth', __name__)

auth_blueprint.route('/register', methods=['POST'])(register)
auth_blueprint.route('/register/verify', methods=['POST'])(verify)
auth_blueprint.route('/login', methods=['POST'])(login)
auth_blueprint.route('/login/verify', methods=['POST'])(login_verify)
