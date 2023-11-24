from flask import Flask, render_template, request, jsonify
import flask_socketio
from flask_cors import CORS
import socketio
import sys
import subprocess
import pymongo
import numpy as np
from datetime import datetime, timedelta
from keras.models import Sequential
from keras.layers import Dense, LSTM
import pprint


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
mongo_client = pymongo.MongoClient(
    'mongodb+srv://ds952073:ewebC2Mb1DxZUag5@cluster0.d2el9gu.mongodb.net/')

router = None
module_details = None
db = None
collection = None

predictive_model = Sequential()
predictive_model.add(LSTM(10, input_shape=(1, 1)))
predictive_model.add(Dense(1))
predictive_model.compile(optimizer='adam', loss='mean_squared_error')

forecasting_model = Sequential()
# Hidden layer with 10 neurons and ReLU activation
forecasting_model.add(Dense(10, input_dim=1, activation='relu'))
forecasting_model.add(Dense(1, activation='linear'))


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
    # client.emit('json_message', data, namespace='/router')
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


@app.route('/analytics', methods=['GET'])
def handle_analytics():
    global router, predictive_model, collection
    response = []
    for sensor_id in router.sensors.keys():
        data = collection.find({"sensorId": sensor_id})
        data_points = [int(point['alert']) for point in data]
        pred_output = predictive_model.predict(
            np.array(data_points).reshape(-1, 1))
        next_alert = int(np.mean(pred_output))
        response.append({
            "sensorId": sensor_id,
            "nextAlert": next_alert
        })
    return jsonify(response), 200


@app.route('/forecasting/<sensorId>', methods=['GET'])
def handle_forecasting(sensorId):
    global router, forecasting_model, collection
    response = []
    data = collection.find({"sensorId": int(sensorId)}).sort(
        'timestamp', pymongo.DESCENDING).limit(30)
    data_points = [float(point['value']) for point in data]
    print('Fetched data:', data_points)
    data_points.reverse()
    y = data_points
    X = list(range(1, len(y) + 1))
    forecasting_model.fit(X, y, epochs=100, batch_size=5)
    X_test = list(range(len(y) + 1, len(y) + 11))
    y_pred = forecasting_model.predict(X_test)
    curr_time = datetime.now()
    for y in y_pred:
        response.append({
            'value': float(y[0]),
            'timestamp': str(curr_time)
        })
        curr_time += timedelta(seconds=1)
    return jsonify(response), 200


# @client.on('connect', namespace='/router')
# def on_connect():
#     print('Connected to gateway')


# @client.on('disconnect', namespace='/router')
# def on_disconnect():
#     print('Disconnected from gateway')


def train_predictive_model():
    global predictive_model
    X = np.array([[2], [3], [4], [1], [5], [2], [3], [6], [2], [1],
                  [4], [2], [3], [1], [5], [2], [4], [1], [3], [2],
                  [1], [4], [2], [5], [1], [3], [2], [4], [1], [6]])

    y = np.array([[3], [2], [1], [5], [1], [2], [4], [1], [3], [2],
                  [1], [4], [2], [5], [1], [3], [2], [4], [1], [6],
                  [2], [3], [4], [1], [5], [2], [3], [6], [2], [1]])

    X = np.array(X).reshape(-1, 1, 1)
    y = np.array(y).reshape(-1, 1)

    predictive_model.fit(X, y, epochs=100, batch_size=1)


if __name__ == '__main__':
    module_details = {
        "Fleet": (1, "5001"),
        "Forecasting": (2, "5002"),
        "Predictive": (3, "5003"),
        "RFID": (4, "5004"),
        "Storage": (5, "5005")
    }

    module = sys.argv[1]
    id, port = module_details[module]
    router = Router(id, module, port)
    router.sensors[2] = None

    if module == 'Predictive':
        train_predictive_model()

    forecasting_model.compile(optimizer='adam', loss='mean_squared_error')

    db = mongo_client['test']
    collection = db['sensordata']

    # gateway_url = 'http://127.0.0.1:5000'
    # client.connect(gateway_url, namespaces=['/router'])

    server.run(app, port=router.port, debug=True)
