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

// const data = {
//     labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
//     datasets: [
//         {
//             label: 'Dataset',
//             data: Utils.numbers({ count: 6, min: -100, max: 100 }),
//             borderColor: Utils.CHART_COLORS.red,
//             backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//             pointStyle: 'circle',
//             pointRadius: 10,
//             pointHoverRadius: 15
//         }
//     ]
// };

// const actions = [
//     {
//         name: 'pointStyle: circle (default)',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'circle';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: cross',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'cross';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: crossRot',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'crossRot';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: dash',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'dash';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: line',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'line';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: rect',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'rect';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: rectRounded',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'rectRounded';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: rectRot',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'rectRot';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: star',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'star';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: triangle',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = 'triangle';
//             });
//             chart.update();
//         }
//     },
//     {
//         name: 'pointStyle: false',
//         handler: (chart) => {
//             chart.data.datasets.forEach(dataset => {
//                 dataset.pointStyle = false;
//             });
//             chart.update();
//         }
//     }
// ];

// const config = {
//     type: 'line',
//     data: data,
//     options: {
//         responsive: true,
//         plugins: {
//             title: {
//                 display: true,
//                 text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
//             }
//         }
//     }
// };

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

  const [data, setData] = useState({
    labels: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    datasets: [
      {
        label: 'Temperature',
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
      console.log('Received message:', incomingData);
      let newDataPoint = incomingData.Value;
      console.log(newDataPoint)
      let newLabels = [...data.labels.slice(1), new Date().toLocaleTimeString()];
      let newDatasets = data.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data.slice(1), newDataPoint],
      }));
      console.log(newLabels)
      console.log(newDatasets)

      //    setData({
      //   labels: newLabels,
      //    datasets: newDatasets,
      //  }); 
      setData(prevState => {
        return {
          labels: [...prevState.labels.slice(1), new Date().toLocaleTimeString()],
          datasets: prevState.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data.slice(1), newDataPoint],
          })),
        };
      });
      console.log(data)

    });
  }, []);


  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BASE_URL}:3000`)
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
          <Heading size='md'>Analytics</Heading>
        </CardHeader>
        <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <TableContainer>
                        <Table textAlign="center" variant="simple">

                            <Thead>
                                <Tr>
                                    <Th>Sensor Type</Th>
                                    <Th>Sensor ID</Th>
                                    <Th>Status</Th>
                                    <Th>Action</Th>
                                </Tr>
                                {data.map((sensor) => {
                                    return (< Tr >
                                        <Td>{sensor.type}</Td>
                                        <Td>{sensor.id}</Td>
                                        <Td>{sensor.status}</Td>
                                        <Td>{<ControlButtons />}</Td>
                                    </Tr>)
                                })}

                            </Thead>
                        </Table>
                    </TableContainer> */}
          <div className="App" style={{ width: '400px', height: '' }}>
            <Line data={data} options={{ animation: true }} />
          </div>

        </CardBody>
      </Card>
    </>
  )
}

export default Analytics