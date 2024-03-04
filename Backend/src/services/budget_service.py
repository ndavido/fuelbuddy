#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.middleware.api_key_middleware import require_api_key
from src.models.user import Users
from src.models.budget import BudgetHistory, WeeklyBudget, Deduction
from src.utils.helper_utils import handle_api_error
from src.utils.nn_utils import load_saved_model, make_prediction
from mongoengine.errors import DoesNotExist, ValidationError
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import numpy as np


@require_api_key
@jwt_required()
def update_budget():
    try:
        user_id = get_jwt_identity()  # Get user ID from JWT
        data = request.get_json()

        if 'weekly_budget' not in data and 'deductions' not in data:
            return jsonify({"error": "Weekly budget or deductions not provided"}), 400

        try:
            user = Users.objects.get(id=user_id)

            budget_history = BudgetHistory.objects(user=user).first()

            if budget_history is None:
                budget_history = BudgetHistory(user=user)

            if 'weekly_budget' in data:
                weekly_budget = float(data['weekly_budget'])
                budget_history.weekly_budgets.append(
                    WeeklyBudget(amount=weekly_budget))
                user.weekly_budget = weekly_budget

            if 'deductions' in data:
                deductions = data['deductions']
                budget_history.deductions.extend(
                    [Deduction(amount=d) for d in deductions])

            budget_history.change_date = datetime.now()

            budget_history.save()
            user.save()

            return jsonify({"message": "Budget updated successfully"})
        except (DoesNotExist, ValidationError) as e:
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def get_deductions():
    try:
        user_id = get_jwt_identity()  # Get user ID from JWT

        user = Users.objects.get(id=user_id)
        budget_history = BudgetHistory.objects(user=user).first()

        if budget_history is None:
            return jsonify({"error": "No budget history found for the user"}), 404

        deductions = [{"amount": deduction.amount, "updated_at": deduction.updated_at.strftime(
            "%Y-%m-%d %H:%M:%S") if deduction.updated_at else None} for deduction in budget_history.deductions]

        return jsonify({"deductions": deductions})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return handle_api_error(e)


@require_api_key
@jwt_required()
def user_suggested_budget():

    # Define the model path and look_back period
    look_back = 10
    model_path = 'Backend/src/neural_network/Updated_user_model.h5'

    # Load the pre-trained model
    model = load_saved_model(model_path)

    # Initialize the scaler
    scaler = MinMaxScaler(feature_range=(0, 1))
    df = pd.read_csv(
        'Backend-Rework/src/neural_network/unseen_spending_data.csv')
    data = df['Total'].values.reshape(-1, 1)
    scaler.fit(data)

    current_user = request.get_json()
    username = current_user['username']

    user_budget_history = BudgetHistory.objects(user=Users.objects(
        username=username).first()).order_by('-date_created')

    if user_budget_history:
        for budget_history in user_budget_history:
            print(budget_history.new_budget)
    else:
        print('Budget not set')

    def round_to_nearest_10(predicted_price):
        # Round the predicted price to the nearest 10
        adjusted_predicted_price = round(predicted_price / 10) * 10
        return adjusted_predicted_price

    # Get the last week's data
    last_weeks_data = [
        budget_history.new_budget for budget_history in user_budget_history][:look_back]

    # Make the prediction
    predicted_price = make_prediction(
        model, scaler, last_weeks_data, look_back)

    # Adjust the prediction to the nearest 10
    adjusted_predicted_price = round_to_nearest_10(predicted_price)

    print("Next Week's Predicted Price is: ", predicted_price)
    print("Adjusted Predicted Price to the nearest 10 is: ",
          adjusted_predicted_price)
