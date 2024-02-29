#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
import io
from src.utils.ocr_utils import extract_receipt_info_single, allowed_file, ocr_cleanup
import cv2
import numpy as np


def upload_file():

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

            extracted_info_single = extract_receipt_info_single(
                ocr_cleanup(image), image)

            return jsonify(extracted_info_single)
        except Exception as e:
            # Handle general exceptions
            return jsonify({'error': 'Failed to process image', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400
