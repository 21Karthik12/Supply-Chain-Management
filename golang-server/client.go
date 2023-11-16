package main

import (
	...
	socketio "github.com/googollee/go-socket.io"
)

func main() {
	uri := "http://127.0.0.1:8000"

	client, _ := socketio.NewClient(uri, nil)

	// Handle an incoming event
	client.OnEvent("reply", func(s socketio.Conn, msg string) {
		log.Println("Receive Message /reply: ", "reply", msg)
	})

	client.Connect()
	client.Emit("notice", "hello")
	client.Close()
}