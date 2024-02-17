#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
from src.middleware.api_key_middleware import require_api_key
from src.models.user import Users
from src.models.budget import BudgetHistory, WeeklyBudget, Deduction
from src.utils.helper_utils import handle_api_error
from mongoengine.errors import DoesNotExist, ValidationError
from datetime import datetime


@require_api_key
def update_budget():
    try:
        data = request.get_json()
        username = data.get('username')

        # Check if either weekly_budget or deductions is provided
        if 'weekly_budget' not in data and 'deductions' not in data:
            return jsonify({"error": "Weekly budget or deductions not provided"}), 400

        try:
            user = Users.objects.get(username=username)

            budget_history = BudgetHistory.objects(user=user).first()

            if budget_history is None:
                budget_history = BudgetHistory(user=user)

            if 'weekly_budget' in data:
                try:
                    weekly_budget = float(data['weekly_budget'])
                    budget_history.weekly_budgets.append(
                        WeeklyBudget(amount=weekly_budget))
                    user.weekly_budget = weekly_budget
                except ValueError:
                    return jsonify({"error": "Invalid weekly budget format"}), 400

            if 'deductions' in data:
                deductions = data['deductions']
                if isinstance(deductions, list):
                    budget_history.deductions.extend(
                        [Deduction(amount=d) for d in deductions])
                else:
                    budget_history.deductions.append(
                        Deduction(amount=deductions))

            budget_history.change_date = datetime.now()

            # Save the updated document
            budget_history.save()
            user.save()

            return jsonify({"message": "Budget updated successfully"})
        except DoesNotExist:
            return jsonify({"error": "User not found"}), 404
        except ValidationError as e:
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        return handle_api_error(e)


@require_api_key
def get_deductions():
    try:
        data = request.get_json()
        username = data.get('username')

        user = Users.objects.get(username=username)
        budget_history = BudgetHistory.objects(user=user).first()

        if budget_history is None:
            return jsonify({"error": "No budget history found for the user"}), 404

        deductions = [{
            "amount": deduction.amount,
            "updated_at": deduction.updated_at.strftime("%Y-%m-%d %H:%M:%S") if deduction.updated_at else None
        } for deduction in budget_history.deductions]

        return jsonify({"deductions": deductions})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return handle_api_error(e)
