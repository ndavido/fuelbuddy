#! /usr/bin/python3
# From System
import io
import os
# Flask Related Imports
from flask import Flask, request, jsonify, abort, current_app
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

# Database Related Imports
from database import Database
from models import FuelStation, Location, Users, FuelPrices, BudgetHistory, FriendRequest, Friends, Notification, \
    ChargingStation, EVPrices, Trip, PetrolPrices, DieselPrices, FavoriteFuelStation, Deduction, WeeklyBudget
from mongoengine.queryset.visitor import Q
from mongoengine.errors import DoesNotExist, ValidationError

# Ecryption Related Imports
import binascii
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import bcrypt

# Twilio Related Imports
from twilio.rest import Client
import random
from datetime import datetime
from functools import wraps
import re


import numpy as np
from sklearn.preprocessing import MinMaxScaler
import pandas as pd



'''
Trip Routes
consists of the following routes: save_trip, user_suggested_budget
'''

#! This route is for saving trips


@app.route('/save_trip', methods=['POST'])
@require_api_key
@jwt_required()
def save_trip():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        start_lat = data.get('start_latitude')
        start_long = data.get('start_longitude')
        end_lat = data.get('end_latitude')
        end_long = data.get('end_longitude')
        distance = data.get('distance')

        # Validate required fields
        if not all([start_lat, start_long, end_lat, end_long, distance]):
            return jsonify({"error": "Missing required trip data"}), 400

        # Create Location instances for start and end points
        start_location = Location(
            latitude=start_lat, longitude=start_long).save()
        end_location = Location(latitude=end_lat, longitude=end_long).save()

        # Create and save the trip
        new_trip = Trip(
            user=Users.objects.get(id=current_user_id),
            start_location=start_location,
            end_location=end_location,
            distance=distance
        ).save()

        return jsonify({"message": "Trip saved successfully"}), 200

    except Exception as e:
        return handle_api_error(e)


@app.route('/user_suggested_budget', methods=['POST'])
@require_api_key
def user_suggested_budget():
    from keras.models import load_model

    def load_saved_model(model_path):
        return load_model(model_path)

# Define the make_prediction function
    def make_prediction(model, scaler, last_weeks_data, look_back):
        # Reshape and scale the input data
        last_weeks_data = np.array(last_weeks_data).reshape(-1, 1)
        last_weeks_data_scaled = scaler.transform(last_weeks_data)
        last_weeks_data_scaled = last_weeks_data_scaled.reshape(
            1, look_back, 1)

        # Make the prediction
        predicted_price = model.predict(last_weeks_data_scaled)
        predicted_price = scaler.inverse_transform(predicted_price)
        return predicted_price[0][0]

    # Define the model path and look_back period
    look_back = 10
    model_path = 'Backend/Updated_user_model.h5'

    # Load the pre-trained model
    model = load_saved_model(model_path)

    # Initialize the scaler
    scaler = MinMaxScaler(feature_range=(0, 1))
    df = pd.read_csv('Backend/unseen_spending_data.csv')
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


'''
OCR Routes
consists of the following routes: ocr_uploaded_image
'''

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}


def extract_receipt_info_single(receipt_text):
    import re
    from fuzzywuzzy import process
    # Convert all text to lowercase to simplify matching
    text_lower = receipt_text.lower()

    # Initialize the result dictionary
    info = {
        'fuel_type': None,
        'volume': None,
        'price_per_litre': None,
        'total': None
    }

    # https://stackoverflow.com/questions/1547574/regex-for-prices
    volume_pattern = r"(?i)(?:volume|;|:|diesel|unleaded|pump\s*([a-z]|[0-9])|\))\s*(\d+(?:[.,]\d{2}))\s*°?\s*(ltr|l|net)?"

    price_per_litre_pattern = r"(?:price|€)\s*([1-9][.,]\d{3})\s*(eur/l|/l|/)?\s*"

    # Define fuel type choices for fuzzy matching
    fuel_type_choices = ["unleaded", "diesel"]

    # Search for fuel type with fuzzy match
    fuel_type_match = process.extractOne(
        text_lower, fuel_type_choices, score_cutoff=50)
    if fuel_type_match:
        info['fuel_type'] = fuel_type_match[0]

    # Search for volume
    volume_match = re.search(volume_pattern, text_lower)
    if volume_match:
        info['volume'] = next((m for m in volume_match.groups() if m), None)
        if info['volume'] is not None:
            info['volume'] = info['volume'].replace(',', '.')

    # Search for price per litre
    price_per_litre_match = re.search(price_per_litre_pattern, text_lower)
    if price_per_litre_match:
        info['price_per_litre'] = next(
            (m for m in price_per_litre_match.groups() if m), None)
        if info['price_per_litre'] is not None:
            info['price_per_litre'] = info['price_per_litre'].replace(',', '.')

    if info['volume'] is not None and info['price_per_litre'] is not None:
        total = float(info['volume']) * float(info['price_per_litre'])
        total = round(total, 2)
        info['total'] = total
    else:
        info['total'] = None

    return info


@app.route('/ocr_uploaded_image', methods=['POST'])
def upload_file():
    import cv2
    import numpy as np
    import pytesseract

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        try:
            # Read the file's content into a numpy array
            in_memory_file = io.BytesIO()
            file.save(in_memory_file)
            data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
            image = cv2.imdecode(data, cv2.IMREAD_COLOR)

            # Process the image
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.threshold(
                image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            text = pytesseract.image_to_string(image)
            filtered_text = '\n'.join(
                line for line in text.split('\n') if line.strip() != '')

            extracted_info_single = extract_receipt_info_single(filtered_text)

            return jsonify(extracted_info_single)
        except Exception as e:
            # Handle general exceptions
            return jsonify({'error': 'Failed to process image', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400


if __name__ == '__main__':
    app.run(debug=True)
