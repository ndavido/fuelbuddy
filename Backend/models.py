# models.py
from datetime import datetime
from mongoengine.fields import GenericReferenceField, EmbeddedDocumentField

from mongoengine import Document, StringField, FloatField, IntField, ReferenceField, BooleanField, ListField, \
    DateTimeField, DecimalField, DictField, Q, EmbeddedDocument


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
            new_budget=new_budget,
            change_date=datetime.now()
        ).save()

        self.weekly_budget = new_budget
        self.save()


class WeeklyBudget(EmbeddedDocument):
    amount = DecimalField(precision=2)
    updated_at = DateTimeField(default=datetime.now)


class Deduction(EmbeddedDocument):
    amount = DecimalField(precision=2)
    updated_at = DateTimeField(default=datetime.now)


class BudgetHistory(Document):
    user = ReferenceField('Users', required=True)
    weekly_budgets = ListField(EmbeddedDocumentField(WeeklyBudget))
    deductions = ListField(EmbeddedDocumentField(Deduction))
    change_date = DateTimeField(default=datetime.now)
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
    # Include 'Electric' as an option
    fuel_type = StringField(choices=('Petrol', 'Diesel', 'Electric'))


class PetrolPrices(EmbeddedDocument):
    price = FloatField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)


class DieselPrices(EmbeddedDocument):
    price = FloatField(required=True)
    updated_at = DateTimeField(default=datetime.utcnow)


class OpeningHours(EmbeddedDocument):
    day = StringField()
    hours = StringField()


class FuelStation(Document):
    name = StringField(required=True)
    address = StringField(required=True)
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    place_id = StringField(required=True, unique=True)
    petrol_prices = ListField(EmbeddedDocumentField(PetrolPrices))
    diesel_prices = ListField(EmbeddedDocumentField(DieselPrices))
    opening_hours = ListField(EmbeddedDocumentField(OpeningHours))
    car_wash = BooleanField()
    phone_number = StringField()
    meta = {
        'collection': 'FuelStationTest'
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
# Models for friends and friend requests


class Friends(Document):
    user1 = ReferenceField(Users, reverse_delete_rule='CASCADE')
    user2 = ReferenceField(Users, reverse_delete_rule='CASCADE')
    friendship_start_date = DateTimeField(default=datetime.now)
    last_interacted = DateTimeField()

    meta = {
        'collection': 'Friends',
        'indexes': [
            # Make sure that there is only one entry for a pair of friends
            {'fields': ['user1', 'user2'], 'unique': True}
        ]
    }

    @classmethod
    def are_friends(cls, user1_id, user2_id):
        return cls.objects(
            (Q(user1=user1_id) & Q(user2=user2_id)) |
            (Q(user1=user2_id) & Q(user2=user1_id))
        ).count() > 0


class FriendRequest(Document):
    sender = ReferenceField(Users, reverse_delete_rule='CASCADE')
    recipient = ReferenceField(Users, reverse_delete_rule='CASCADE')
    sent_at = DateTimeField(default=datetime.now)
    message = StringField()
    status = StringField(
        choices=('pending', 'accepted', 'rejected', 'canceled'))
    status_changes = ListField(DictField())

    meta = {
        'collection': 'FriendRequest',
        'indexes': ['sender', 'recipient', 'status']
    }

    def change_status(self, new_status):
        self.status_changes.append({
            'status': new_status,
            'changed_at': datetime.now()
        })
        self.status = new_status
        self.save()


# Notification for friend request sent, friend request accepted, friend request rejected


class Notification(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE')
    message = StringField()
    created_at = DateTimeField(default=datetime.now)
    read_at = DateTimeField()  # Timestamp for when the notification was read
    type = StringField(choices=('friend_request_sent',
                                'friend_request_accepted',
                                'friend_request_rejected',
                                ))
    # To link to related data (like FriendRequest)
    related_document = GenericReferenceField()

    meta = {
        'collection': 'Notifications',
        'indexes': [
            'user',
            '-created_at'  # '-' indicates descending order
        ]
    }

    def mark_as_read(self):
        self.read_at = datetime.now()
        self.save()

# helper function to create a notification


def create_notification(user, message, notification_type):
    notification = Notification(
        user=user,
        message=message,
        type=notification_type
    )
    notification.save()


class Trip(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE')
    start_location = ReferenceField(Location)
    end_location = ReferenceField(Location)
    distance = FloatField()
    meta = {
        'collection': 'Trip'
    }
