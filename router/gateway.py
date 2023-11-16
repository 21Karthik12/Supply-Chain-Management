from flask import Flask, render_template, request, jsonify
import flask_socketio
from flask_cors import CORS
import socketio
import json
import subprocess

app = Flask(__name__)
CORS(app)
server = flask_socketio.SocketIO(app, cors_allowed_origins="*")
ids = set()  # A dictionary to maintain the id's of the nodes
sensor_id = 1  # Sensor ID
NAMESPACE = '/mote'  # Set the namespace


@app.route('/')
def index():
    return render_template('index.html')


@server.on('connect', namespace=NAMESPACE)
def handle_connect():
    print('Sensor connected')


@server.on('disconnect', namespace=NAMESPACE)
def handle_disconnect():
    print('Sensor disconnected')


@server.on('json_message', namespace=NAMESPACE)
def handle_json_message(data):
    print('JSON Message:', data)
    server.emit('json_response', {
                'response': 'Received your JSON message'}, namespace=NAMESPACE)
    # Perform other operations as needed


@server.on('json_response', namespace=NAMESPACE)
def handle_json_response(data):
    print('JSON Response:', data)


@app.route('/create_node', methods=["POST"])
def handle_create_node():
    global sensor_id
    try:
        request_data = request.json
        if request_data:
            node_id = sensor_id
            node_type = request_data['type']
            node_module = request_data['module']
            subprocess.Popen(['python', '.\sensors\sensor.py',
                             str(node_id), node_type, node_module])
            ids.add(node_id)
            sensor_id += 1
            return jsonify({'message': f'Received value: {request_data}'}), 200
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/control_node', methods=["POST"])
def handle_control_node():
    try:
        request_data = request.json
        if request_data:
            server.emit('json_message', request_data, namespace=NAMESPACE)
            return jsonify({'message': f'Received value: {request_data}'}), 200
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


if __name__ == '__main__':
    server.run(app, host='0.0.0.0', port=5001, debug=True)
