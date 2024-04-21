#! /usr/bin/env python3

from mongoengine import Document, DateTimeField, DecimalField, StringField, ReferenceField
from datetime import datetime


class ReceiptOcr(Document):
    user = ReferenceField('Users', required=True)
    fuelstation = ReferenceField('FuelStation')
    receipt = StringField()  # image in bit
    fuel_type = StringField(required=True)
    volume = DecimalField(required=True, precision=2)
    price_per_litre = DecimalField(required=True, precision=3)
    total = DecimalField(required=True, precision=2)
    date = DateTimeField(default=datetime.utcnow)
    meta = {
        'collection': 'RecieptOcr',
        'indexes': [
            'user',
            'date'
        ]
    }
