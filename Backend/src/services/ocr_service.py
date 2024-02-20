#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
import io
from src.utils.ocr_utils import extract_receipt_info_single, allowed_file


def upload_file():
    import cv2
    import numpy as np
    import pytesseract

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        try:
            # Read the file's content into a numpy array
            in_memory_file = io.BytesIO()
            file.save(in_memory_file)
            data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
            image = cv2.imdecode(data, cv2.IMREAD_COLOR)

            # Process the image
            image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            image = cv2.threshold(
                image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
            text = pytesseract.image_to_string(image)
            filtered_text = '\n'.join(
                line for line in text.split('\n') if line.strip() != '')

            extracted_info_single = extract_receipt_info_single(filtered_text)

            return jsonify(extracted_info_single)
        except Exception as e:
            # Handle general exceptions
            return jsonify({'error': 'Failed to process image', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400
