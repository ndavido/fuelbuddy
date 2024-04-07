#! /usr/bin/env python3

from flask import Blueprint
from ..services import account, delete_account, edit_account, logout, upload_profile_picture, load_profile_picture, complete_registration, save_preferences

account_blueprint = Blueprint('account', __name__)

account_blueprint.route('/account', methods=['POST'])(account)
account_blueprint.route('/delete_account', methods=['POST'])(delete_account)
account_blueprint.route('/edit_account', methods=['PATCH'])(edit_account)
account_blueprint.route('/logout', methods=['POST'])(logout)
account_blueprint.route('/upload_profile_picture',
                        methods=['POST'])(upload_profile_picture)
account_blueprint.route('/load_profile_picture',
                        methods=['GET'])(load_profile_picture)
account_blueprint.route('/complete_registration',
                        methods=['GET'])(complete_registration)
account_blueprint.route('/save_preferences',
                        methods=['PATCH'])(save_preferences)
