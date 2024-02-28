#! /usr/bin/env python3

from mongoengine import Document, IntField, StringField, FloatField, ListField


class Vehicle(Document):
    id_trim = IntField()
    make = StringField()
    model = StringField()
    generation = StringField()
    year_from = IntField()
    year_to = IntField()
    series = StringField()
    trim = StringField()
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

    meta = {
        'collection': 'vehicle_data'
    }
