from ..models import Vehicle, UserVehicle


# Helper Functions for creating a vehicle
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
        co2_emissions=vehicle_data.get('co2_emissions_g_km')
    )


def get_trim_info_by_year(model):
    trim_info_by_year = {}
    vehicles = Vehicle.objects(models__model=model)
    for vehicle in vehicles:
        for model_info in vehicle.models:
            if model_info.model == model:
                for year_info in model_info.years:
                    year = year_info.year
                    if year not in trim_info_by_year:
                        trim_info_by_year[year] = []
                    for trim_info in year_info.trims:
                        trim_data = {
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
                        }
                        trim_info_by_year[year].append(trim_data)
    return trim_info_by_year
