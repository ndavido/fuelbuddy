#! /usr/bin/env python3

from mongoengine import Document, ReferenceField, DateTimeField, DecimalField, EmbeddedDocument, ListField, EmbeddedDocumentField
from datetime import datetime


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
