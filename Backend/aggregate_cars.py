import os
import pandas as pd
from dotenv import load_dotenv
from mongoengine import connect, disconnect
from src.models.vehicle import Vehicle, ModelInfo, TrimInfo, YearInfo
from mongoengine.errors import ValidationError

# If there is already a connection, disconnect it
disconnect(alias='default')

load_dotenv()

# DB connections
mongodb_uri = os.getenv('MONGO_URI')
database_name = os.getenv('MONGO_DB_NAME')
connect(db=database_name, host=mongodb_uri, alias='default')

# CSV
file_path = "C:\\fuelbuddy_21_02_2024\\Backend\\modified_file9.csv"
df = pd.read_csv(file_path, low_memory=False)
print(df.columns)

grouped_data = df.groupby(['make'])

for make, group in grouped_data:
    models_list = []

    print("Processing make:", make)

    for model, subgroup in group.groupby('model'):
        print("Processing model:", model)

        years_info = []

        for year, year_group in subgroup.groupby(['year_from', 'year_to']):
            print("Processing year:", year)
            trims = []

            for index, row in year_group.iterrows():
                try:
                    trim_info = TrimInfo(
                        series=str(row['series']),
                        trim=str(row['trim']),
                        body_type=str(row['body_type']),
                        engine_type=str(row['engine_type']),
                        turnover_of_maximum_torque_rpm=str(row['turnover_of_maximum_torque_rpm']),
                        capacity_cm3=str(row['capacity_cm3']),
                        engine_hp=str(row['engine_hp']),
                        engine_hp_rpm=str(row['engine_hp_rpm']),
                        transmission=str(row['transmission']),
                        mixed_fuel_consumption_per_100_km_l=str(row['mixed_fuel_consumption_per_100_km_l']),
                        range_km=str(row['range_km']),
                        emission_standards=str(row['emission_standards']),
                        fuel_tank_capacity_l=str(row['fuel_tank_capacity_l']),
                        city_fuel_per_100km_l=str(row['city_fuel_per_100km_l']),
                        co2_emissions_g_km=str(row['co2_emissions_g_km']),
                        car_class=str(row['car_class'])
                    )
                except ValueError as e:
                    print(f"Error creating TrimInfo object: {e}")
                    continue

                trims.append(trim_info)

            if trims:
                years_info.append({
                    'year': f"{year[0]} - {year[1]}",
                    'trims': trims
                })

        if years_info:
            models_list.append({
                'model': str(model),
                'years': years_info
            })

    print("Final models list for make", make, ":", models_list)

    vehicle = Vehicle(
        make=str(make),
        models=models_list
    )

    try:
        vehicle.save()
    except ValidationError as e:
        print(f"Error saving Vehicle object: {e}")
        continue
