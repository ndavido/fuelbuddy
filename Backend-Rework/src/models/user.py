#! /usr/bin/env python3

from mongoengine import Document, StringField, ReferenceField, ListField, DateTimeField, DecimalField, BooleanField
from .location import Location
from datetime import datetime
from .budget import BudgetHistory


class Users(Document):
    username = StringField(required=True, unique=True)
    full_name = StringField()
    phone_number = StringField()
    email = StringField()
    verification_code = StringField()
    login_code = StringField()
    verified = BooleanField(default=False)
    location = ReferenceField(Location)  # Make sure Location is defined
    roles = ListField(StringField())
    created_at = DateTimeField()
    updated_at = DateTimeField()
    weekly_budget = DecimalField(precision=2)

    def update_budget(self, new_budget):
        from .budget import BudgetHistory
        BudgetHistory(
            user=self,
            old_budget=self.weekly_budget,
            new_budget=new_budget,
            change_date=datetime.now()
        ).save()

        self.weekly_budget = new_budget
        self.save()
