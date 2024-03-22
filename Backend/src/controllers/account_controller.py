#! /usr/bin/env python3

from flask import Blueprint
from src.services.account_service import account, delete_account, edit_account, logout, upload_profile_picture

account_blueprint = Blueprint('account', __name__)

account_blueprint.route('/account', methods=['POST'])(account)
account_blueprint.route('/delete_account', methods=['POST'])(delete_account)
account_blueprint.route('/edit_account', methods=['PATCH'])(edit_account)
account_blueprint.route('/logout', methods=['POST'])(logout)
account_blueprint.route('/upload_profile_picture',
                        methods=['POST'])(upload_profile_picture)
