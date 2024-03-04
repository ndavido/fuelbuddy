import os
from dotenv import load_dotenv
from mongoengine import connect
from src.models.vehicle import Vehicle


load_dotenv()

mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')
connect(db=database_name, host=mongodb_uri, alias='default')

#ref: https://stackoverflow.com/questions/1798465/remove-last-3-characters-of-a-string

def clean_make(make):
    return make[2:-3]

# make had an issue where it was being saved with a wrapper
# Like ("'Audi'",) instead of "Audi"
# This function removes the wrapper

def update_makes():
    try:
        vehicles = Vehicle.objects()
        for vehicle in vehicles:
            vehicle.make = clean_make(vehicle.make)
            vehicle.save()
        print("Makes updated successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

update_makes()
