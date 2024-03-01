#! /usr/bin/env python3

import base64
import io
import cv2
import numpy as np


def convert_image_to_base64(image_data):
    return base64.b64encode(image_data).decode('utf-8')


def retrieve_image(file):
    in_memory_file = io.BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    image = cv2.imdecode(data, cv2.IMREAD_COLOR)
