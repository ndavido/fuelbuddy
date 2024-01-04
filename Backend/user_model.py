import numpy as np
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

def load_saved_model(model_path):
    return load_model(model_path)

def make_prediction(model, scaler, last_weeks_data):
    # Preprocess the input data in the same way as you did for training
    last_weeks_data = scaler.transform(last_weeks_data.reshape(-1, 1))
    last_weeks_data = np.reshape(last_weeks_data, (1, last_weeks_data.shape[0], 1))

    # Make the prediction
    predicted_price_scaled = model.predict(last_weeks_data)

    # Inverse transform the predicted price
    predicted_price = scaler.inverse_transform(predicted_price_scaled)

    return predicted_price[0, 0]

# Example usage
model_path = 'Backend/user_model.h5'
model = load_saved_model(model_path)

# Assuming you have the same scaler used during training
scaler = MinMaxScaler(feature_range=(0, 1))
df = pd.read_csv('linear_weekly_fuel_budget_dataset.csv')
data = df['Weekly_Fuel_Budget'].values
data = data.reshape(-1, 1)
scaler.fit(data)

# Replace the next line with the actual last weeks' data
last_weeks_data = np.array([60.0])
predicted_price = make_prediction(model, scaler, last_weeks_data)
print("Predicted price for next week:", predicted_price)
