#! /usr/bin/env python3

from mongoengine import Document, BinaryField, DateTimeField, DecimalField, StringField, ReferenceField
from datetime import datetime


class RecieptOcr(Document):
    user = ReferenceField('Users', required=True)
    reciept = BinaryField(required=True)  # image in bit
    fuel_type = StringField()
    volume = DecimalField(precision=2)
    price_per_litre = DecimalField(precision=3)
    total = DecimalField(precision=2)
    date = DateTimeField(default=datetime.now)
    meta = {
        'collection': 'RecieptOcr',
        'indexes': [
            'user',
            'date'
        ]
    }
