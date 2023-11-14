import socketio
import time
import sys
import random

client = socketio.Client()
alive = True
passive = True


@client.on('json_message', namespace='/mote')
def handle_json_message(data):
    global alive, passive
    command = data['command']
    print('Received command:', command)
    if command.lower() == 'start':
        passive = False
    elif command.lower() == 'stop':
        alive = False
    elif command.lower() == 'pause':
        passive = True
    client.emit('json_response', {'response': 'Received your JSON message'})


@client.on('json_response', namespace='/mote')
def on_json_response(data):
    response = data['response']
    print('JSON Response from router:', response)


def generate_data():
    _id = int(sys.argv[1])
    _type = sys.argv[2]
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
        'Value': _value,
        'Unit': _unit
    }


if __name__ == '__main__':
    server_url = 'http://127.0.0.1:3001'  # Replace with the actual server URL

    @client.event
    def connect():
        print('Connected to server')

    @client.event
    def disconnect():
        print('Disconnected from server')

    client.connect(server_url, namespaces=['/mote'])

    while alive:
        if not passive:
            print('Sending data')
            client.emit('json_message', generate_data(), namespace='/mote')
        time.sleep(1)

    client.disconnect()
