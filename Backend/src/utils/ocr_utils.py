#! /usr/bin/env python3

import cv2
import pytesseract
import re
from fuzzywuzzy import process


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}


def preprocess(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return thresh


def ocr_cleanup(image):
    custom_config = r'--oem 3 --psm 6 outputbase'

    text = pytesseract.image_to_string(image, config=custom_config)
    filtered_text = '\n'.join(
        line for line in text.split('\n') if line.strip() != '')

    return filtered_text


def extract_fuel_type(text_lower, fuel_type_choices):
    fuel_type_match = process.extractOne(
        text_lower, fuel_type_choices, score_cutoff=50)
    if fuel_type_match:
        return fuel_type_match[0]
    return None


def extract_volume(text_lower, volume_pattern):
    volume_match = re.search(volume_pattern, text_lower)
    if volume_match:
        volume = next((m for m in volume_match.groups() if m), None)
        if volume is not None:
            return volume.replace(' ', '').replace(',', '.')
    return None


def extract_price_per_litre(text_lower, price_per_litre_pattern):
    price_per_litre_match = re.search(price_per_litre_pattern, text_lower)
    if price_per_litre_match:
        price_per_litre = next(
            (m for m in price_per_litre_match.groups() if m), None)
        if price_per_litre is not None:
            return price_per_litre.replace(' ', '').replace(',', '.')
    return None


def calculate_total(volume, price_per_litre):
    if volume is not None and price_per_litre is not None:
        total = float(volume) * float(price_per_litre)
        return round(total, 2)
    return None


def no_match_preprocessing(image):
    preprocessed_image = preprocess(image)
    preprocessed_text = ocr_cleanup(preprocessed_image)
    return preprocessed_text


def extract_receipt_info_single(receipt_text, image):
    text_lower = receipt_text.lower()

    info = {
        'fuel_type': None,
        'volume': None,
        'price_per_litre': None,
        'total': None
    }

    volume_pattern = r"(?i)(?:volume|;|:|diesel|unleaded|pump\s*([a-z]|[0-9])|\))\s*(\d+(?:[.,]\d{1,2}))\s*(ltr|l|net)?"
    price_per_litre_pattern = r"(?:price|€)\s*([1-9]?\s*[.,]\d{3})\s*(eur/l|/l|/)?\s*"
    fuel_type_choices = ["unleaded", "diesel"]

    # Extract information using helper functions
    info['fuel_type'] = extract_fuel_type(text_lower, fuel_type_choices)

    info['volume'] = extract_volume(text_lower, volume_pattern)
    if info['volume'] is None:
        # Apply preprocessing if volume not found
        preprocessed_text = no_match_preprocessing(image)
        info['volume'] = extract_volume(
            preprocessed_text.lower(), volume_pattern)

    info['price_per_litre'] = extract_price_per_litre(
        text_lower, price_per_litre_pattern)
    if info['price_per_litre'] is None:
        preprocessed_text = no_match_preprocessing(image)
        info['price_per_litre'] = extract_price_per_litre(
            preprocessed_text.lower(), price_per_litre_pattern)

    info['total'] = calculate_total(info['volume'], info['price_per_litre'])

    return info
