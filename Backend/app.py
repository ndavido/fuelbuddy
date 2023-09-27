#! usr/bin/python3

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from datetime import datetime

app = Flask(__name__)
CORS(app)

tasks = []

@app.route("/db")
def test_db_connection():
    # Insert a test document
    timestamp = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    test_document = {'Status': 'ok', 'Time': timestamp}
    result = db.databaseStatus.insert_one(test_document)

    # Retrieve the inserted document
    inserted_document = db.databaseStatus.find_one({'_id': result.inserted_id})

    # Print the inserted document
    print(inserted_document)

    return 'Database connection test successful'

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.get_json()
        task = data.get('task')
        if task:
            tasks.append(task)
            return jsonify({'message': 'Task added successfully!'})
        else:
            return jsonify({'error': 'Task cannot be empty!'}), 400
    elif request.method == 'GET':
        return jsonify({'tasks': tasks})

if __name__ == '__main__':
    app.run(debug=True)
