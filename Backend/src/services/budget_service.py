#! /usr/bin/env python3
import traceback
from decimal import Decimal
import schedule
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..middleware import require_api_key
from ..models import Users, BudgetHistory, Deduction, WeekData
from ..utils import handle_api_error, load_saved_model, make_prediction
from mongoengine.errors import DoesNotExist, ValidationError
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
import numpy as np
import json
import requests


@require_api_key
@jwt_required()
def update_budget():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        print('data', data)

        if 'weekly_budget' not in data and 'date_of_week' not in data:
            return jsonify({"error": "Weekly budget or date of week not provided"}), 400

        user = Users.objects.get(id=user_id)
        budget_history = BudgetHistory.objects(user=user).first()

        if budget_history is None:
            budget_history = BudgetHistory(user=user)

        current_date = datetime.now().date()

        if 'date_of_week' in data:
            date_of_week = datetime.strptime(
                data['date_of_week'], "%Y-%m-%d").date()
        else:
            date_of_week = current_date - \
                timedelta(days=current_date.weekday())

        if budget_history.weekly_budgets:
            last_week = budget_history.weekly_budgets[-1].date_of_week
            if (current_date - last_week).days >= 7:
                new_week_data = WeekData(
                    date_of_week=date_of_week, amount=float(data.get('weekly_budget', 0)))
                budget_history.weekly_budgets.append(new_week_data)
            else:
                if 'weekly_budget' in data:
                    if last_week == date_of_week:
                        budget_history.weekly_budgets[-1].amount = float(
                            data['weekly_budget'])
                    else:
                        new_week_data = WeekData(
                            date_of_week=date_of_week, amount=float(data['weekly_budget']))
                        budget_history.weekly_budgets.append(new_week_data)
        else:
            new_week_data = WeekData(
                date_of_week=date_of_week, amount=float(data['weekly_budget']))
            budget_history.weekly_budgets.append(new_week_data)

        # Update user's weekly budget field
        if 'weekly_budget' in data:
            user.weekly_budget = float(data['weekly_budget'])

        budget_history.change_date = datetime.now()

        budget_history.save()
        user.save()

        return jsonify({"message": "Budget updated successfully"})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        handle_api_error(e)


@require_api_key
@jwt_required()
def update_user_deduction():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if 'new_amount' not in data:
            return jsonify({"error": "New amount not provided"}), 400

        new_amount = data['new_amount']

        user = Users.objects.get(id=user_id)
        budget_history = BudgetHistory.objects(user=user).first()

        current_date = datetime.now().date()

        if budget_history.weekly_budgets:
            last_update_date = budget_history.change_date.date()
            if (current_date - last_update_date).days >= 7:
                new_week_data = WeekData(date_of_week=current_date, amount=0)
                budget_history.weekly_budgets.append(new_week_data)

        latest_week_data = budget_history.weekly_budgets[-1]

        new_deduction = Deduction(amount=new_amount, updated_at=datetime.now())
        latest_week_data.deductions.append(new_deduction)

        budget_history.change_date = datetime.now()

        budget_history.save()
        user.save()

        return jsonify({"message": "Deduction added successfully"})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        handle_api_error(e)


@require_api_key
@jwt_required()
def get_deductions():
    try:
        user_id = get_jwt_identity()
        user = Users.objects.get(id=user_id)
        budget_history = BudgetHistory.objects(user=user).first()

        if budget_history is None:
            return jsonify({"error": "No budget history found for the user"}), 404

        deductions = []
        for weekly_budget in budget_history.weekly_budgets:
            for deduction in weekly_budget.deductions:
                deductions.append({
                    "amount": deduction.amount,
                    "updated_at": deduction.updated_at.strftime("%Y-%m-%d %H:%M:%S") if deduction.updated_at else None
                })

        return jsonify({"deductions": deductions})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        handle_api_error(e)


@require_api_key
@jwt_required()
def get_past_budgets():
    try:
        user_id = get_jwt_identity()
        user = Users.objects.get(id=user_id)
        budget_history = BudgetHistory.objects(
            user=user).order_by('-id').first()

        if budget_history is None:
            return jsonify({"error": "No budget history found for the user"}), 404

        past_budgets = [{
            "date_of_week": week.date_of_week.strftime("%b %d"),
            "amount": week.amount
        } for week in budget_history.weekly_budgets]

        return jsonify({"past_budgets": past_budgets})

    except DoesNotExist:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        handle_api_error(e)


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


# Budget Reset


def reset_weekly_budgets():
    users = Users.objects()

    for user in users:
        user.weekly_budget = None
        user.save()

    print("Weekly budgets reset successfully.")

# @require_api_key
# @jwt_required()
# def user_suggested_budget():
#     current_user = request.get_json()
#     username = current_user['username']
#
#     user_budget_history = BudgetHistory.objects(user=Users.objects(username=username).first()).order_by('-date_created')
#
#     if not user_budget_history:
#         return jsonify({"error": "Budget not set"}), 404
#
#     last_weeks_data = [budget_history.new_budget for budget_history in user_budget_history][:10]
#
#     data_for_prediction = [last_weeks_data]
#
#     # Get REST URL
#     model_name = 'model_tf_serving_1709861331'
#     url = get_rest_url(model_name)
#
#     # Make REST API request
#     response = rest_request(data_for_prediction, url)
#
#     if response.status_code == 200:
#         # Process the response from your model
#         prediction = response.json()
#         # Extract and use your prediction result
#         predicted_budget = prediction['predictions'][0]  # Adjust based on your model's response structure
#
#         # Further logic to use predicted_budget...
#         return jsonify({"predicted_budget": predicted_budget})
#     else:
#         return jsonify({"error": "Failed to get prediction from the model"}), response.status_code
#
# def get_rest_url(model_name, host='ec2-54-81-41-60.compute-1.amazonaws.com', port='8505', verb='predict'):
#      url = 'http://{0}:{1}/v1/models/{2}:predict'.format(host,port,model_name)
#
#      return url
#
# def rest_request(data, url):
#     payload = json.dumps({'instances': data})
#     response = requests.post(url=url, data=payload)
#     return response
#
# def round_to_nearest_10(predicted_price):
#     return round(predicted_price / 10) * 10
#
# def extract_predicted_price(prediction_result):
#     predicted_price = prediction_result['predictions'][0]
#     return predicted_price
