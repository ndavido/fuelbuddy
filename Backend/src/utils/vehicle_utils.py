from datetime import datetime

from ..models import Vehicle, UserVehicle


# POST /api/vehicles - Create a vehicle
# https://www.freecodecamp.org/news/best-practices-for-refactoring-code/
def extract_vehicle_data(request):
    vehicle_data = request.get_json()
    required_fields = ['make', 'model', 'year']
    missing_fields = [field for field in required_fields if field not in vehicle_data]
    if missing_fields:
        raise ValueError(f'Missing required fields: {", ".join(missing_fields)}')
    return vehicle_data


def create_user_vehicle_object(user_id, vehicle_data):
    return UserVehicle(
        user_id=user_id,
        make=vehicle_data['make'],
        model=vehicle_data['model'],
        year=vehicle_data['year'],
        series=vehicle_data.get('series'),
        trim=vehicle_data.get('trim'),
        body_type=vehicle_data.get('body_type'),
        engine_type=vehicle_data.get('engine_type'),
        transmission=vehicle_data.get('transmission'),
        fuel_tank_capacity=vehicle_data.get('fuel_tank_capacity_l'),
        city_fuel_per_100km=vehicle_data.get('city_fuel_per_100km_l'),
        co2_emissions=vehicle_data.get('co2_emissions_g_km'),
        created_at=datetime.utcnow()
    )


# GET: /api/vehicles - Get all vehicles
def vehicle_to_dict(vehicle):
    return {
        'make': vehicle.make,
        'model': vehicle.model,
        'year': vehicle.year,
        'series': vehicle.series,
        'trim': vehicle.trim,
        'body_type': vehicle.body_type,
        'engine_type': vehicle.engine_type,
        'transmission': vehicle.transmission,
        'fuel_tank_capacity_l': vehicle.fuel_tank_capacity,
        'city_fuel_per_100km_l': vehicle.city_fuel_per_100km,
        'co2_emissions_g_km': vehicle.co2_emissions
    }


# PUT: /api/vehicles - Update a vehicle; Helper function
def update_vehicle_fields(vehicle, data):
    for key, value in data.items():
        if hasattr(vehicle, key):
            setattr(vehicle, key, value)


# Helper function to get trim information by year // get_vehicle_years_for_model
# ref: https://www.geeksforgeeks.org/generator-expressions/
def get_trim_info_by_year(model):
    trim_info_by_year = {}

    vehicles = Vehicle.objects(models__model=model)
    # used a generator expression due to the large amount of data being retrieved at once
    relevant_models = (model_info for vehicle in vehicles for model_info in vehicle.models if model_info.model == model)

    # loops through the relevant models and extracts the trim data for each year
    for model_info in relevant_models:
        for year_info in model_info.years:
            year = year_info.year
            if year not in trim_info_by_year:
                trim_info_by_year[year] = []

            trim_data_list = trim_data(year_info.trims)
            trim_info_by_year[year].extend(trim_data_list)

    return trim_info_by_year


def trim_data(trims):
    return [
        {
            "series": trim_info.series,
            "trim": trim_info.trim,
            "body_type": trim_info.body_type,
            "engine_type": trim_info.engine_type,
            "turnover_of_maximum_torque_rpm": trim_info.turnover_of_maximum_torque_rpm,
            "capacity_cm3": trim_info.capacity_cm3,
            "engine_hp": trim_info.engine_hp,
            "engine_hp_rpm": trim_info.engine_hp_rpm,
            "transmission": trim_info.transmission,
            "mixed_fuel_consumption_per_100_km_l": trim_info.mixed_fuel_consumption_per_100_km_l,
            "range_km": trim_info.range_km,
            "emission_standards": trim_info.emission_standards,
            "fuel_tank_capacity_l": trim_info.fuel_tank_capacity_l,
            "city_fuel_per_100km_l": trim_info.city_fuel_per_100km_l,
            "co2_emissions_g_km": trim_info.co2_emissions_g_km,
            "car_class": trim_info.car_class
        } for trim_info in trims
    ]
