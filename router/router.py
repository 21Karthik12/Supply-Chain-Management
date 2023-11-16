from flask import Flask, render_template, request, jsonify
import flask_socketio
from flask_cors import CORS
import socketio
import json
import sys
import subprocess


class Router:
    def __init__(self, module_id, module, port):
        self.module_id = module_id
        self.module = module
        self.port = port
        self.sensor_id = 1
        self.sensors = {}  # A dictionary to maintain the id and status of the sensors

    def create_sensor(self, data):
        node_id = self.sensor_id
        node_type = data['type']
        node_module = data['module']
        subprocess.Popen(['python', './sensors/sensor.py',
                          str(node_id), node_type, str(self.module_id), node_module])
        self.sensors[node_id] = {
            'sensorId': node_id,
            'sensorType': node_type,
            'module_id': self.module_id,
            'module': self.module,
            'active': False,
            'alert': False
        }
        self.sensor_id += 1

    def remove_sensor(self, node_id):
        self.sensors.pop(node_id)


app = Flask(__name__)
CORS(app)
server = flask_socketio.SocketIO(app, cors_allowed_origins="*")
namespace = '/mote'  # Set the namespace
router = None


@app.route('/')
def index():
    return render_template('index.html')


@server.on('connect', namespace=namespace)
def handle_connect():
    print('Sensor connected')


@server.on('disconnect', namespace=namespace)
def handle_disconnect():
    print('Sensor disconnected')


@server.on('json_message', namespace=namespace)
def handle_json_message(data):
    print('JSON Message:', data)
    server.emit('json_response', {
                'response': 'Received your JSON message'}, namespace=namespace)
    # Perform other operations as needed


@server.on('json_response', namespace=namespace)
def handle_json_response(data):
    print('JSON Response:', data)


@server.on('json_message', namespace='/alert')
def handle_alert(data):
    global router
    sensor_id = data['sensorId']
    router.sensors[sensor_id]['alert'] = True
    print('Alert sensor id:', sensor_id)


@app.route('/create_node', methods=["POST"])
def handle_create_node():
    global router
    try:
        request_data = request.json
        if request_data:
            router.create_sensor(request_data)
            return jsonify({'message': f'Received value: {request_data}'}), 200
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/control_node', methods=["POST"])
def handle_control_node():
    try:
        global router
        request_data = request.json
        if request_data:
            sensor_id = request_data['sensorId']
            if request_data['command'] == 'stop':
                router.remove_sensor(sensor_id)
            elif request_data['command'] == 'toggle':
                router.sensors[sensor_id]['active'] = not router.sensors[sensor_id]['active']
            elif request_data['command'] == 'resolve':
                router.sensors[sensor_id]['alert'] = False
            server.emit('json_message', request_data, namespace=namespace)
            return jsonify({'message': f'Received value: {request_data}'}), 200
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/getSensors', methods=['GET'])
def handle_get_sensors():
    global router
    return jsonify(router.sensors)


if __name__ == '__main__':
    router = Router(int(sys.argv[1]), sys.argv[2], sys.argv[3])
    server.run(app, host='0.0.0.0', port=router.port, debug=True)
