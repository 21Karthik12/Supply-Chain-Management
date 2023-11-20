import React, { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem } from '@chakra-ui/react';
import SensorCard from '../components/SensorCard';
import Sidebar from '../components/Sidebar';

const LandingPage = () => {
  //const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false); //change to true
  const [data, setSensorData] = useState([]);


    useEffect(() => {
      // Assuming you have a function to fetch sensor data
      const fetchSensorData = async () => {
        try {
          const response = await fetch('http://localhost:5000/getSensors');
          const data = await response.json();
          setSensorData(data);
          setLoading(false);
          console.log(data);
        } catch (error) {
          console.error('Error fetching sensor data:', error);
        }
      };

      fetchSensorData();
    }, []); 

  return (
    <HStack>
      <VStack border={"1px solid black"} spacing={4} align="stretch" p={4}>
        <Heading as="h1" size="xl" mb={4}>
          Sensor Data
        </Heading>

        {data.length === 0 ? (
          <Spinner size="xl" />
        ) : (
          <Grid
            templateColumns="repeat(6, 1fr)"
            gap={4}
            width="100%"
          >
            {data.map((sensor) => (
              <GridItem key={sensor.sensorId}>
                <SensorCard
                  sensorId={sensor.sensorId}
                  moduleType={sensor.module}
                  moduleId={sensor.moduleId}
                  isAlert={sensor.alert}
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
