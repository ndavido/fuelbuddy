from flask import Blueprint
from src.services.friend_service import send_friend_request, list_friends, requested_friends, respond_friend_request, cancel_friend_request, remove_friend, search_users

friend_blueprint = Blueprint('friend', __name__)

friend_blueprint.route('/send_friend_request',
                       methods=['POST'])(send_friend_request)
friend_blueprint.route('/list_friends', methods=['POST'])(list_friends)
friend_blueprint.route('/requested_friends',
                       methods=['POST'])(requested_friends)
friend_blueprint.route('/respond_friend_request',
                       methods=['POST'])(respond_friend_request)
friend_blueprint.route('/cancel_friend_request',
                       methods=['POST'])(cancel_friend_request)
friend_blueprint.route('/remove_friend', methods=['POST'])(remove_friend)
friend_blueprint.route('/search_users', methods=['GET', 'POST'])(search_users)
