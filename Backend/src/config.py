#! /usr/bin/env python3

import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get('MONGO_URI')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')
TWILIO_SID = os.environ.get('TWILIO_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')
API_KEY = os.environ.get('API_KEY')
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY')
AES_FIXED_IV = os.environ.get('AES_FIXED_IV')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
