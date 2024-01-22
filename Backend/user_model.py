from keras.models import Sequential
from keras.layers import SimpleRNN, Dense
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
import numpy as np
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

# Define the model path and look_back period
look_back = 4
model_path = 'Backend/user_model.h5'

# Load the pre-trained model
model = load_saved_model(model_path)

# Initialize the scaler
scaler = MinMaxScaler(feature_range=(0, 1))
df = pd.read_csv('Backend/new_user_spending_data.csv')
data = df['Total'].values.reshape(-1, 1)
scaler.fit(data)

# Input data for the prediction
last_weeks_data = np.array([80,70,100,120])

# Make the prediction
predicted_price = make_prediction(model, scaler, last_weeks_data, look_back)
print("Next Week's Predicted Price is: ", predicted_price)

