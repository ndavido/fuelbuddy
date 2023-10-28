#! usr/bin/python3

# MongoDB Configuration
import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Initialize the MongoDB client
client = MongoClient(os.getenv('MONGO_URI'), server_api=ServerApi('1'))
db = client[os.getenv('MONGO_DB_NAME')]

# Create collections
users_collection = db['users']
routes_collection = db['routes']
waypoints_collection = db['waypoints']
stations_collection = db['stations']
notifications_collection = db['notifications']
discussions_collection = db['discussions']
fuel_cards_collection = db['fuel_cards']
temp_nn_collection = db['nn_storage']
