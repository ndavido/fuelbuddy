#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, FloatField
from .user import Users
from .location import Location

class Trip(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE')
    start_location = ReferenceField(Location)
    end_location = ReferenceField(Location)
    distance = FloatField()
    meta = {
        'collection': 'Trip'
    }
