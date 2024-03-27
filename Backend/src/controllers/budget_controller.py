#! /usr/bin/env python3

from flask import Blueprint
from src.services.budget_service import update_budget, get_deductions, reset_weekly_budgets, update_user_deduction, save_weekly_data

budget_blueprint = Blueprint('budget', __name__)
budget_blueprint.route(
    '/update_budget', methods=['POST'])(update_budget)
budget_blueprint.route(
    '/get_deductions', methods=['POST'])(get_deductions)
budget_blueprint.route(
    '/reset_weekly_budgets', methods=['POST'])(reset_weekly_budgets)
budget_blueprint.route(
    '/update_user_deduction', methods=['POST'])(update_user_deduction)
budget_blueprint.route(
    '/save_weekly_data', methods=['POST'])(save_weekly_data)


