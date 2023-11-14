import { Card, CardHeader, CardBody, Text, Heading, CardFooter } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
    TableContainer,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const data = [
    {
        "Timestamp": "2023-11-11T08:15:00",
        "SensorID": "S001",
        "SensorType": "Pressure",
        "SensorData": 1013.2
    },
    {
        "Timestamp": "2023-11-11T09:45:00",
        "SensorID": "S002",
        "SensorType": "Humidity",
        "SensorData": 60.8
    },
    {
        "Timestamp": "2023-11-11T11:20:00",
        "SensorID": "S003",
        "SensorType": "Temperature",
        "SensorData": 22.7
    },
    {
        "Timestamp": "2023-11-11T13:05:00",
        "SensorID": "S004",
        "SensorType": "Vibration",
        "SensorData": 0.015
    },
    {
        "Timestamp": "2023-11-11T14:40:00",
        "SensorID": "S005",
        "SensorType": "Light",
        "SensorData": 550
    },
    {
        "Timestamp": "2023-11-11T16:10:00",
        "SensorID": "S006",
        "SensorType": "Motion",
        "SensorData": 1
    },
    {
        "Timestamp": "2023-11-11T17:45:00",
        "SensorID": "S007",
        "SensorType": "Sound",
        "SensorData": 40
    },
    {
        "Timestamp": "2023-11-11T19:20:00",
        "SensorID": "S008",
        "SensorType": "Gas",
        "SensorData": 0.02
    },
    {
        "Timestamp": "2023-11-11T20:55:00",
        "SensorID": "S009",
        "SensorType": "Proximity",
        "SensorData": 3
    },
    {
        "Timestamp": "2023-11-11T22:30:00",
        "SensorID": "S010",
        "SensorType": "Voltage",
        "SensorData": 12.5
    }
]



const DataStream = () => {

    const [mdata, setData] = useState([])

    useEffect(() => {
        const socket = io('http://localhost:3001')
        socket.on('mqtt-message', (data) => {
            console.log(data.topic, data.message)
            const currentTime = new Date();
            const year = currentTime.getFullYear();
            const month = currentTime.getMonth() + 1; // Months are zero-based
            const day = currentTime.getDate();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const seconds = currentTime.getSeconds();

            const formattedTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            let temp = {
                timestamp: formattedTimeString,
                topic: data.topic,
                message: data.message
            }
            setData((prevData) => [...prevData, temp])
            setData((prevData) => prevData.slice(-30))
        })
    }, []); // Empty dependency array ensures the effect runs only once on mount


    return (
        <>
            <Card width={"100%"}>
                <CardHeader>
                    <Heading size='md'>Realtime Sensor Data</Heading>
                </CardHeader>
                <CardBody>
                    <Box maxH="40vh" overflowY="auto">

                        <TableContainer>
                            <Table textAlign="center" variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th position="sticky" zIndex="sticky">Timestamp</Th>
                                        <Th position="sticky" zIndex="sticky">Topic</Th>
                                        {/* <Th position="sticky" zIndex="sticky">Sensor ID</Th> */}
                                        {/* <Th position="sticky" zIndex="sticky">Sensor Type</Th> */}
                                        <Th position="sticky" zIndex="sticky">Data</Th>
                                    </Tr>
                                    {mdata.map((sensor) => {
                                        return (< Tr >
                                            <Td>{sensor.timestamp}</Td>
                                            <Td>{sensor.topic}</Td>

                                            <Td>{sensor.message}</Td>
                                        </Tr>)
                                    })}

                                </Thead>
                            </Table>
                        </TableContainer>
                    </Box>

                </CardBody>
            </Card>
        </>
    )
}

export default DataStream