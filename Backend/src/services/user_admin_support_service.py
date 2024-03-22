#! /usr/bin/env python3

from flask import request, jsonify
from src.models import Users
from src.middleware.api_key_middleware import require_api_key
from src.utils.helper_utils import handle_api_error
from flask_jwt_extended import jwt_required, get_jwt_identity


@require_api_key
@jwt_required()
def view_all_users():
    try:
        user_id = get_jwt_identity()

        admin = Users.objects(id=user_id).first()
        if "admin" not in admin.roles and "Developer" not in admin.roles:
            return jsonify({"error": "Unauthorized access"}), 401

        users = Users.objects.only('id', 'username', 'roles')

        users_json = [user.to_json() for user in users]
        return jsonify(users_json), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def update_role():
    try:
        user_id = get_jwt_identity()

        admin = Users.objects(id=user_id).first()
        if "admin" not in admin.roles and "Developer" not in admin.roles:
            return jsonify({"error": "Unauthorized access"}), 401

        data = request.get_json()

        user_id = data["user_id"]
        role = data["role"]

        user = Users.objects(id=user_id).first()
        user.roles.append(role)
        user.save()

        return jsonify({"message": "Role updated successfully"}), 200

    except Exception as e:
        return handle_api_error(e)
