import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from tensorflow.keras.optimizers import Adam
import numpy as np

# Load the dataset
file_path = 'Backend/new_user_spending_data.csv'
df = pd.read_csv(file_path)

# Preprocess the data
# Convert dates to a numerical format (e.g., number of weeks since start)
df['Date'] = pd.to_datetime(df['Date'], format='%d/%m/%Y')
df['Date'] = df['Date'].dt.strftime('%U').astype('int')

# Normalize the data
scaler = MinMaxScaler(feature_range=(0, 1))
df_scaled = scaler.fit_transform(df[['Date', 'Total_Spent_on_Fuel']])

# Create input-output pairs
X = []
y = []

look_back = 8  # number of previous weeks to consider
for i in range(len(df_scaled) - look_back):
    X.append(df_scaled[i:(i + look_back), 0])
    y.append(df_scaled[i + look_back, 1])

X, y = np.array(X), np.array(y)

# Reshape input to be [samples, time steps, features]
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create the LSTM model
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.layers import Dropout
model = Sequential()
model.add(LSTM(128, return_sequences=True, input_shape=(look_back, 1)))
model.add(Dropout(0.2))
model.add(LSTM(64, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(32))
model.add(Dropout(0.2))
model.add(Dense(1))
model.compile(optimizer=Adam(learning_rate=0.0001), loss='mean_squared_error')

# Train the model
early_stopping = EarlyStopping(monitor='val_loss', patience=10, mode='min')
history = model.fit(X_train, y_train, epochs=200, batch_size=64, validation_data=(X_test, y_test), verbose=1, shuffle=1, callbacks=[early_stopping])

# Evaluate the model
train_loss = history.history['loss'][-1]
val_loss = history.history['val_loss'][-1]
train_loss, val_loss

# Plot the training and validation loss
import matplotlib.pyplot as plt
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.legend(['train', 'val'])
plt.show()

# Save the model
model.save('Backend/user_model.h5')
