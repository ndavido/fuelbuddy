#! /usr/bin/env python3

from flask import request, jsonify
from mongoengine.errors import DoesNotExist
from mongoengine.queryset.visitor import Q
from src.models import Users, FriendRequest, Friends, Notification
from src.middleware.api_key_middleware import require_api_key
from src.utils.helper_utils import handle_api_error
from flask_jwt_extended import jwt_required, get_jwt_identity


@require_api_key
def send_friend_request():
    try:
        data = request.get_json()
        current_user = data['phone_number']
        recipient_user = data['friend_number']
        message = data.get('message', '')

        print("Current User:", current_user)
        print("Recipient User:", recipient_user)

        sender = Users.objects.get(phone_number=current_user)
        recipient = Users.objects.get(phone_number=recipient_user)

        if not recipient:
            return jsonify({"error": "Recipient not found"}), 404

        existing_request = FriendRequest.objects(
            sender=sender, recipient=recipient).first()
        if existing_request:
            return jsonify({"error": "Friend request already sent"}), 400

        print("Sender:", sender)
        print("Recipient:", recipient)
        print(existing_request)

        friend_request = FriendRequest(
            sender=sender,
            recipient=recipient,
            message=message,
            status='pending'
        )
        friend_request.save()

        return jsonify({"message": "Friend request sent successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


# ! This route is for displaying user's friends
@require_api_key
def list_friends():
    try:
        data = request.get_json()
        current_user = data['phone_number']

        print("Current User:", current_user)

        sender = Users.objects.get(phone_number=current_user)

        print(sender)

        friends = Friends.objects(Q(user1=sender) | Q(user2=sender))

        friends_list = []
        for friend in friends:
            friend_user = friend.user1 if friend.user2.id == sender.id else friend.user2
            friends_list.append({
                'friend_id': str(friend_user.id),
                'friend_name': friend_user.full_name
            })

        return jsonify({"friends": friends_list}), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
def requested_friends():
    try:
        data = request.get_json()
        current_user = data['phone_number']

        print("Current User:", current_user)

        recipient = Users.objects.get(phone_number=current_user)

        print(recipient)

        # Only include friend requests that are not accepted
        friend_requests = FriendRequest.objects(
            recipient=recipient, status='pending')

        requested_friends_list = []
        for friend_request in friend_requests:
            requested_friend_user = friend_request.sender
            requested_friends_list.append({
                'friend_id': str(requested_friend_user.id),
                'friend_name': requested_friend_user.full_name,
                'request_id': str(friend_request.id),  # Include the request_id
            })

        return jsonify({"requested_friends": requested_friends_list}), 200

    except Exception as e:
        return handle_api_error(e)


# ! This route is for accepting or rejecting friend requests
@require_api_key
def respond_friend_request():
    try:
        data = request.get_json()
        current_user = data['phone_number']
        request_id = data['request_id']
        action = data['action']

        print("Current User:", current_user)
        print("Request ID:", request_id)
        print("Action:", action)

        if action not in ['accept', 'reject']:
            return jsonify({"error": "Invalid action"}), 400

        friend_request = FriendRequest.objects.get(id=request_id)

        if friend_request.recipient.phone_number != current_user:
            return jsonify({"error": "Unauthorized action"}), 403

        if action == 'accept':
            friend_request.change_status('accepted')
            Friends(
                user1=friend_request.sender,
                user2=friend_request.recipient
            ).save()

            Notification(
                user=friend_request.sender,
                message=f"Your friend request to {friend_request.recipient.full_name} has been accepted.",
                type='friend_request_accepted',
                related_document=friend_request
            ).save()

            message = "Friend request accepted"
        else:
            friend_request.change_status('rejected')

            Notification(
                user=friend_request.sender,
                message=f"Your friend request to {friend_request.recipient.full_name} has been rejected.",
                type='friend_request_rejected',
                related_document=friend_request
            ).save()

            message = "Friend request rejected"

        return jsonify({"message": message}), 200

    except DoesNotExist:
        return jsonify({"error": "Friend request not found"}), 404
    except Exception as e:
        return handle_api_error(e)

# ! This route is for canceling friend requests


@require_api_key
@jwt_required()
def cancel_friend_request():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        request_id = data['request_id']

        friend_request = FriendRequest.objects.get(id=request_id)

        if friend_request.sender.id != current_user_id:
            return jsonify({"error": "Unauthorized action"}), 403

        friend_request.update(status='canceled')

        Notification(
            user=friend_request.recipient,
            message=f"Friend request from {friend_request.sender.full_name} has been canceled",
            type='friend_request_canceled',
            related_document=friend_request
        ).save()

        return jsonify({"message": "Friend request canceled"}), 200

    except Exception as e:
        return handle_api_error(e)


# ! This route is for removing friends
@require_api_key
@jwt_required()
def remove_friend():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        friend_id = data['friend_id']

        current_user = Users.objects.get(id=current_user_id)
        friend_user = Users.objects.get(id=friend_id)

        if not friend_user:
            return jsonify({"error": "Friend not found"}), 404

        friendship = Friends.objects(
            (Q(user1=current_user) & Q(user2=friend_user)) |
            (Q(user1=friend_user) & Q(user2=current_user))
        ).first()

        if not friendship:
            return jsonify({"error": "Friendship does not exist"}), 404

        friendship.delete()

        return jsonify({"message": "Friend removed successfully"}), 200

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return handle_api_error(e)


#! This route is for searching friends
@require_api_key
def search_users():
    try:
        data = request.get_json()
        phone_number = data.get('phone_number')
        search_term = data.get('search_term')

        if not search_term:
            return jsonify({"error": "Search term is required"}), 400

        # Exclude the current user and search for others
        users = Users.objects(
            (Q(username__icontains=search_term) | Q(phone_number__icontains=search_term)) &
            Q(phone_number__ne=phone_number)
        )

        users_list = [{'user_id': str(user.id), 'username': user.username, 'phone_number': user.phone_number}
                      for user in users]

        return jsonify({"users": users_list}), 200

    except Exception as e:
        return handle_api_error(e)
