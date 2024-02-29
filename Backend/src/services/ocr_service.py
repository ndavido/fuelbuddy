#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
import io
from src.utils.ocr_utils import extract_receipt_info_single, allowed_file, ocr_cleanup
from src.utils.image_utils import convert_image_to_base64, retrieve_image
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
            image = retrieve_image(file)

            extracted_info_single = extract_receipt_info_single(
                ocr_cleanup(image), image)

            return jsonify(extracted_info_single)
        except Exception as e:
            # Handle general exceptions
            return jsonify({'error': 'Failed to process image', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file format'}), 400
