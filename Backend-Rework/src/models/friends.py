#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, DateTimeField, StringField, ListField, DictField, Q
from .user import Users
from datetime import datetime

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