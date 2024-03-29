#! /usr/bin/env python3

from flask import Blueprint
from ..services import upload_receipt, save_receipt

ocr_blueprint = Blueprint('ocr', __name__)

ocr_blueprint.route('/ocr_reciept_image_upload',
                    methods=['POST'])(upload_receipt)
ocr_blueprint.route('/ocr_reciept_image_save', methods=['POST'])(save_receipt)
