#! /usr/bin/env python3

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.middleware.api_key_middleware import require_api_key
from src.utils.ocr_utils import extract_receipt_info_single, allowed_file, ocr_cleanup
from src.utils.image_utils import convert_image_to_base64, decode_base64_image
from src.models.receipt_ocr import ReceiptOcr
from src.models.user import Users
import cv2
import numpy as np
import base64


@require_api_key
@jwt_required()
def upload_receipt():
    data = request.get_json()
    image_data_base64 = data.get('image')
    if not image_data_base64:
        return jsonify({'error': 'No image data provided'}), 400

    # Decoding the base64 string to bytes
    image_data = decode_base64_image(image_data_base64)
    if image_data is None:
        return jsonify({'error': 'Invalid or missing image data'}), 400

    # Convert the bytes data to a numpy array and then to an OpenCV image
    nparr = np.frombuffer(image_data, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    try:
        # Assuming ocr_cleanup and extract_receipt_info_single can work directly with the OpenCV image
        extracted_info_single = extract_receipt_info_single(
            ocr_cleanup(img_np), img_np)

        # Re-encode the OpenCV image to base64 for the response if necessary
        _, buffer = cv2.imencode('.jpg', img_np)
        receipt_image_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'extracted_info': extracted_info_single,
            'receipt_image_base64': receipt_image_base64
        })

    except Exception as e:
        return jsonify({'error': 'Failed to process image', 'details': str(e)}), 500


@require_api_key
@jwt_required()
def save_receipt():
    try:
        current_user_id = get_jwt_identity()
        receipt_data = request.get_json()

        user = Users.objects.get(id=current_user_id)

        receipt = ReceiptOcr(
            user=user,
            receipt=receipt_data.get('receipt_image_base64'),
            fuel_type=receipt_data.get('fuel_type'),
            volume=receipt_data.get('volume'),
            price_per_litre=receipt_data.get('price_per_litre'),
            total=receipt_data.get('total')
        )
        receipt.save()

        return jsonify({'message': 'Receipt saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to save receipt', 'details': str(e)}), 500
