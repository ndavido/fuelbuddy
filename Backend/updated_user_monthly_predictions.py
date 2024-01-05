import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error, mean_absolute_error
from math import sqrt
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Dense, LSTM, Bidirectional
from keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error
from math import sqrt


def main():
    file_path = 'fuel_prices_reversed.csv'
    column_name = 'Fuel Price'

    data, scaler = load_and_preprocess_data(file_path, column_name)
    X, y = prepare_data_for_lstm(data)
    X_train, X_test, y_train, y_test = split_data(X, y)

    # Reshape input to be [samples, time steps, features]
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    model = build_bilstm_model((X_train.shape[1], 1))
    train_and_evaluate_model(model, X_train, y_train, X_test, y_test)
    save_model(model)


def load_and_preprocess_data(file_path, column_name):
    # Load data
    df = pd.read_csv(file_path)
    data = df[column_name].values
    data = data.reshape(-1, 1)

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    data = scaler.fit_transform(data)

    return data, scaler


def prepare_data_for_lstm(data, look_back=1):
    X, y = [], []
    for i in range(len(data)-look_back):
        X.append(data[i:(i + look_back), 0])
        y.append(data[i + look_back, 0])
    return np.array(X), np.array(y)


def split_data(X, y, test_size=0.2):
    return train_test_split(X, y, test_size=test_size, random_state=42)


def build_bilstm_model(input_shape):
    model = Sequential()
    model.add(Bidirectional(LSTM(50, activation='relu'), input_shape=input_shape))
    model.add(Dense(1))
    model.compile(Adam(learning_rate=0.01), loss='mean_squared_error')
    return model


def train_and_evaluate_model(model, X_train, y_train, X_test, y_test, epochs=100, batch_size=32):
    # Train the model and save history
    history = model.fit(X_train, y_train, validation_split=0.2, epochs=epochs, batch_size=batch_size, verbose=2)

    # Plot training history
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.ylabel('Loss')
    plt.xlabel('Epoch')
    plt.legend()

    # Evaluate the model
    predicted = model.predict(X_test)
    mse = mean_squared_error(y_test, predicted)
    mae = mean_absolute_error(y_test, predicted)
    rmse = sqrt(mse)
    accuracy = 100 - mae

    # Plot predictions
    plt.subplot(1, 2, 2)
    plt.scatter(y_test, predicted)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--', lw=2)
    plt.title('Predictions vs Actual')
    plt.xlabel('Actual')
    plt.ylabel('Predicted')

    plt.show()

    print(f'Model MSE: {mse}')
    print(f'Model MAE: {mae}')
    print(f'Model RMSE: {rmse}')
    print(f'Model Accuracy: {accuracy}')
    
def save_model(model):
    model.save('user_model.h5')
    print('Model saved successfully.')

if __name__ == '__main__':
    main()