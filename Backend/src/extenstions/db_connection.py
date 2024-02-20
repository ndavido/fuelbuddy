#! /usr/bin/env python3

from mongoengine import connect
from src.config import MONGO_DB_NAME, MONGO_URI


def db_connect():
    connect(
        db=MONGO_DB_NAME,
        host=MONGO_URI,
        alias='default'
    )
    return connect
