#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, IntField, StringField
from .user import Users

class Vehicle(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE')
    year = IntField()
    make = StringField()
    model = StringField()
    engine_size = StringField()
    license_plate = StringField()
    # Include 'Electric' as an option
    fuel_type = StringField(choices=('Petrol', 'Diesel', 'Electric'))