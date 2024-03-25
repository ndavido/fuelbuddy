# account_service.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from mongoengine import Q
from src.middleware.api_key_middleware import require_api_key
from src.utils.encryption_utils import aes_decrypt, aes_encrypt, encryption_key
from src.utils.image_utils import upload_image
from src.models.user import Users
from src.models.friends import Friends, FriendRequest
from src.models.budget import BudgetHistory, WeeklyBudgetHistory
from src.models.fuel_station import FavoriteFuelStation


from src.utils.helper_utils import handle_api_error


@require_api_key
@jwt_required()
def account():
    try:
        user_id = get_jwt_identity()
        user_info = Users.objects(id=user_id).first()

        if user_info:
            user_info_dict = user_info.to_mongo().to_dict()
            decrypted_phone = aes_decrypt(
                user_info_dict['phone_number'], encryption_key)
            user_info_dict['phone_number'] = decrypted_phone

            excluded_fields = ['_id', 'verification_code',
                               'verified', 'verification_code_sent_at', 'updated_at']
            for field in excluded_fields:
                user_info_dict.pop(field, None)

            return jsonify({"message": "User found", "user": user_info_dict}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error fetching user account information: {str(e)}"}), 500


@require_api_key
@jwt_required()
def delete_account():
    try:
        user_id = get_jwt_identity()
        user_info = Users.objects(id=user_id).first()

        if user_info:
            # Deleting Friends
            Friends.objects(Q(user1=user_info) | Q(user2=user_info)).delete()
            # Deleting Friend Requests
            FriendRequest.objects(Q(sender=user_info) |
                                  Q(recipient=user_info)).delete()
            # Delete budget history
            BudgetHistory.objects(user=user_info).delete()
            # Delete weekly budget history
            WeeklyBudgetHistory.objects(user=user_info).delete()
            # Delete favorite fuel stations
            FavoriteFuelStation.objects(user=user_info).delete()

            user_info.delete()
            return jsonify({"message": "Account deleted successfully!"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred while deleting the account: {str(e)}"}), 500


@require_api_key
@jwt_required()
def logout():
    return jsonify({"message": "Logout successful!"}), 200


@require_api_key
@jwt_required()
def edit_account():
    try:
        user_id = get_jwt_identity()
        user = Users.objects(id=user_id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()

        if 'phone_number' in data:
            encrypted_phone = aes_encrypt(data['phone_number'], encryption_key)
            user.phone_number = encrypted_phone
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'surname' in data:
            user.surname = data['surname']
        if 'email' in data:
            user.email = data['email']
        if 'reg_full' in data:
            user.reg_full = data['reg_full']

        user.save()
        return jsonify({"message": "Account updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@require_api_key
@jwt_required()
def upload_profile_picture():
    try:
        user_id = get_jwt_identity()
        user = Users.objects(id=user_id).first()

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()

        if 'profile_picture' not in data:
            return jsonify({"error": "No profile picture provided"}), 400

        profile_picture = upload_image(data['profile_picture'])

        user.profile_picture = profile_picture

        user.save()
        return jsonify({"message": "Profile picture updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
