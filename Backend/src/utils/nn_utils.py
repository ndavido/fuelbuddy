#! /usr/bin/env python3

import numpy as np


def load_saved_model(model_path):
    from keras.models import load_model
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
