# models.py

from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, BooleanField, ListField, \
    DateTimeField

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
    fuel_type = StringField()

class FuelStation(Document):
    name = StringField(required=True)

class FuelPrices(Document):
    fuel_station = ReferenceField(FuelStation, reverse_delete_rule='CASCADE')
    price = StringField()

class UserFuelBudget(Document):
    user = ReferenceField('Users', required=True)  # Assuming you have a Users model for user information
    weekly_fuel_budget = FloatField(required=True)  # The user's fuel budget for the week
    location = ReferenceField(Location, required=True)  # The user's location
    busy_pump = BooleanField(required=True)  # User input: whether the pump is busy or not
    high_price = BooleanField(required=True)  # User input: whether the price is considered high