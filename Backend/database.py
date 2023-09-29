#! usr/bin/python3

# MongoDB Configuration
import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv('MONGO_URI'), server_api=ServerApi('1'))
db = client[os.getenv('MONGO_DB_NAME')]
collection = db['your_collection_name']