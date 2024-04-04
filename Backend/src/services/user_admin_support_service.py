#! /usr/bin/env python3

from flask import request, jsonify
from ..models import Users, SupportTicket, Message
from ..middleware import require_api_key
from ..utils import handle_api_error
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime


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

        user = Users.objects(id=user_id).only(
            'id', 'username', 'roles').first()
        user.roles.append(role)
        user.save()

        return jsonify({"message": "Role updated successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def remove_role():
    try:
        user_id = get_jwt_identity()

        admin = Users.objects(id=user_id).first()
        if "admin" not in admin.roles and "Developer" not in admin.roles:
            return jsonify({"error": "Unauthorized access"}), 401

        data = request.get_json()

        user_id = data["user_id"]
        role = data["role"]

        user = Users.objects(id=user_id).only(
            'id', 'username', 'roles').first()
        if role in user.roles:
            user.roles.remove(role)
            user.save()

        return jsonify({"message": "Role removed successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def send_support_ticket():
    user_id = get_jwt_identity()
    data = request.get_json()
    message = data["message"]
    try:
        user = Users.objects(id=user_id).first()

        ticket = SupportTicket(user=user)
        ticket.messages.append(Message(sender="user", content=message))
        ticket.save()

        return jsonify({"message": "Support ticket sent successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def view_support_tickets():
    user_id = get_jwt_identity()
    try:
        user = Users.objects(id=user_id).first()

        if "admin" in user.roles or "Developer" in user.roles:
            tickets = SupportTicket.objects(is_open=True)
            tickets_data = [ticket.to_json() for ticket in tickets]
        else:
            tickets = SupportTicket.objects(
                is_open=True, user=user).order_by("-last_updated")
            tickets_data = [{
                'id': str(ticket.id),
                'messages': [{'sender': msg.sender, 'content': msg.content, 'timestamp': msg.timestamp} for msg in ticket.messages],
                'is_open': ticket.is_open,
                'is_solved': ticket.is_solved,
                'last_updated': ticket.last_updated
            } for ticket in tickets]

        return jsonify({"tickets": tickets_data}), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def reply_to_ticket():
    user_id = get_jwt_identity()
    data = request.get_json()
    ticket_id = data["ticket_id"]
    message = data["message"]
    try:
        user = Users.objects(id=user_id).first()
        if "admin" in user.roles or "Developer" in user.roles:
            ticket = SupportTicket.objects(id=ticket_id).first()
            ticket.messages.append(Message(sender="admin", content=message))
            ticket.last_updated = datetime.utcnow()
            ticket.save()
        else:
            ticket = SupportTicket.objects(id=ticket_id).first()
            ticket.messages.append(Message(sender="user", content=message))
            ticket.last_updated = datetime.utcnow()
            ticket.save()

        return jsonify({"message": "Reply sent successfully"}), 200

    except Exception as e:
        return handle_api_error(e)

#! Function for Admins ONLY!!!


@require_api_key
@jwt_required()
def close_support_ticket():
    user_id = get_jwt_identity()
    data = request.get_json()
    ticket_id = data["ticket_id"]
    try:
        user = Users.objects(id=user_id).first()
        if "admin" not in user.roles or "Developer" not in user.roles:
            return jsonify({"error": "Unauthorized access"}), 401

        ticket = SupportTicket.objects(id=ticket_id).first()
        ticket.is_open = False
        ticket.last_updated = datetime.utcnow()
        ticket.save()

        return jsonify({"message": "Ticket closed successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def mark_ticket_as_solved():
    data = request.get_json()
    ticket_id = data["ticket_id"]
    try:
        ticket = SupportTicket.objects(id=ticket_id).first()
        ticket.is_solved = True
        ticket.last_updated = datetime.utcnow()
        ticket.save()

        return jsonify({"message": "Ticket marked as solved"}), 200

    except Exception as e:
        print("Error occurred:", e)
        return handle_api_error(e)
