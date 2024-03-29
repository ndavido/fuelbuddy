#! /usr/bin/env python3
from mongoengine import Document, ReferenceField, DateTimeField, DecimalField, EmbeddedDocument, ListField, \
    EmbeddedDocumentField, IntField, DateField
from datetime import datetime, date


class Deduction(EmbeddedDocument):
    amount = DecimalField(precision=2)
    updated_at = DateTimeField(default=datetime.now)


class WeekData(EmbeddedDocument):
    date_of_week = DateField(default=datetime.now)
    amount = DecimalField(precision=2)
    deductions = ListField(EmbeddedDocumentField(Deduction))
    updated_at = DateTimeField(default=datetime.now)


class BudgetHistory(Document):
    user = ReferenceField('Users', required=True)
    weekly_budgets = ListField(EmbeddedDocumentField(WeekData))
    change_date = DateTimeField(default=datetime.now)

    meta = {
        'collection': 'BudgetHistory'
    }
