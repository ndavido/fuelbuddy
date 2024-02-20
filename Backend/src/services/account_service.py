#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
from src.middleware.api_key_middleware import require_api_key
from src.utils.encryption_utils import aes_decrypt, aes_encrypt, encryption_key
from src.models.user import Users
from src.utils.helper_utils import handle_api_error


@require_api_key
def account():
    try:
        data = request.get_json()
        encrypted_phone = data.get('phone_number')

        print("Encrypted Phone Number:", encrypted_phone)

        if not encrypted_phone:
            return jsonify({"error": "Phone number not provided"}), 400

        try:
            decrypted_phone = aes_decrypt(encrypted_phone, encryption_key)
            print("Decrypted Phone Number:", decrypted_phone)
        except Exception as e:
            return jsonify({"error": f"Error decrypting phone number: {str(e)}"}), 500

        user_info = Users.objects(phone_number=encrypted_phone).first()

        if user_info:
            # Convert the user_info to a Python dictionary
            user_info_dict = user_info.to_mongo().to_dict()

            # Replace the encrypted phone number with the decrypted one
            user_info_dict['phone_number'] = decrypted_phone

            # Exclude some fields from the response if needed
            excluded_fields = ['_id', 'verification_code',
                               'verified', 'login_code', 'updated_at']
            for field in excluded_fields:
                user_info_dict.pop(field, None)

            return jsonify({"message": "User found", "user": user_info_dict}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": f"Error fetching user account information: {str(e)}"}), 500


@require_api_key
def delete_account():
    try:
        data = request.get_json()
        encrypted_phone = data.get('phone_number')

        if not encrypted_phone:
            return jsonify({"error": "Phone number not provided"}), 400

        user_info = Users.objects(phone_number=encrypted_phone).first()

        if user_info:
            user_info.delete()
            return jsonify({"message": "Account deleted successfully!"})
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return handle_api_error(e)


@require_api_key
def logout():
    try:
        return jsonify({"message": "Logout successful!"})
    except Exception as e:
        return handle_api_error(e)


# TODO Fix standardising phone number/ hashing phone number
@require_api_key
def edit_account():
    try:
        data = request.get_json()
        username = data.get('username')

        user = Users.objects(username=username).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        if 'phone_number' in data:
            decrypted_phone = aes_encrypt(data['phone_number'], encryption_key)
            user.phone_number = decrypted_phone

        # Update user fields if they are in the request
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            user.email = data['email']

        user.save()

        return jsonify({"message": "Account updated successfully"}), 200

    except Exception as e:
        return handle_api_error(e)
