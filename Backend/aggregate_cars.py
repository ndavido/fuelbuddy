import os
import pandas as pd
from dotenv import load_dotenv
from mongoengine import connect
from src.models.vehicle import Vehicle, TrimInfo, ModelInfo

# refs
# https://stackoverflow.com/questions/773/how-do-i-use-itertools-groupby

load_dotenv()

mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')

connect(db=database_name, host=mongodb_uri, alias='default')

# Load data from CSV
file_path = "C:\\fuelbuddy_21_02_2024\\Backend\\cleaned.csv"
df = pd.read_csv(file_path, low_memory=False)

# Group data by 'make' column
grouped_data = df.groupby('make')
for make, group in grouped_data:
    print(f"Make: {make}")
    print(group)

