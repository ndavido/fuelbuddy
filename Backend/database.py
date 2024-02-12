#! usr/bin/python3

# MongoDB Configuration
import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from models import FuelStation
from mongoengine import connect
from models import Users

load_dotenv()

# Initialize the MongoDB client


connect(
    db=os.getenv('MONGO_DB_NAME'),
    host=os.getenv('MONGO_URI'),
    alias='default'
)


class Database:
    def __init__(self):
        pass

    def get_collection(self, collection_name):
        return collection_name