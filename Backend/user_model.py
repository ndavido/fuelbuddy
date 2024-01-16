import numpy as np
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

def load_saved_model(model_path):
    return load_model(model_path)

def make_prediction(model, scaler, last_weeks_data, look_back):
    last_weeks_data = np.array(last_weeks_data)
    assert last_weeks_data.shape[0] == look_back, "Input data must be a sequence with the length equal to the look-back period"
    
    last_weeks_data_scaled = scaler.transform(last_weeks_data.reshape(-1, 1))
    last_weeks_data_scaled = last_weeks_data_scaled.reshape((1, look_back, 1))
    
    predicted_price_scaled = model.predict(last_weeks_data_scaled)
    predicted_price = scaler.inverse_transform(predicted_price_scaled)

    return predicted_price[0, 0]

look_back = 8
model_path = 'Backend/user_model.h5'
model = load_saved_model(model_path)

scaler = MinMaxScaler(feature_range=(0, 1))
df = pd.read_csv('Backend/new_user_spending_data.csv')
data = df['Total_Spent_on_Fuel'].values
data = data.reshape(-1, 1)
scaler.fit(data)

last_weeks_data = np.array([55,60,69,54,85,78,90,120])
predicted_price = make_prediction(model, scaler, last_weeks_data, look_back)
print("Predicted price for next week:", predicted_price)

predicted_price = make_prediction(model, scaler, last_weeks_data, look_back)

# Ensure the prediction is within ±10 of the last week's amount
last_week_amount = last_weeks_data[-1]
predicted_price = np.clip(predicted_price, last_week_amount - 10, last_week_amount + 10)

print("Adjusted predicted price for next week:", predicted_price)