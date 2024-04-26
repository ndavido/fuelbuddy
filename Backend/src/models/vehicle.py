from datetime import datetime

from mongoengine import Document, StringField, ListField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField


class TrimInfo(EmbeddedDocument):
    series = StringField()
    trim = StringField()
    body_type = StringField()
    engine_type = StringField()
    turnover_of_maximum_torque_rpm = StringField()
    capacity_cm3 = StringField()
    engine_hp = StringField()
    engine_hp_rpm = StringField()
    transmission = StringField()
    mixed_fuel_consumption_per_100_km_l = StringField()
    range_km = StringField()
    emission_standards = StringField()
    fuel_tank_capacity_l = StringField()
    city_fuel_per_100km_l = StringField()
    co2_emissions_g_km = StringField()
    car_class = StringField()


class YearInfo(EmbeddedDocument):
    year = StringField()
    trims = ListField(EmbeddedDocumentField(TrimInfo))


class ModelInfo(EmbeddedDocument):
    model = StringField()
    years = ListField(EmbeddedDocumentField(YearInfo))


class UserVehicle(Document):
    user_id = StringField(required=True)
    make = StringField(required=True)
    model = StringField(required=True)
    year = StringField(required=True)
    series = StringField()
    trim = StringField()
    body_type = StringField()
    engine_type = StringField()
    transmission = StringField()
    fuel_tank_capacity = StringField()
    city_fuel_per_100km = StringField()
    co2_emissions = StringField()
    updated_at = DateTimeField(default=datetime.utcnow, required=True)
    created_at = DateTimeField(default=datetime.utcnow, required=True)

    meta = {
        'collection': 'user_vehicles'
    }


class Vehicle(Document):
    make = StringField()
    models = ListField(EmbeddedDocumentField(ModelInfo))

    meta = {
        'collection': 'vehicles_data',
        'indexes': [
            'make',
        ]
    }
