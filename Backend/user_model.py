import numpy as np
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import pandas as pd
from models import BudgetHistory, Users
import database

# Define the load_saved_model function


def load_saved_model(model_path):
    # Load and return the model
    return load_model(model_path)

# Define the make_prediction function


def make_prediction(model, scaler, last_weeks_data, look_back):
    # Get the last week's data
    last_weeks_data = np.array(last_weeks_data).reshape(-1, look_back, 1)

    # Make the prediction
    predicted_price = model.predict(last_weeks_data)

    # Inverse transform the prediction
    predicted_price = scaler.inverse_transform(predicted_price)

    return predicted_price

# Define the rounding function
def round_to_nearest_10(predicted_price):
    # Round the predicted price to the nearest 10
    adjusted_predicted_price = round(predicted_price / 10) * 10
    return adjusted_predicted_price

# Load the pre-trained model and initialize the scaler
look_back = 10
model = load_saved_model('Backend/Updated_user_model.h5')
scaler = MinMaxScaler(feature_range=(0, 1))

# Fetch user and budget history
user = Users.objects(username='ndavido').first()

if user:
    print('User found:', user.username)
    user_budget_history = BudgetHistory.objects(user=user).first()

    if user_budget_history and user_budget_history.weekly_budgets:
        # Extract the 'amount' from each weekly budget entry
        weekly_budgets_amounts = [wb['amount'] for wb in user_budget_history.weekly_budgets]
        
        # If there are fewer entries than the look_back, pad the list with zeros
        if len(weekly_budgets_amounts) < look_back:
            weekly_budgets_amounts = [0] * (look_back - len(weekly_budgets_amounts)) + weekly_budgets_amounts
        
        # Select the last 'look_back' number of amounts
        last_weeks_data = weekly_budgets_amounts[-look_back:]
        
        # Scale the data
        last_weeks_scaled = scaler.fit_transform(np.array(last_weeks_data).reshape(-1, 1))
        
        # Make the prediction
        predicted_price = make_prediction(model, scaler, last_weeks_scaled, look_back)
        
        # Adjust the prediction to the nearest 10
        adjusted_predicted_price = round_to_nearest_10(predicted_price[0][0])

        print("Next Week's Predicted Price is: ", predicted_price[0][0])
        print("Adjusted Predicted Price to the nearest 10 is: ", adjusted_predicted_price)
    else:
        print('No weekly budgets found for user')
else:
    print('User not found')

