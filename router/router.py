import time
from flask import Flask, render_template
import flask_socketio
from flask_cors import CORS
import socketio
import json

app = Flask(__name__)
CORS(app)
server = flask_socketio.SocketIO(app, cors_allowed_origins="*")
ledger_client = socketio.Client()


@app.route('/')
def index():
    return render_template('index.html')


@server.on('json_message', namespace='/mote')
def handle_json_message(data):
    print('JSON Message:', data)
    server.emit('json_response', {
                'response': 'Received your JSON message'}, namespace='/mote')
    ledger_client.emit('json', data, namespace='/')
    server.emit('json', data, namespace='/')


@server.on('json_response', namespace='/mote')
def handle_json_response(data):
    print('JSON Response:', data)


@server.on('connect', namespace='/mote')
def handle_connect():
    print('Sensor connected')
    server.emit('json_message', {'command': 'start'}, namespace='/mote')


@server.on('disconnect', namespace='/mote')
def handle_disconnect():
    print('Sensor disconnected')


@server.on('connect')
def handle_connect():
    print('Dashboard connected')


@server.on('disconnect')
def handle_disconnect():
    print('Dashboard disconnected')


if __name__ == '__main__':
    ledger_url = 'http://192.168.108.24:3001'

    @ledger_client.event
    def connect():
        print('Connected to server')

    @ledger_client.event
    def disconnect():
        print('Disconnected from server')

    ledger_client.connect(ledger_url, namespaces=['/'])

    server.run(app, host='0.0.0.0', port=3001, debug=True)
