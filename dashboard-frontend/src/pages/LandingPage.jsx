import React, { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem } from '@chakra-ui/react';
import SensorCard from '../components/SensorCard';
import Sidebar from '../components/Sidebar';

const sensorData = [ //delete
  {
    sensorId: 1,
    moduleType: 'Temperature',
    moduleId: 1,
    isAlert: false,
  },
  {
    sensorId: 2,
    moduleType: 'Pressure',
    moduleId: 2,
    isAlert: true,
  },
  {
    sensorId: 3,
    moduleType: 'Humidity',
    moduleId: 3,
    isAlert: false,
  },
  {
    sensorId: 4,
    moduleType: 'Temperature',
    moduleId: 1,
    isAlert: false,
  },
  {
    sensorId: 5,
    moduleType: 'Pressure',
    moduleId: 2,
    isAlert: true,
  },
  {
    sensorId: 6,
    moduleType: 'Humidity',
    moduleId: 3,
    isAlert: false,
  },
  {
    sensorId: 7,
    moduleType: 'Pressure',
    moduleId: 2,
    isAlert: true,
  },
  {
    sensorId: 8,
    moduleType: 'Humidity',
    moduleId: 3,
    isAlert: false,
  },
]

const LandingPage = () => {
  //const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false); //change to true


  //   useEffect(() => {
  //     // Assuming you have a function to fetch sensor data
  //     const fetchSensorData = async () => {
  //       try {
  //         const response = await fetch('/api/sensors/getSensors');
  //         const data = await response.json();
  //         setSensorData(data);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error('Error fetching sensor data:', error);
  //       }
  //     };

  //     fetchSensorData();
  //   }, []); 

  return (
    <HStack>
      <VStack border={"1px solid black"} spacing={4} align="stretch" p={4}>
        <Heading as="h1" size="xl" mb={4}>
          Sensor Data
        </Heading>

        {sensorData.length === 0 ? (
          <Spinner size="xl" />
        ) : (
          <Grid
            templateColumns="repeat(6, 1fr)"
            gap={4}
            width="100%"
          >
            {sensorData.map((sensor) => (
              <GridItem key={sensor.sensorId}>
                <SensorCard
                  sensorId={sensor.sensorId}
                  moduleType={sensor.moduleType}
                  moduleId={sensor.moduleId}
                  isAlert={sensor.isAlert}
                />
              </GridItem>
            ))}
          </Grid>
        )}
      </VStack>
    </HStack>
  );
};

export default LandingPage;
