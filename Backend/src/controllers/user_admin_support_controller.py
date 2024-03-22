#! /usr/bin/env python3

from flask import Blueprint

from src.services.user_admin_support_service import view_all_users, update_role, remove_role, send_support_ticket, view_support_tickets, reply_to_ticket, close_support_ticket, mark_ticket_as_solved

user_admin_support_blueprint = Blueprint('user_admin_support', __name__)

user_admin_support_blueprint.route(
    '/view_all_users', methods=['GET'])(view_all_users)
user_admin_support_blueprint.route(
    '/update_role', methods=['POST'])(update_role)
user_admin_support_blueprint.route(
    '/remove_role', methods=['POST'])(remove_role)
user_admin_support_blueprint.route(
    '/send_support_ticket', methods=['POST'])(send_support_ticket)
user_admin_support_blueprint.route(
    '/view_support_tickets', methods=['GET'])(view_support_tickets)
user_admin_support_blueprint.route(
    '/reply_to_ticket', methods=['POST'])(reply_to_ticket)
user_admin_support_blueprint.route(
    '/mark_ticket_as_solved', methods=['POST'])(mark_ticket_as_solved)


user_admin_support_blueprint.route('/close_support_ticket', methods=['POST'])(
    close_support_ticket)  # ! Function for Admins ONLY!!!
