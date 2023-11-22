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
} from '@chakra-ui/react';
import { Box, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import ChartStreaming from 'chartjs-plugin-streaming';

import { useEffect, useState } from 'react'
import io from 'socket.io-client'

ChartJS.register(
    Title,
    Tooltip,
    LineElement,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
    ChartStreaming
  );

const socket = io('http://192.168.108.89:3001');

const Analytics = (props) => {
    let type = props.type
    const [data, setData] = useState({
        labels: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        datasets: [
          {
            label: type,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'lightblue',
            borderColor: 'blue',
            tension: 0.1,
            fill: true,
          },
        ],
      });
    
      socket.on('connect', () => {
        console.log('Connected to the server');
      });
       
      useEffect(() => {
        socket.on('json', (incomingData) => {
          const newDataPoint = incomingData.value;
          const newSensorId = incomingData.sensorId;
          const newTimestamp = incomingData.timestamp;
      
          if (newSensorId === props.id) {
            setData((prevData) => {
              return {
                labels: [...prevData.labels.slice(1), newTimestamp],
                datasets: prevData.datasets.map((dataset) => ({
                  ...dataset,
                  data: [...dataset.data.slice(1), newDataPoint],
                })),
              };
            });
          }
        });
      }, [props.id]);

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
    }, []); 

    return (
        <>
            <Card width={"100%"}>
                <CardHeader>
                    <Heading size='md'>Analytics</Heading>
                </CardHeader>
                <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="App" style={{ width: '400px', height:''}}>
                        <Line data={data} options={{ animation: true }} />
                    </div>
                </CardBody>
            </Card>
        </>
    )
}

export default Analytics