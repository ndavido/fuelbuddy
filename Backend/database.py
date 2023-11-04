#! usr/bin/python3

# MongoDB Configuration
import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from models import FuelStation

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


class FuelStationsCollection:
    def __init__(self, db):
        self.collection = db.get_collection('fuelStation')

    def insert_fuel_station(self, fuel_station_data):
        # Insert a new fuel station document into the collection
        fuel_station_id = self.collection.insert_one(fuel_station_data).inserted_id
        return fuel_station_id

    def find_fuel_station(self, query):
        # Find a fuel station based on the query
        fuel_station = self.collection.find_one(query)
        return fuel_station

    def update_fuel_station(self, query, new_data):
        # Update a fuel station based on the query
        self.collection.update_one(query, {"$set": new_data})

class PetrolFuelPricesCollection:
    def __init__(self, db):
        self.collection = db.get_collection('fuel_prices')

    def insert_fuel_price(self, fuel_price_data):
        return self.collection.insert_one(fuel_price_data).inserted_id

    def get_fuel_prices(self, query={}, limit=None):
        # Retrieve fuel prices from the collection based on a query
        # 'query' is a dictionary defining the search criteria (default is an empty dictionary, which matches all documents)
        # 'limit' is an optional parameter specifying the maximum number of documents to retrieve
        # The method returns a list of documents matching the query
        return list(self.collection.find(query).limit(limit)) if limit else list(self.collection.find(query))

    def delete_prices(self, query):
        return self.collection.delete_many(query)

# Create collections
# ? users_collection = db['users']
# ? routes_collection = db['routes']
# ? waypoints_collection = db['waypoints']
# ? stations_collection = db['stations']
# ? notifications_collection = db['notifications']
# ? discussions_collection = db['discussions']
# ? fuel_cards_collection = db['fuel_cards']
# ? temp_nn_collection = db['nn_storage']
