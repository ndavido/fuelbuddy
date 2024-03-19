#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, StringField, DateTimeField
from .user import Users
from .fuel_station import FuelStation
import datetime


class UserActivity(Document):
    user = ReferenceField(Users, required=True)
    # e.g., "fuel_price_update", "station_added_to_favorites"
    activity_type = StringField(required=True)
    # e.g., "Updated fuel price for station X", "Added station Y to favorites"
    details = StringField(required=True)
    station = ReferenceField(FuelStation)
    timestamp = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'UserActivities',
        'indexes': [
            '-timestamp'  # Ensures that queries ordering by timestamp are efficient
        ]
    }
