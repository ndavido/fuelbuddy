#! /usr/bin/env python3

import os
import binascii
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from ..config import ENCRYPTION_KEY, AES_FIXED_IV
from dotenv import load_dotenv

load_dotenv()


def get_aes_key():
    key_hex = os.environ.get('ENCRYPTION_KEY')
    iv_hex = os.environ.get('AES_FIXED_IV')

    key = binascii.unhexlify(key_hex)
    iv = binascii.unhexlify(iv_hex)

    return key, iv


encryption_key, fixed_iv = get_aes_key()


def aes_encrypt(plaintext, key):
    cipher = AES.new(key, AES.MODE_CBC, fixed_iv)
    padded_text = pad(plaintext.encode(), AES.block_size)
    return cipher.encrypt(padded_text).hex()


def aes_decrypt(ciphertext, key):
    cipher = AES.new(key, AES.MODE_CBC, fixed_iv)
    decrypted_data = unpad(cipher.decrypt(
        bytes.fromhex(ciphertext)), AES.block_size)
    return decrypted_data.decode()
