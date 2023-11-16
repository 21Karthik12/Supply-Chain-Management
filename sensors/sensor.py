import secrets
import socketio
import time
import sys
import random


class Sensor:
    def __init__(self, id, type, module_id, module):
        self.id = id
        self.type = type
        self.module_id = module_id
        self.module = module
        units = {
            "Temperature": "celsius",
            "Humidity": "rh",
            "Pressure": "bar",
            "RFID": "ID",
            "GPS": "Lat|Long",
            "Accelerometer": "cm/s^2",
            "Speedometer": "cm/s",
            "Photosensor": "lumen",
            "IR": "nm"
        }
        self.unit = units[type]
        value_range = {
            "Temperature": (0.0, 100.0, 150.0),
            "Humidity": (0.0, 100.0, 150.0),
            "Pressure": (1.0, 5.0, 10.0),
            "RFID": None,
            "GPS": (-180.0, 180.0, 360.0),
            "Accelerometer": (1.0, 5.0, 10.0),
            "Speedometer": (20.0, 50.0, 100.0),
            "Photosensor": (1.0, 5.0, 10.0),
            "IR": (780.0, 50000.0, 60000.0)
        }
        self.value_range = value_range[type]
        self.alert = False
        self.alive = True
        self.passive = True

    def try_alert(self):
        alert_prob = 0.05
        if random.random() < alert_prob:
            self.alert = True

    def generate_data(self):
        value = None
        if self.type == 'RFID':
            value = secrets.token_hex(5).upper()
            if value[-1] == '7':
                self.alert = True
        else:
            self.try_alert()
            lower = self.value_range[0]
            upper = self.value_range[1]
            critical = self.value_range[2]
            if self.alert:
                range = critical - upper
                value = round(upper + random.random() * range, ndigits=1)
            else:
                range = upper - lower
                value = round(lower + random.random() * range, ndigits=1)
        return {
            'sensorId': self.id,
            'sensorType': self.type,
            'moduleId': self.module_id,
            'module': self.module,
            'value': value,
            'unit': self.unit,
            'alert': self.alert,
            'timestamp': time.time()
        }


client = socketio.Client()
sensor = None
# Set the namespace, which will be a variable through which the server client connect
namespace = '/mote'


@client.on('connect', namespace=namespace)
def on_connect():
    print('Connected to server')


@client.on('disconnect', namespace=namespace)
def on_disconnect():
    print('Disconnected from server')


@client.on('json_message', namespace=namespace)
def handle_json_message(data):
    global sensor
    print(data)
    command = data['command']
    sent_id = None
    if 'sensorId' in data:
        sent_id = data['sensorId']
    print('Received command:', command)
    if sent_id == sensor.id:
        if command.lower() == 'toggle':
            sensor.passive = not sensor.passive
        elif command.lower() == 'stop':
            sensor.alive = False
        elif command.lower() == 'resolve':
            sensor.alert = False
        else:
            print("Invalid option!")
        client.emit('json_response', {
                    'response': 'Received your JSON message'}, namespace=namespace)


@client.on('json_response', namespace=namespace)
def on_json_response(data):
    response = data['response']
    print('JSON Response from router:', response)


if __name__ == '__main__':
    _id = int(sys.argv[1])
    _type = sys.argv[2]
    _module_id = sys.argv[3]
    _module = sys.argv[4]

    sensor = Sensor(_id, _type, _module_id, _module)

    server_url = 'http://127.0.0.1:5001'

    client.connect(server_url, namespaces=[namespace, '/alert'])

    while sensor.alive:
        if not sensor.passive:
            print('Sending data')
            data = sensor.generate_data()
            if data['alert']:
                print('Sensor alerting!')
                client.emit('json_message', {
                    'sensorId': sensor.id,
                    'alert': True
                }, namespace='/alert')
            client.emit('json_message', data,
                        namespace=namespace)
        time.sleep(1)

    client.disconnect()