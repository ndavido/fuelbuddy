import json
import os
import googlemaps
from datetime import datetime
from database import Database
from models import FuelStation, Location, Users, FuelPrices, BudgetHistory, FriendRequest, Friends, Notification, \
    ChargingStation, EVPrices, Trip
from dotenv import load_dotenv
load_dotenv()

key = os.getenv('GOOGLE_MAPS_API_KEY')

db = Database()

gmaps = googlemaps.Client(key=key)

ireland_bounds = {
    'north': 55.4,
    'south': 51.4,
    'west': -10.5,
    'east': -5.5,
}

search_types = ['gas_station']
step_size = 0.5
petrol_results = []
petrol_station_count = 0
key = os.getenv('GOOGLE_MAPS_API_KEY')

gmaps = googlemaps.Client(key=key)

ireland_bounds = {
    'north': 55.4,
    'south': 51.4,
    'west': -10.5,
    'east': -5.5,
}

search_types = ['gas_station']
step_size = 0.5

def get_places_in_region(north, south, east, west, search_types):
    location = ((north + south) / 2, (east + west) / 2)
    try:
        for search_type in search_types:
            places_result = gmaps.places_nearby(location, radius=100000, type='gas_station', keyword='petrol diesel')

            for place in places_result.get('results', []):
                name = place['name']
                address = place.get('vicinity', 'Address not available')
                latitude = place['geometry']['location']['lat']
                longitude = place['geometry']['location']['lng']

                # Create a FuelStation object and save it to MongoDB
                fuel_station = FuelStation(
                    name=name,
                    address=address,
                    latitude=latitude,
                    longitude=longitude
                )
                fuel_station.save()

    except Exception as e:
        print(f"An error occurred: {e}")

current_north = ireland_bounds['north']
while current_north > ireland_bounds['south']:
    current_south = max(current_north - step_size, ireland_bounds['south'])
    current_west = ireland_bounds['west']
    while current_west < ireland_bounds['east']:
        current_east = min(current_west + step_size, ireland_bounds['east'])
        get_places_in_region(current_north, current_south, current_east, current_west, search_types)
        current_west = current_east
    current_north = current_south

REQUEST_DELAY = 2
import time
time.sleep(REQUEST_DELAY)

print("Data inserted into MongoDB.")

# current_date = datetime.now().strftime("%Y-%m-%d")
# filename_petrol = f'petrol_stations_ireland_{current_date}.json'
# with open(filename_petrol, 'w') as json_file_petrol:
#     json.dump(petrol_results, json_file_petrol, indent=2)
#
# print(f"Petrol Stations data saved to '{filename_petrol}'.")
# print(f"Total petrol stations collected: {petrol_station_count}")