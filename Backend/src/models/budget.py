#! /usr/bin/env python3
from mongoengine import Document, ReferenceField, DateTimeField, DecimalField, EmbeddedDocument, ListField, \
    EmbeddedDocumentField, IntField
from datetime import datetime


class WeeklyBudget(EmbeddedDocument):
    amount = DecimalField(precision=2)
    updated_at = DateTimeField(default=datetime.now)


class Deduction(EmbeddedDocument):
    amount = DecimalField(precision=2)
    updated_at = DateTimeField(default=datetime.now)


class WeekData(EmbeddedDocument):
    amount = DecimalField(precision=2)
    updated_at = DateTimeField(default=datetime.now)


class DeductionWeeks(EmbeddedDocument):
    week = ListField(EmbeddedDocumentField(WeekData))


class WeeklyBudgetWeeks(EmbeddedDocument):
    week = ListField(EmbeddedDocumentField(WeekData))


class BudgetHistory(Document):
    user = ReferenceField('Users', required=True)
    weekly_budgets = ListField(EmbeddedDocumentField(WeeklyBudget))
    deductions = ListField(EmbeddedDocumentField(Deduction))
    change_date = DateTimeField(default=datetime.now)
    meta = {
        'collection': 'BudgetHistory'
    }


class WeeklyBudgetHistory(Document):
    user = ReferenceField('Users', required=True)
    weekly_budgets = ListField(EmbeddedDocumentField(WeeklyBudgetWeeks))
    deductions = ListField(EmbeddedDocumentField(DeductionWeeks))
    change_date = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'WeeklyBudgetHistory'
    }
