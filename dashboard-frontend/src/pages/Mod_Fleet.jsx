import React from 'react';
import io from 'socket.io-client'

const socket = io(`${import.meta.env.VITE_BASE_URL}:5000`);

const ModFleet = ({ data }) => {
    socket.on('connect', () => {
        console.log('Connected to the server');
    });
    let dest = []
    let coordinates
    let apiKey = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBrKuh2cITMMHsvbR4omhTFfTn6g024l9Y"

    socket.on('json', (incomingData) => {
        if (incomingData.sensorType == "GPS") {
            coordinates = data.value.split("|")
            dest = []
            let reqUrl = apiKey + "&origin=" + coordinates[0] + "," + coordinates[1] + "&destination=" + dest[0] + "," + dest[1]
        }

    })

    return (
        <>
            <iframe
                width="450"
                height="250"
                frameBorder="0" style="border:0"
                referrerPolicy="no-referrer-when-downgrade"
                src={reqUrl}
                allowfullscreen
            >
            </iframe>
        </>
    )
}

export default ModFleet