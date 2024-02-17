#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, DateTimeField, StringField, GenericReferenceField
from .user import Users
from datetime import datetime


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
