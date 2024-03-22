#! /usr/bin/env python3

from flask import Blueprint

from src.services.user_admin_support_service import view_all_users, update_role

user_admin_support_blueprint = Blueprint('user_admin_support', __name__)

user_admin_support_blueprint.route(
    '/view_all_users', methods=['GET'])(view_all_users)
user_admin_support_blueprint.route(
    '/update_role', methods=['POST'])(update_role)
