from mongoengine import Document, StringField, EmbeddedDocumentListField, EmbeddedDocument
from mongoengine.fields import IntField, FloatField, EmbeddedDocumentField


class ModelInfo(EmbeddedDocument):
    body_type = StringField()
    engine_type = StringField()
    turnover_of_maximum_torque_rpm = IntField()
    capacity_cm3 = IntField()
    engine_hp = IntField()
    engine_hp_rpm = IntField()
    transmission = StringField()
    mixed_fuel_consumption_per_100_km_l = FloatField()
    range_km = IntField()
    emission_standards = StringField()
    fuel_tank_capacity_l = IntField()
    CO2_emissions_g_km = IntField()
    car_class = StringField()


class TrimInfo(EmbeddedDocument):
    trim = StringField()
    years = StringField()
    info = EmbeddedDocumentField(ModelInfo)


class Vehicle(Document):
    make = StringField()
    trims = EmbeddedDocumentListField(TrimInfo)

    meta = {
        'collection': 'vehicle_datatest'
    }
