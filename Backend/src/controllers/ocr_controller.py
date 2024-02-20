#! /usr/bin/env python3

from flask import Blueprint
from src.services.ocr_service import upload_file

ocr_blueprint = Blueprint('ocr', __name__)

ocr_blueprint.route('/ocr_reciept_image_upload', methods=['POST'])(upload_file)
