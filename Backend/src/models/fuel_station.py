#! /usr/bin/env python3

from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, FloatField, ListField, EmbeddedDocumentField, \
    BooleanField, ReferenceField, EmbeddedDocument, DecimalField
from .user import Users


class PetrolPrices(EmbeddedDocument):
    price = FloatField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)


class DieselPrices(EmbeddedDocument):
    price = FloatField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)


class OpeningHours(EmbeddedDocument):
    day = StringField()
    hours = StringField()

class Facilities(EmbeddedDocument):
    car_wash = BooleanField(default=False)
    car_repair = BooleanField(default=False)
    car_service = BooleanField(default=False)
    car_parking = BooleanField(default=False)
    atm = BooleanField(default=False)
    convenience_store = BooleanField(default=False)
    food = BooleanField(default=False)

# https://docs.mongoengine.org/apireference.html
class RatingUpdate(EmbeddedDocument):
    rating = DecimalField(min_value=0, max_value=5, required=True)
    updated_at = DateTimeField(default=datetime.utcnow, required=True)

class FuelStation(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    place_id = StringField(required=True, unique=True)
    phone_number = StringField()
    petrol_prices = ListField(EmbeddedDocumentField(PetrolPrices))
    diesel_prices = ListField(EmbeddedDocumentField(DieselPrices))
    opening_hours = ListField(EmbeddedDocumentField(OpeningHours))
    facilities = EmbeddedDocumentField(Facilities)
    ratings = ListField(EmbeddedDocumentField(RatingUpdate))
    meta = {
        'collection': 'FuelStationData'
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
