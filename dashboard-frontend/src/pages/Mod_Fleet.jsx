import React from 'react';
import { useState } from 'react';
import io from 'socket.io-client'

const socket = io(`${import.meta.env.VITE_BASE_URL}:5000`);

const Mod_Fleet = () => {
    const [reqUrl, setReqUrl] = useState("")
    socket.on('connect', () => {
        console.log('Connected to the server');
    });
    let dest = ["28.8724", "77.7891"]
    let coordinates = []
    let apiKey = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBrKuh2cITMMHsvbR4omhTFfTn6g024l9Y"

    socket.on('json', (incomingData) => {
        if (incomingData.sensorType == "GPS") {
            coordinates = incomingData.value.split("|")
            let temp = apiKey + "&origin=" + coordinates[0] + "," + coordinates[1] + "&destination=" + dest[0] + "," + dest[1]
            setReqUrl(temp)
            //console.log(reqUrl)
        }
    })
    
    return (
        <>
            <iframe
                width="450"
                height="250"
                referrerPolicy="no-referrer-when-downgrade"
                src={reqUrl}
            >
            </iframe>
        </>
    )
}

export default Mod_Fleet