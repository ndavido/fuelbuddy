#! usr/bin/python3

# MongoDB Configuration
import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Initialize the MongoDB client


class Database:
    def __init__(self):
        client = MongoClient(os.getenv('MONGO_URI'), server_api=ServerApi('1'))
        self.db = client[os.getenv('MONGO_DB_NAME')]

    def get_collection(self, collection_name):
        return self.db[collection_name]


class UserCollection:
    def __init__(self, db):
        self.collection = db.get_collection('users')

    def insert_user(self, user_data):
        return self.collection.insert_one(user_data).inserted_id

    def find_user(self, query):
        return self.collection.find_one(query)

    def update_user(self, query, new_data):
        return self.collection.update_one(query, new_data)


# Create collections
# ? users_collection = db['users']
# ? routes_collection = db['routes']
# ? waypoints_collection = db['waypoints']
# ? stations_collection = db['stations']
# ? notifications_collection = db['notifications']
# ? discussions_collection = db['discussions']
# ? fuel_cards_collection = db['fuel_cards']
# ? temp_nn_collection = db['nn_storage']
