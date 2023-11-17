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
        self.sensors = {}  # A dictionary to maintain the id and status of the sensors

    def create_sensor(self, data):
        node_id = data['sensorId']
        node_type = data['type']
        node_module = data['module']
        subprocess.Popen(['python', './sensors/sensor.py',
                          str(node_id), node_type, str(self.module_id), node_module, self.port])
        self.sensors[node_id] = {
            'sensorId': node_id,
            'sensorType': node_type,
            'moduleId': self.module_id,
            'module': self.module,
            'active': False,
            'alert': False
        }
        return self.sensors[node_id]

    def remove_sensor(self, node_id):
        self.sensors.pop(node_id)


app = Flask(__name__)
CORS(app)
server = flask_socketio.SocketIO(app, cors_allowed_origins="*")
client = socketio.Client()
router = None


@app.route('/')
def index():
    return render_template('index.html')


@server.on('connect', namespace='/mote')
def handle_connect():
    print('Sensor connected')


@server.on('disconnect', namespace='/mote')
def handle_disconnect():
    print('Sensor disconnected')


@server.on('json_message', namespace='/mote')
def handle_json_message(data):
    print('JSON Message:', data)
    server.emit('json_response', {
                'response': 'Received your JSON message'}, namespace='/mote')
    client.emit('json_message', data, namespace='/router')
    # Perform other operations as needed


@server.on('json_response', namespace='/mote')
def handle_json_response(data):
    print('JSON Response:', data)


@server.on('json_message', namespace='/alert')
def handle_alert(data):
    global router
    sensor_id = data['sensorId']
    router.sensors[sensor_id]['alert'] = True
    print('Alert sensor id:', sensor_id)


@app.route('/createSensor', methods=["POST"])
def handle_create_node():
    global router
    try:
        request_data = request.json
        if request_data:
            return jsonify(router.create_sensor(request_data)), 200
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/controlSensor', methods=["POST"])
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
            else:
                return jsonify({'message': 'Invalid option'}), 400
            server.emit('json_message', request_data, namespace='/mote')
            return jsonify({'message': f'Received value: {request_data}'}), 200
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/getSensors', methods=['GET'])
def handle_get_sensors():
    global router
    return jsonify(list(router.sensors.values()))


@app.route('/getSensor/<sensorId>', methods=['GET'])
def handle_get_sensor(sensorId):
    global router
    node_id = int(sensorId)
    if node_id in router.sensors:
        return jsonify(router.sensors[int(sensorId)]), 200
    return jsonify({'message': 'Sensor not found'}), 400


@client.on('connect', namespace='/router')
def on_connect():
    print('Connected to gateway')


@client.on('disconnect', namespace='/router')
def on_disconnect():
    print('Disconnected from gateway')


if __name__ == '__main__':
    router = Router(int(sys.argv[1]), sys.argv[2], sys.argv[3])
    
    gateway_url = 'http://127.0.0.1:5000'
    client.connect(gateway_url, namespaces=['/router'])

    server.run(app, port=router.port, debug=True)