#! /usr/bin/env python3

from mongoengine import Document, FloatField

class Location(Document):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)