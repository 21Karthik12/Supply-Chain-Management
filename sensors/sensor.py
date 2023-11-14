import socketio
import time
import sys
import random

client = socketio.Client()
alive = True
passive = True
_id = -1
_type = None
_module = None

NAMESPACE = '/mote'  # Set the namespace, which will be a variable through which the server client connect

@client.on('connect', namespace=NAMESPACE)
def on_connect():
    print('Connected to server')


@client.on('disconnect', namespace=NAMESPACE)
def on_disconnect():
    print('Disconnected from server')


@client.on('stop', namespace=NAMESPACE)
def on_disconnect():
    print('STOPPING SERVER')



@client.on('json_message', namespace=NAMESPACE)
def handle_json_message(data):
    global alive, passive
    print(data)
    command = data['command']
    sent_id = None
    if 'id' in data:
        sent_id = data['id']
    print('Received command:', command)
    if sent_id == _id:
        if command.lower() == 'start':
            passive = False
        elif command.lower() == 'stop':
            alive = False
        elif command.lower() == 'pause':
            passive = True
        else:
            print("Invalid option!")
        client.emit('json_response', {'response': 'Received your JSON message'}, namespace=NAMESPACE)


@client.on('json_response', namespace=NAMESPACE)
def on_json_response(data):
    response = data['response']
    print('JSON Response from router:', response)


def generate_data():
    global _id, _type
    _value = None
    _unit = None
    if _type == 'Temperature':
        _value = round(random.random() * 100, ndigits=1)
        _unit = 'Celsius'
    elif _type == 'Humidity':
        _value = round(random.random() * 100)
        _unit = 'Rh'
    elif _type == 'Pressure':
        _value = round(random.random() * 5, ndigits=1)
        _unit = 'Bar'
    return {
        'sensorID': _id,
        'sensorType': _type,
        'module': _module,
        'Value': _value,
        'Unit': _unit
    }


if __name__ == '__main__':
    _id = int(sys.argv[1])
    _type = sys.argv[2]
    _module = sys.argv[3]

    server_url = 'http://127.0.0.1:5001'

    client.connect(server_url, namespaces=[NAMESPACE])

    while alive:
        if not passive:
            print('Sending data')
            client.emit('json_message', generate_data(), namespace=NAMESPACE)
        time.sleep(1)

    client.disconnect()
