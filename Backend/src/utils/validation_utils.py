#! /usr/bin/env python3

import re

def validate_phone_number(phone_number):
    pattern = re.compile(r"^(08\d{8}|8\d{8})$")
    return bool(pattern.match(phone_number))

def validate_username(username):
    return bool(username) >= 6


def validate_verification_code(code):
    """
    Validate the format of the verification code.
    """
    return code.isdigit() and len(code) == 6