# models.py

from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, BooleanField, ListField, DateTimeField

class Location(Document):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)

class Users(Document):
    username = StringField(required=True, unique=True)
    full_name = StringField()
    phone_number = StringField()
    email = StringField()
    verification_code = StringField()
    login_code = StringField()
    verified = BooleanField(default=False)
    location = ReferenceField(Location)
    roles = ListField(StringField())
    created_at = DateTimeField()
    updated_at = DateTimeField()

class Vehicle(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE')
    year = IntField()
    make = StringField()
    model = StringField()
    engine_size = StringField()
    license_plate = StringField()
    fuel_type = StringField(choices=('Petrol', 'Diesel', 'Electric'))  # Include 'Electric' as an option

class FuelStation(Document):
    name = StringField(required=True)
    location = ReferenceField(Location, required=True)
    is_charging_station = BooleanField(default=False)
    charging_rates = FloatField()  # Price per kWh if this is a charging station

class FuelPrices(Document):
    fuel_station = ReferenceField(FuelStation, reverse_delete_rule='CASCADE')
    petrol_price = FloatField()
    diesel_price = FloatField()
    electricity_price = FloatField()  # Price per kWh
    updated_at = DateTimeField(required=True)

class UserFuelBudget(Document):
    user = ReferenceField('Users', required=True)
    weekly_budget = FloatField(required=True)  # Will need to update these fields as we go with encopassing EV
    location = ReferenceField(Location, required=True)
    busy_pump = BooleanField(required=True)
    busy_charger = BooleanField(required=True)
    high_price = BooleanField(required=True)
