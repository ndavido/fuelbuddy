import os
import pandas as pd
from dotenv import load_dotenv
load_dotenv()

mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')
print("Connecting...", mongodb_uri, database_name)


file_path = "C:\\fuelbuddy_21_02_2024\\Backend\\cleaned.csv"
df = pd.read_csv(file_path, low_memory=False)

print(df.columns)
