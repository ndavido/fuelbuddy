#! /usr/bin/env python3

from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, FloatField, ListField, EmbeddedDocumentField, BooleanField, ReferenceField, EmbeddedDocument
from .user import Users

class PetrolPrices(EmbeddedDocument):
    price = FloatField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)

class DieselPrices(EmbeddedDocument):
    price = FloatField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)

class FuelStation(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    petrol_prices = ListField(EmbeddedDocumentField(PetrolPrices))
    diesel_prices = ListField(EmbeddedDocumentField(DieselPrices))
    meta = {
        'collection': 'FuelStation'
    }
class FavoriteFuelStation(Document):
    user = ReferenceField(Users, required=True)
    favorite_stations = ListField(ReferenceField(FuelStation))

    meta = {
        'collection': 'FavoriteFuelStation'
    }
class FuelPrices(Document):
    station = ReferenceField(FuelStation, required=True)
    petrol_prices = ListField(EmbeddedDocumentField(PetrolPrices))
    diesel_prices = ListField(EmbeddedDocumentField(DieselPrices))
    updated_at = DateTimeField(default=datetime.utcnow)
    meta = {
        'collection': 'FuelPrices'
    }

class ChargingStation(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    is_charging_station = BooleanField(required=True)
    is_fast_charging = BooleanField(required=True)
    charging_price = FloatField()
    updated_at = DateTimeField(required=True)
    meta = {
        'collection': 'ChargingStation'
    }


class EVPrices(Document):
    # Use the name or a unique identifier of the charging station
    charging_station = StringField(required=True)
    charging_price = FloatField()
    updated_at = DateTimeField(required=True)
    meta = {
        'collection': 'EVPrices'
    }