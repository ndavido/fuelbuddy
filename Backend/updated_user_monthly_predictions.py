import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.regularizers import l2, l1

# Load and preprocess the dataset
df = pd.read_csv('Backend/user_spending_on_fuel.csv')

# Normalize the features and target
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_features = scaler.fit_transform(df[['Total']].values)
scaled_target = scaler.fit_transform(df[['Total']].values)

# Split the dataset into train and test sets
X_train, X_test, y_train, y_test = train_test_split(scaled_features, scaled_target, test_size=0.2, shuffle=False)

# Reshape the input data
look_back = 10
X_train = X_train.reshape(-1, look_back, 1)
X_test = X_test.reshape(-1, look_back, 1)

# Adjusted model architecture
from tensorflow.keras.layers import SimpleRNN

model = Sequential()
model.add(SimpleRNN(256, return_sequences=True, input_shape=(look_back, 1), activation='relu', kernel_regularizer=l2(0.01)))
model.add(Dropout(0.2))
model.add(SimpleRNN(128, return_sequences=True, activation='relu', kernel_regularizer=l2(0.01)))
model.add(Dropout(0.2))
model.add(SimpleRNN(64, return_sequences=True, activation='relu', kernel_regularizer=l2(0.01)))
model.add(Dropout(0.2))
model.add(SimpleRNN(32, activation='relu', kernel_regularizer=l2(0.01)))
model.add(Dropout(0.2))
model.add(Dense(1))
model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')

# Train the model
early_stopping = EarlyStopping(monitor='val_loss', patience=10, mode='min')
history = model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2, callbacks=[early_stopping], verbose=1)

# Plot the loss
import matplotlib.pyplot as plt
plt.plot(history.history['loss'], label='train')
plt.plot(history.history['val_loss'], label='test')
plt.legend()
plt.show()

# Save the model
model.save('Backend/Updated_user_model.h5')

