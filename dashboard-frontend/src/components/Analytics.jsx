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

const socket = io('http://192.168.118.24:5000');

const Analytics = (props) => {
    let type = props.type
    console.log(type)
    const [data, setData] = useState({
        labels: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
        datasets: [
          {
            label: type,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: 'lightblue',
            borderColor: 'blue',
            pointBackgroundColor: 'darkblue', 
            tension: 0,
            fill: true,
          },
        ],
        options: {
          responsive: true, 
          maintainAspectRatio: false, 
          animation: true,
        },
      });
    
      socket.on('connect', () => {
        console.log('Connected to the server');
      });
       
      useEffect(() => {
        socket.on('json', (incomingData) => {
          if(incomingData){
            type = props.type
            let newDataPoint = incomingData.value;
            let newSensorId = incomingData.sensorId;
            let newTimestamp = incomingData.timestamp;
            
            const parsedTimestamp = new Date(newTimestamp);
            const formattedTime = `${parsedTimestamp.toLocaleTimeString('en-US', {
              hour12: false,
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })}:${('00' + parsedTimestamp.getMilliseconds()).slice(-3).slice(0, 2)}`;

            if (newSensorId == props.id) {
              console.log(newDataPoint, formattedTime)
              setData((prevData) => {
                return {
                  labels: [...prevData.labels.slice(1), formattedTime],
                  datasets: prevData.datasets.map((dataset) => ({
                    ...dataset,
                    data: [...dataset.data.slice(1), newDataPoint],
                  })),
                };
              });
            }
          }
        });
      }, [props.id]);

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