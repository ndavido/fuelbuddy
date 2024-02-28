import os
import googlemaps
from src.extenstions.db_connection import db_connect
from src.models.fuel_station import FuelStation, OpeningHours, Facilities
from dotenv import load_dotenv
import time

# ref: https://medium.com/swlh/scraping-google-maps-to-measure-electric-vehicle-infrastructure-real-time-ev-charger-data-v1-0-77a2b4142a78
# ref: https://developers.google.com/maps/documentation/places/web-service/overview

load_dotenv()
key = os.getenv('GOOGLE_MAPS_API_KEY')
db_connect()
gmaps = googlemaps.Client(key=key)

ireland_bounds = {
    'north': 55.4,
    'south': 51.4,
    'west': -10.5,
    'east': -5.5,
}
# ireland_bounds = {
#     'north': 51.9,  # Approximate latitude for Cork
#     'south': 51.9,  # Approximate latitude for Cork
#     'west': -8.5,   # Approximate longitude for Cork
#     'east': -8.5    # Approximate longitude for Cork
# }


# search_types = ['gas_station']
step_size = 0.2
petrol_results = []
#            location, radius=100000, type='gas_station', keyword='Louth Maxol petrol diesel')


def get_places_in_region(north, south, east, west):
    location = ((north + south) / 2, (east + west) / 2)
    fuel_stations = []
    try:
        places_result = gmaps.places_nearby(
            location, radius=100000, type='gas_station',
            keyword='Applegreen OR "Circle K" OR Texaco OR Esso OR Maxol OR Shell OR BP OR Gulf OR Emo OR Go OR Inver OR "Petrol station" OR "Diesel station" OR "Fuel station" OR "Gas station" OR "Service station"')
        print(f"Found {len(places_result['results'])} gas stations")
        for place in places_result.get('results', []):
            fuel_station = process_place(place)
            if fuel_station:
                fuel_stations.append(fuel_station)
    except Exception as e:
        print(f"An error occurred while retrieving places: {e}")
    return fuel_stations

# car wash, car repair, car service, car parking, deli, restrooms, atm, convenience store, coffee, food, wifi


def process_place(place):
    name = place['name']
    address = place.get('vicinity', 'Address not available')
    latitude = place['geometry']['location']['lat']
    longitude = place['geometry']['location']['lng']
    place_id = place['place_id']
    existing_station = FuelStation.objects(place_id=place_id).first()
    if existing_station:
        existing_station.name = name
        existing_station.address = address
        existing_station.latitude = latitude
        existing_station.longitude = longitude
    else:
        existing_station = FuelStation(
            name=name,
            address=address,
            latitude=latitude,
            longitude=longitude,
            place_id=place_id,
            facilities=Facilities()
        )

    facilities = {
        'car_wash': 'car wash',
        'car_repair': 'car repair',
        'car_service': 'car service',
        'car_parking': 'car park',
        'atm': 'ATM',
        'convenience_store': 'convenience store',
        'food': 'food',
    }

    for field, facility_name in facilities.items():
        facility_available = False
        if 'types' in place:
            if field in place['types']:
                facility_available = True
        setattr(existing_station, field, facility_available)

    try:
        place_details = gmaps.place(place_id=place_id, fields=['opening_hours'])
        opening_hours_data = place_details.get('result', {}).get('opening_hours', {}).get('periods', [])
        opening_hours = [OpeningHours(
            day=str(period['open']['day']),
            hours=f"{period['open']['time']}–{period['close']['time']}" if 'close' in period else ""
        ) for period in opening_hours_data] if opening_hours_data else None
        existing_station.opening_hours = opening_hours
    except Exception as e:
        print(f"An error occurred while retrieving opening hours: {e}")

    try:
        phone_results = gmaps.place(place_id=place_id, fields=['formatted_phone_number'])
        phone_number = phone_results.get('result', {}).get('formatted_phone_number', 'Phone number not available')
        existing_station.phone_number = phone_number
    except Exception as e:
        print(f"An error occurred while retrieving phone number: {e}")

    print(existing_station.name, 'name')
    print(existing_station.car_wash, 'car wash')

    # print(f"Place processed: {existing_station.name} - {existing_station.address} - {existing_station.latitude} - {existing_station.longitude} - {existing_station.place_id} - {existing_station.car_wash} - {existing_station.phone_number} - {existing_station.opening_hours}")
    return existing_station


current_north = ireland_bounds['north']
total_fuel_station_count = 0
while current_north > ireland_bounds['south']:
    current_south = max(current_north - step_size, ireland_bounds['south'])
    current_west = ireland_bounds['west']
    while current_west < ireland_bounds['east']:
        current_east = min(current_west + step_size, ireland_bounds['east'])
        fuel_stations = get_places_in_region(
            current_north, current_south, current_east, current_west)
        for fuel_station in fuel_stations:
            fuel_station.save()
        total_fuel_station_count += len(fuel_stations)
        current_west = current_east
    current_north = current_south

REQUEST_DELAY = 2
time.sleep(REQUEST_DELAY)

print(f"Data inserted into MongoDB. Total Fuel Stations added: {total_fuel_station_count}")
