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
    TableContainer,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const data = [
    {
        "type": "RFID",
        "id": "RFID_001",
        "status": "Running",
        "health": "Excellent"
    },
    {
        "type": "RFID",
        "id": "RFID_001",
        "status": "Running",
        "health": "Excellent"
    },
    {
        "type": "RFID",
        "id": "RFID_001",
        "status": "Running",
        "health": "Excellent"
    },
    {
        "type": "RFID",
        "id": "RFID_001",
        "status": "Running",
        "health": "Excellent"
    },
]

const SensorStatus = () => {

    const [mdata, setData] = useState([])

    useEffect(() => {
        const socket = io('http://localhost:3000')
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
            setData((prevData) => prevData.slice(-10))
        })
    }, []); // Empty dependency array ensures the effect runs only once on mount


    return (
        <>
            <Card width={"100%"}>
                <CardHeader>
                    <Heading size='md'>Sensor Status</Heading>
                </CardHeader>
                <CardBody>
                    <TableContainer>
                        <Table textAlign="center" variant="simple">

                            <Thead>
                                <Tr>
                                    <Th>Sensor Type</Th>
                                    <Th>Sensor ID</Th>
                                    <Th>Status</Th>
                                    <Th>Health</Th>
                                </Tr>
                                {data.map((sensor) => {
                                    return (< Tr >
                                        <Td>{sensor.type}</Td>
                                        <Td>{sensor.id}</Td>
                                        <Td>{sensor.status}</Td>
                                        <Td>{sensor.health}</Td>
                                    </Tr>)
                                })}

                            </Thead>
                        </Table>
                    </TableContainer>

                </CardBody>
            </Card>
        </>
    )
}

export default SensorStatus