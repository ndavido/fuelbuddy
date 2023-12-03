import pandas as pd
import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

np.random.seed(0)


def main():
    # Main Execution
    time_step = 5  # Experiment with different time steps
    (X_train, X_test, y_train, y_test), scaler, df = preprocess_data(
        'fuelbuddy_user_spending.csv', 'Total', time_step)
    model = create_model(time_step)
    trained_model = train_model(model, X_train, y_train)

    # Invert normalization for actual RMSE calculation
    y_train_inv = scaler.inverse_transform([y_train])
    y_test_inv = scaler.inverse_transform([y_test])

    train_predict = make_predictions(trained_model, X_train, scaler)
    test_predict = make_predictions(trained_model, X_test, scaler)

    train_rmse = evaluate_performance(y_train_inv[0], train_predict[:, 0])
    test_rmse = evaluate_performance(y_test_inv[0], test_predict[:, 0])
    print(f'Train RMSE: {train_rmse}, Test RMSE: {test_rmse}')

    # Predict next week's expenditure
    last_weeks_data = scaler.transform(
        df['Total'].values[-time_step:].reshape(-1, 1))
    next_week_expenditure = predict_next_week(
        trained_model, last_weeks_data, scaler)
    print(f"Predicted expenditure for next week: {next_week_expenditure}")
    print(f"Actual expenditure for next week: {df['Total'].values[-1]}")
    print(
        f"Accuracy: {accuracy(next_week_expenditure, df['Total'].values[-1])}")

# Data Preprocessing Function


def preprocess_data(filename, target_column, time_step):
    df = pd.read_csv(filename)
    data = df[target_column].values
    data = data.reshape(-1, 1)
    scaler = StandardScaler()  # Switched to StandardScaler
    data_normalized = scaler.fit_transform(data)

    # Convert to supervised learning format
    X, y = create_dataset(data_normalized, time_step)
    X = X.reshape(X.shape[0], X.shape[1], 1)  # Reshape for LSTM
    return train_test_split(X, y, test_size=0.2, random_state=42,), scaler, df

# Create Dataset Function


def create_dataset(dataset, time_step=1):
    dataX, dataY = [], []
    for i in range(len(dataset) - time_step - 1):
        a = dataset[i:(i + time_step), 0]
        dataX.append(a)
        dataY.append(dataset[i + time_step, 0])
    return np.array(dataX), np.array(dataY)

# Model Creation Function


def create_model(time_step):
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(time_step, 1)))
    model.add(Dropout(0.2))  # Added dropout layer
    model.add(LSTM(50, return_sequences=False))
    model.add(Dense(25, activation='relu'))
    model.add(Dense(1))
    model.compile(Adam(learning_rate=0.01), loss='mean_squared_error')
    return model

# Model Training Function


def train_model(model, X_train, y_train):
    model.fit(X_train, y_train, batch_size=32, epochs=150)  # Increased epochs
    return model

# Prediction Function


def make_predictions(model, X, scaler):
    predictions = model.predict(X)
    predictions = scaler.inverse_transform(predictions)
    return predictions

# Performance Evaluation Function


def evaluate_performance(y_true, predictions):
    return np.sqrt(mean_squared_error(y_true, predictions))

# Predict Next Week's Expenditure Function


def predict_next_week(model, last_weeks_data, scaler):
    last_weeks_data = last_weeks_data.reshape((1, len(last_weeks_data), 1))
    prediction = model.predict(last_weeks_data)
    return scaler.inverse_transform(prediction)[0][0]


def accuracy(predictions, actual):
    return np.mean(np.abs(predictions - actual) / actual) * 100


main()
