import secrets
import socketio
import time
import sys
import random
from datetime import datetime


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
            "Light": "lumen",
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
            "Light": (1.0, 5.0, 10.0),
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
        elif self.type == 'GPS':
            lat_value = round(22 + random.random(), ndigits=4)
            long_value = round(73 + random.random() * 5, ndigits=4)
            value = str(lat_value) + '|' + str(long_value)
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
            'timestamp': str(datetime.now())
        }


client = socketio.Client()
sensor = None


@client.on('connect', namespace='/mote')
def on_connect():
    print('Connected to router')


@client.on('disconnect', namespace='/mote')
def on_disconnect():
    print('Disconnected from router')


@client.on('json_message', namespace='/mote')
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
                    'response': 'Received your JSON message'}, namespace='/mote')


@client.on('json_response', namespace='/mote')
def on_json_response(data):
    response = data['response']
    print('JSON Response from router:', response)


if __name__ == '__main__':
    _id = int(sys.argv[1])
    _type = sys.argv[2]
    _module_id = sys.argv[3]
    _module = sys.argv[4]
    _port = int(sys.argv[5])

    sensor = Sensor(_id, _type, _module_id, _module)

    router_url = 'http://127.0.0.1:' + str(_port)

    client.connect(router_url, namespaces=['/mote', '/alert'])

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
                        namespace='/mote')
        if sensor.type == 'GPS':
            time.sleep(20)
        else:
            time.sleep(5)

    client.disconnect()
