#! /usr/bin/env python3

from flask import Blueprint
from src.services.budget_service import update_budget, get_deductions

budget_blueprint = Blueprint('budget', __name__)

budget_blueprint.route('/update_budget', methods=['POST'])(update_budget)
budget_blueprint.route('/get_deductions', methods=['POST'])(get_deductions)
