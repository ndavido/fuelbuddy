import os
import pandas as pd
from dotenv import load_dotenv
from mongoengine import connect, disconnect
from src.models.vehicle import Vehicle, ModelInfo, TrimInfo
from mongoengine.errors import ValidationError

# if there is already a connection, disconnect it
disconnect(alias='default')

load_dotenv()

# DB connections
mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')
connect(db=database_name, host=mongodb_uri, alias='default')

# CSV
file_path = "C:\\fuelbuddy_21_02_2024\\Backend\\modified_file9.csv"
df = pd.read_csv(file_path, low_memory=False)

grouped_data = df.groupby('make')
print(grouped_data, 'grouped_data')

for make, group in grouped_data:
    models_list = []

    for index, row in group.iterrows():
        try:
            trim_info = TrimInfo(
                body_type=str(row['body_type']),
                engine_type=str(row['engine_type']),
                turnover_of_maximum_torque_rpm=int(row['turnover_of_maximum_torque_rpm']),
                capacity_cm3=int(row['capacity_cm3']),
                engine_hp=int(row['engine_hp']),
                engine_hp_rpm=int(row['engine_hp_rpm']),
                transmission=str(row['transmission']),
                mixed_fuel_consumption_per_100_km_l=float(row['mixed_fuel_consumption_per_100_km_l']),
                range_km=int(row['range_km']),
                emission_standards=str(row['emission_standards']),
                fuel_tank_capacity_l=int(row['fuel_tank_capacity_l']),
                # CO2_emissions_g_km=int(row['CO2_emissions_g_km']),
                car_class=str(row['car_class'])
            )
        except ValueError as e:
            print(f"Error creating TrimInfo object: {e}")
            continue
        model_info = ModelInfo(
            model=row['model'],
            trims=[row['trim']],
            years=[f"{row['year_from']} - {row['year_to']}"],
            info=trim_info
        )

        models_list.append(model_info)

    vehicle = Vehicle(
        make=make,
        models=models_list
    )

    try:
        vehicle.save()
    except ValidationError as e:
        print(f"Error saving Vehicle object: {e}")
        continue
