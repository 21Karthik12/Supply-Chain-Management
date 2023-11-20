import React, { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem } from '@chakra-ui/react';
import SensorCard from '../components/SensorCard';
import Sidebar from '../components/Sidebar';
import {useParams} from 'react-router-dom'

const routeDict = {
  'Fleet' : ["Fleet Maintenance", 1],
  "predictive" : ["Predictive Maintenance", 3],
  "storage" : ["Storage", 5],
  "rfid" : ["RFID Module", 4],
  "forecasting" : ["Forecasting", 2]
}

const modules = {
  1: "Fleet",
  2: "Forecasting",
  3: "Predictive",
  4: "RFID",
  5: "Storage"
}

const LandingPage = () => {
  //const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(false); //change to true
  const [data, setSensorData] = useState([]);
  const {page} = useParams()
  let title = page ? routeDict[page][0] : ""
  let module_id = title ? routeDict[page][1] : 0

    useEffect(() => {
      // Assuming you have a function to fetch sensor data
      const fetchSensorData = async () => {
        try {
          let url = 'http://localhost:5000/getSensors'
          if (module_id != 0)
            url += '/' + module_id
          const response = await fetch(url);
          const data = await response.json();
          setSensorData(data);
          setLoading(false);
          console.log(data);
        } catch (error) {
          setSensorData([]);
          console.error('Error fetching sensor data:', error);
        }
      };

      fetchSensorData();
    }, [module_id, title]); 

  return (
    <HStack>
      <VStack border={"1px solid black"} spacing={4} align="stretch" p={4}>
        <Heading as="h1" size="xl" mb={4}>
          {title ? title : "All Sensors"}
  
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
