# models.py
from datetime import datetime

from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, BooleanField, ListField, \
    DateTimeField, DecimalField


class Location(Document):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)

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
        # Record the old and new budget
        BudgetHistory(
            user=self,
            old_budget=self.weekly_budget,
            new_budget=new_budget,
            change_date=datetime.now()
        ).save()

        self.weekly_budget = new_budget
        self.save()

class BudgetHistory(Document):
    user = ReferenceField(Users, required=True)
    old_budget = DecimalField(precision=2)
    new_budget = DecimalField(precision=2)
    change_date = DateTimeField(required=True)
    meta = {
        'collection': 'BudgetHistory'
    }

class Vehicle(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE')
    year = IntField()
    make = StringField()
    model = StringField()
    engine_size = StringField()
    license_plate = StringField()
    fuel_type = StringField(choices=('Petrol', 'Diesel', 'Electric'))  # Include 'Electric' as an option

class FuelStation(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    is_charging_station = BooleanField(required=True)
    is_fuel_station = BooleanField(required=True)
    meta = {
        'collection': 'FuelStation'
    }
    # charging_price = FloatField()
    # petrol_price = FloatField()
    # diesel_price = FloatField()

class FuelPrices(Document):
    fuel_station = ReferenceField(FuelStation, reverse_delete_rule='CASCADE')
    petrol_price = FloatField()
    diesel_price = FloatField()
    electricity_price = FloatField()  # Price per kWh
    updated_at = DateTimeField(required=True)

class Friends(Document):
    user1 = ReferenceField(Users, reverse_delete_rule='CASCADE')
    user2 = ReferenceField(Users, reverse_delete_rule='CASCADE')
    friendship_start_date = DateTimeField(default=datetime.now)
    meta = {
        'collection': 'Friends'
    }

class FriendRequest(Document):
    sender = ReferenceField(Users, reverse_delete_rule='CASCADE')
    recipient = ReferenceField(Users, reverse_delete_rule='CASCADE')
    sent_at = DateTimeField(default=datetime.now)
    status = StringField(choices=('pending', 'accepted', 'rejected', 'canceled'))
    meta = {
        'collection': 'FriendRequest'
    }
