import os
from mongoengine import connect
from dotenv import load_dotenv
from models import FuelStation
import csv

load_dotenv()

mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')

def export_fuel_stations_to_csv(file_path='fuelstations.csv'):
    connect(db=database_name, host=mongodb_uri, alias='default')

    try:
        # Retrieve all fuel stations from the collection
        fuel_stations = FuelStation.objects()

        with open(file_path, 'w', newline='', encoding='utf-8-sig') as csvfile:
            fieldnames = ['id', 'name', 'address', 'latitude', 'longitude', 'place_id', 'petrol_prices', 'diesel_prices', 'opening_hours', 'phone_number', 'car_wash']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for station in fuel_stations:
                writer.writerow({
                    'id': station.id,
                    'name': station.name,
                    'address': station.address,
                    'latitude': station.latitude,
                    'longitude': station.longitude,
                    'place_id': station.place_id,
                    'petrol_prices': station.petrol_prices,
                    'diesel_prices': station.diesel_prices,
                    'opening_hours': station.opening_hours,
                    'phone_number': station.phone_number,
                    'car_wash': station.car_wash
                })

        print(f"Fuel stations exported to '{file_path}' successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    export_fuel_stations_to_csv()
