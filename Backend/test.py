import requests
import json
import random

# route url
api_url = 'http://127.0.0.1:5000/store_petrol_fuel_prices'

data = {
    "petrol_fuel_prices": [
        {
            "station_name": "Dublin Station 1",
            "location": "Dublin, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T10:00:00"
        },
        {
            "station_name": "Cork Fuel Stop",
            "location": "Cork, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T10:15:00"
        },
        {
            "station_name": "Galway Petrol Depot",
            "location": "Galway, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T10:30:00"
        },
        {
            "station_name": "Limerick Gas Station",
            "location": "Limerick, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T10:45:00"
        },
        {
            "station_name": "Belfast Fuel Mart",
            "location": "Belfast, Northern Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T11:00:00"
        },
        {
            "station_name": "Waterford Gas 'n Go",
            "location": "Waterford, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T11:15:00"
        },
        {
            "station_name": "Derry Diesel Stop",
            "location": "Derry, Northern Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T11:30:00"
        },
        {
            "station_name": "Kilkenny Fuel Express",
            "location": "Kilkenny, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T11:45:00"
        },
        {
            "station_name": "Wexford Gas Haven",
            "location": "Wexford, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T12:00:00"
        },
        {
            "station_name": "Donegal Fuel Center",
            "location": "Donegal, Ireland",
            "price_per_liter": round(random.uniform(1.5, 2.0), 2),
            "date_recorded": "2023-11-05T12:15:00"
        }
    ]
}

try:
    # post it to url
    response = requests.post(api_url, json=data)
    # output response
    print("Response Content:", response.content)

    # Check the response
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Error:", response.status_code, response.json())

except Exception as e:
    print("Error:", str(e))
