import json
import os
import googlemaps
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# ref: https://medium.com/swlh/scraping-google-maps-to-measure-electric-vehicle-infrastructure-real-time-ev-charger-data-v1-0-77a2b4142a78
# ref: https://developers.google.com/maps/documentation/places/web-service/overview

key = os.getenv('GOOGLE_MAPS_API_KEY')

gmaps = googlemaps.Client(key=key)

ireland_bounds = {
    'north': 55.4,
    'south': 51.4,
    'west': -10.5,
    'east': -5.5,
}

search_type_ev_charging = 'electric_vehicle_charging_station'
step_size = 1.0
ev_charging_results = []
ev_charging_station_count = 0

def get_places_in_region(north, south, east, west, search_type_ev_charging):
    global ev_charging_station_count

    location = ((north + south) / 2, (east + west) / 2)

    try:
        places_result = gmaps.places_nearby(
            location,
            radius=50000,
            keyword='electric vehicle charging station',
            type=search_type_ev_charging
        )

        for place in places_result.get('results', []):
            name = place['name']
            address = place.get('vicinity', 'Address not available')
            latitude = place['geometry']['location']['lat']
            longitude = place['geometry']['location']['lng']

            result = {
                "name": name,
                "address": address,
                "latitude": latitude,
                "longitude": longitude,
            }
            ev_charging_results.append(result)
            ev_charging_station_count += 1

    except Exception as e:
        print(f"An error occurred: {e}")


current_north = ireland_bounds['north']
while current_north > ireland_bounds['south']:
    current_south = max(current_north - step_size, ireland_bounds['south'])
    current_west = ireland_bounds['west']
    while current_west < ireland_bounds['east']:
        current_east = min(current_west + step_size, ireland_bounds['east'])
        get_places_in_region(current_north, current_south, current_east, current_west, search_type_ev_charging)
        current_west = current_east
    current_north = current_south

REQUEST_DELAY = 2
import time
time.sleep(REQUEST_DELAY)

current_date = datetime.now().strftime("%Y-%m-%d")
filename_ev_charging = f'ev_charging_stations_ireland_{current_date}.json'
with open(filename_ev_charging, 'w') as json_file_ev_charging:
    json.dump(ev_charging_results, json_file_ev_charging, indent=2)

print(f"EV Charging Stations data saved to '{filename_ev_charging}'.")
print(f"Total EV charging stations collected: {ev_charging_station_count}")
