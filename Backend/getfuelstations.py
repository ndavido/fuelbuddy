import json
import os
import googlemaps
from datetime import datetime
from database import Database
from models import FuelStation, OpeningHours
from dotenv import load_dotenv
import time

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

def get_places_in_region(north, south, east, west, search_types):
    location = ((north + south) / 2, (east + west) / 2)
    fuel_station_count = 0

    try:
        for search_type in search_types:
            places_result = gmaps.places_nearby(location, radius=100000, type='gas_station', keyword='petrol diesel')

            for place in places_result.get('results', []):
                name = place['name']
                address = place.get('vicinity', 'Address not available')
                latitude = place['geometry']['location']['lat']
                longitude = place['geometry']['location']['lng']
                place_id = place['place_id']

                details_result = gmaps.place(place_id=place_id,
                                             fields=['name', 'formatted_address', 'geometry', 'opening_hours',
                                                     'formatted_phone_number'])

                result_data = details_result.get('result', {})

                opening_hours_data = result_data.get('opening_hours', {}).get('periods', [])
                if opening_hours_data:
                    opening_hours = [
                        OpeningHours(
                            day=str(period['open']['day']),
                            hours=f"{period['open']['time']}–{period['close']['time']}" if 'close' in period else "Unknown"
                        )
                        for period in opening_hours_data
                    ]
                else:
                    opening_hours = None

                phone_number = details_result.get('result', {}).get('formatted_phone_number',
                                                                    'Phone number not available')

                # Create a FuelStation object and save it to MongoDB
                fuel_station = FuelStation(
                    name=name,
                    address=address,
                    latitude=latitude,
                    longitude=longitude,
                    opening_hours=opening_hours,
                    phone_number=phone_number
                )
                fuel_station.save()
                fuel_station_count += 1

    except Exception as e:
        print(f"An error occurred: {e}")

current_north = ireland_bounds['north']
total_fuel_station_count = 0
while current_north > ireland_bounds['south']:
    current_south = max(current_north - step_size, ireland_bounds['south'])
    current_west = ireland_bounds['west']
    while current_west < ireland_bounds['east']:
        current_east = min(current_west + step_size, ireland_bounds['east'])
        fuel_station_count = get_places_in_region(current_north, current_south, current_east, current_west,
                                                  search_types)
        total_fuel_station_count += fuel_station_count
        current_west = current_east
    current_north = current_south

REQUEST_DELAY = 2
import time
time.sleep(REQUEST_DELAY)

print(f"Data inserted into MongoDB. Total Fuel Stations added: {total_fuel_station_count}")