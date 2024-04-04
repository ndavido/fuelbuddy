#! /usr/bin/env python3

from mongoengine import Document, EmbeddedDocument, EmbeddedDocumentListField, ReferenceField, StringField, DateTimeField, BooleanField
from datetime import datetime
from mongoengine.queryset.visitor import Q
from .user import Users


class Message(EmbeddedDocument):
    sender = StringField(required=True, choices=(
        'user', 'admin'))  # Restrict to 'user' or 'admin'
    content = StringField(required=True)
    timestamp = DateTimeField(default=datetime.utcnow)


class SupportTicket(Document):
    user = ReferenceField(Users, reverse_delete_rule='CASCADE', required=True)
    messages = EmbeddedDocumentListField(Message)
    # Track if the ticket is open or closed
    is_open = BooleanField(default=True)
    # User confirmation if the issue is solved
    is_solved = BooleanField(default=False)
    # Keep track of the last update
    last_updated = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'support_ticket',
        'indexes': [
            {'fields': ['-last_updated']}
        ]
    }
# , 'background': True
