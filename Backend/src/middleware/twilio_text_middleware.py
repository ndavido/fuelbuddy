#! /usr/bin/env python3

from twilio.rest import Client
from ..config import TWILIO_AUTH_TOKEN, TWILIO_SID, TWILIO_PHONE_NUMBER

account_sid = TWILIO_SID
auth_token = TWILIO_AUTH_TOKEN
twilio_number = TWILIO_PHONE_NUMBER


def send_text_code(verification_code, full_phone_number):

    twilio_client = Client(account_sid, auth_token)

    twilio_client.messages.create(
        to=full_phone_number,
        from_=twilio_number,
        body=f"Your verification code is: {verification_code}"
    )
    return True
