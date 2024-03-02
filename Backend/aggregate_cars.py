import os
import pandas as pd
from dotenv import load_dotenv
from mongoengine import connect, disconnect
from src.models.vehicle import Vehicle, ModelInfo, TrimInfo
from mongoengine.errors import ValidationError

# if there is already a connection, disconnect it
disconnect(alias='default')

load_dotenv()

# DB connections
mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')
connect(db=database_name, host=mongodb_uri, alias='default')

# CSV
file_path = "C:\\fuelbuddy_21_02_2024\\Backend\\modified_file3.csv"
df = pd.read_csv(file_path, low_memory=False)

grouped_data = df.groupby('make')
print(grouped_data, 'grouped_data')
