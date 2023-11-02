import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

# Load your dataset. For this example, I'll assume you have a CSV file with a 'Price' column.
# Replace 'your_dataset.csv' with your data file.
data = pd.read_csv(r"C:\Users\liamh\OneDrive\Desktop\fuel price.csv")
prices = data['Price'].values.reshape(-1, 1)

# Normalize the data using Min-Max scaling
scaler = MinMaxScaler()
prices_scaled = scaler.fit_transform(prices)

# Define a function to prepare the dataset for training
def prepare_data(data, time_steps):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:i+time_steps])
        y.append(data[i+time_steps])
    return np.array(X), np.array(y)

# Define the number of time steps (look-back window) and split the data into training and testing sets
time_steps = 10  # You can adjust this value
X, y = prepare_data(prices_scaled, time_steps)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# Create an RNN model
model = Sequential()
model.add(SimpleRNN(units=50, activation='tanh', input_shape=(time_steps, 1)))
model.add(Dense(units=1))
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=100, batch_size=32)

# Make predictions
predicted_prices = model.predict(X_test)
predicted_prices = scaler.inverse_transform(predicted_prices)
y_test = scaler.inverse_transform(y_test)

# Calculate the Mean Squared Error (MSE)
mse = mean_squared_error(y_test, predicted_prices)
print("Mean Squared Error:", mse)

# Plot the results
plt.figure(figsize=(12, 6))
plt.plot(data.index[-len(y_test):], y_test, label="Actual Prices", color='blue')
plt.plot(data.index[-len(y_test):], predicted_prices, label="Predicted Prices", color='red')
plt.xlabel('Time')
plt.ylabel('Price')
plt.legend()
plt.show()

# Save the model
model.save('Fuel_Price_Predictor.keras')  # Replace 'your_rnn_model.h5' with the path to your model file
