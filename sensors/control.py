import socketio
import json
import secrets
from datetime import datetime

sio = socketio.Client()


@sio.on('json_response')
def on_json_response(data):
    response = data['response']
    print('JSON Response from server:', response)


if __name__ == '__main__':
    # server_url = 'http://127.0.0.1:5000'  # Replace with the actual server URL

    # @sio.event
    # def connect():
    #     print('Connected to server')

    # @sio.event
    # def disconnect():
    #     print('Disconnected from server')

    # sio.connect(server_url)

    # while True:
    #     message = input("Enter a message (or 'exit' to quit): ")
    #     if message.lower() == 'exit':
    #         break

    #     data = {'message': message}
    #     sio.emit('json_message', data)

    # sio.disconnect()
    print(str(datetime.now()))
