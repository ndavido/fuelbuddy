# models.py

from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, BooleanField, ListField, \
    DateTimeField

class Location(Document):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)

class User(Document):
    username = StringField(required=True, unique=True)
    full_name = StringField()
    phone_number = StringField()
    verification_code = StringField()
    verified = BooleanField(default=False)
    location = ReferenceField(Location)
    roles = ListField(StringField())
    created_at = DateTimeField()
    updated_at = DateTimeField()
class Vehicle(Document):
    user = ReferenceField(User, reverse_delete_rule='CASCADE')
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
