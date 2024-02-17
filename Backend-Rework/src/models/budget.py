#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, DateTimeField, DecimalField


class BudgetHistory(Document):
    user = ReferenceField('Users', required=True)
    old_budget = DecimalField(precision=2)
    new_budget = DecimalField(precision=2)
    change_date = DateTimeField(required=True)
    meta = {
        'collection': 'BudgetHistory'
    }
