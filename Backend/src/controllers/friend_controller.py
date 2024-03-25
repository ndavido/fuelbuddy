from flask import Blueprint
from src.services.friend_service import send_friend_request, list_friends, respond_friend_request, cancel_friend_request, remove_friend, search_users, view_friend_profile, received_friend_requests, sent_friend_requests, friend_activity_dashboard

friend_blueprint = Blueprint('friend', __name__)

friend_blueprint.route('/send_friend_request',
                       methods=['POST'])(send_friend_request)
friend_blueprint.route('/list_friends', methods=['POST'])(list_friends)
friend_blueprint.route('/respond_friend_request',
                       methods=['POST'])(respond_friend_request)
friend_blueprint.route('/cancel_friend_request',
                       methods=['POST'])(cancel_friend_request)
friend_blueprint.route('/remove_friend', methods=['POST'])(remove_friend)
friend_blueprint.route('/search_users', methods=['GET', 'POST'])(search_users)
friend_blueprint.route('/view_friend_profile',
                       methods=['GET', 'POST'])(view_friend_profile)
friend_blueprint.route('/received_friend_requests',
                       methods=['GET', 'POST'])(received_friend_requests)
friend_blueprint.route('/sent_friend_requests',
                       methods=['GET', 'POST'])(sent_friend_requests)
friend_blueprint.route('/friend_activity_dashboard', methods=[
                       'GET', 'POST'])(friend_activity_dashboard)
