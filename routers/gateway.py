from flask import Flask, render_template, request, jsonify
import flask_socketio
from flask_cors import CORS
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)
server = flask_socketio.SocketIO(app, cors_allowed_origins="*")
routers = {}
sensors = {}
modules = {}
sensor_id = 1


@app.route('/')
def index():
    return render_template('index.html')


@server.on('connect', namespace='/router')
def handle_connect():
    print('Router connected')


@server.on('disconnect', namespace='/router')
def handle_disconnect():
    print('Router disconnected')


@server.on('json_message', namespace='/router')
def handle_json_message(data):
    print('JSON Message:', data)
    server.emit('json_response', {
                'response': 'Received your JSON message'}, namespace='/router')
    server.emit('json', data, namespace='/')
    # Perform other operations as needed


@server.on('json_response', namespace='/router')
def handle_json_response(data):
    print('JSON Response:', data)


@app.route('/createSensor', methods=["POST"])
def handle_create_node():
    try:
        global sensor_id
        request_data = request.json
        if request_data:
            request_data['sensorId'] = sensor_id
            module = request_data['module']
            response = requests.post(
                routers[module] + '/createSensor', json=request_data)
            response_json = response.json()
            node_id = response_json['sensorId']
            sensors[module].add(node_id)
            sensor_id += 1
            return response_json, response.status_code

        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/rfid', methods=['GET'])
def handle_rfid():
    uid = request.args.get('card_uid')
    response = {
        'scannedId': uid,
        'moduleId': 4,
        'timestamp': str(datetime.now())
    }
    server.emit('json', response)
    return jsonify(response), 200


@app.route('/controlSensor/<sensorId>', methods=["POST"])
def handle_control_node(sensorId):
    try:
        global routers, sensors
        request_data = request.json
        if request_data:
            node_id = int(sensorId)
            module_to_send = None
            for module in sensors:
                if node_id in sensors[module]:
                    module_to_send = module
                    break

            if module_to_send is None:
                return jsonify({"message": "Invalid module"}), 400

            request_data['sensorId'] = int(sensorId)
            response = requests.post(
                routers[module_to_send] + '/controlSensor', json=request_data)

            if request_data['command'] == 'stop':
                sensors[module_to_send].remove(node_id)

            return response.json(), response.status_code
        else:
            return jsonify({'message': 'Invalid data in the request body'}), 400
    except Exception as e:
        return jsonify({'message': f'Error processing request: {str(e)}'}), 500


@app.route('/getSensors', methods=['GET'])
def handle_get_sensors():
    global routers
    all_sensors = []
    for module in routers:
        try:
            response = requests.get(routers[module] + '/getSensors')
            all_sensors += response.json()
        except Exception:
            print('Failed to get module:', module)
    return jsonify(all_sensors), 200


@app.route('/getSensors/<moduleId>', methods=['GET'])
def handle_get_module_sensors(moduleId):
    global routers, modules
    response = requests.get(routers[modules[int(moduleId)]] + '/getSensors')
    return response.json(), response.status_code


@app.route('/getSensor/<sensorId>', methods=['GET'])
def handle_get_sensor(sensorId):
    global routers, modules
    module_to_send = None
    node_id = int(sensorId)
    for module in sensors:
        if node_id in sensors[module]:
            module_to_send = module
            break

    if module_to_send is None:
        return jsonify({"message": "Invalid sensor"}), 400

    response = requests.get(routers[module_to_send] + '/getSensor/' + sensorId)
    return response.json(), response.status_code


@app.route('/analytics', methods=['GET'])
def handle_get_analytics():
    response = requests.get(routers['Predictive'] + '/analytics')
    return response.json(), response.status_code


@app.route('/forecasting/<sensorId>', methods=['GET'])
def handle_get_forecasting(sensorId):
    response = requests.get(
        routers['Forecasting'] + '/forecasting/' + sensorId)
    return response.json(), response.status_code


if __name__ == '__main__':
    routers = {
        "Fleet": 'http://127.0.0.1:5001',
        "Forecasting": 'http://127.0.0.1:5002',
        "Predictive": 'http://127.0.0.1:5003',
        "RFID": 'http://127.0.0.1:5004',
        "Storage": 'http://127.0.0.1:5005'
    }
    modules = {
        1: "Fleet",
        2: "Forecasting",
        3: "Predictive",
        4: "RFID",
        5: "Storage"
    }
    for module in routers:
        sensors[module] = set()

    server.run(app, host='0.0.0.0', port=5000, debug=True)
