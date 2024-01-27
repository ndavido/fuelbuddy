import numpy as np
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

# Define the load_saved_model function
def load_saved_model(model_path):
    # Load and return the model
    return load_model(model_path)

# Define the make_prediction function
def make_prediction(model, scaler, last_weeks_data, look_back):
    # Reshape and scale the input data
    last_weeks_data = np.array(last_weeks_data).reshape(-1, 1)
    last_weeks_data_scaled = scaler.transform(last_weeks_data)
    last_weeks_data_scaled = last_weeks_data_scaled.reshape(1, look_back, 1)

    # Make the prediction
    predicted_price = model.predict(last_weeks_data_scaled)
    predicted_price = scaler.inverse_transform(predicted_price)
    return predicted_price[0][0]

# Define the round_to_nearest_10 function
def round_to_nearest_10(value):
    return round(value / 10.0) * 10

# Define the model path and look_back period
look_back = 10
model_path = 'Backend/updated_user_model.h5'

# Load the pre-trained model
model = load_saved_model(model_path)

# Initialize the scaler
scaler = MinMaxScaler(feature_range=(0, 1))
df = pd.read_csv('Backend/unseen_spending_data.csv')
data = df['Total'].values.reshape(-1, 1)
scaler.fit(data)

# Input data for the prediction
last_weeks_data = np.array([70,120,100,50.60,80,100,140,150,70,50])

# Make the prediction
predicted_price = make_prediction(model, scaler, last_weeks_data, look_back)

# Adjust the prediction to the nearest 10
adjusted_predicted_price = round_to_nearest_10(predicted_price)

print("Next Week's Predicted Price is: ", predicted_price)
print("Adjusted Predicted Price to the nearest 10 is: ", adjusted_predicted_price)

