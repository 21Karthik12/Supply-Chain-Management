import React, { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem, Box } from '@chakra-ui/react';
import SensorCard from '../components/SensorCard';
<<<<<<< HEAD
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom'
import ModFleet from './Mod_Fleet';
import ModForecast from './Mod_Forecast';
import ModPredictive from './Mod_Predictive';
import ModRFID from './Mod_RFID';
import ModStorage from './Mod_Storage';
=======
import {useParams} from 'react-router-dom'
>>>>>>> 7d268d1c8d0ca0b562d6fc115728b84578f8e9da

const routeDict = {
  "fleet" : ["Fleet Maintenance", 1],
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
  const { page } = useParams()
  let title = page ? routeDict[page][0] : ""
  let module_id = title ? routeDict[page][1] : 0

  useEffect(() => {
    // Assuming you have a function to fetch sensor data
    const fetchSensorData = async () => {
      try {
        let url = `${import.meta.env.VITE_BASE_URL}:5000/getSensors`
        if (module_id != 0)
        url += '/' + module_id
      const response = await fetch(url);
        let data = await response.json();
        data = data.sort((a, b) => a.sensorId - b.sensorId)
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
      <VStack spacing={4} maxW={"max-content"} w={"80vw"} justifyContent={"center"} alignItems={"center"} align="stretch" p={4}>
        <Heading as="h1" size="xl" mb={4}>
          {title ? title : "All Sensors"}

        </Heading>

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Grid
            templateColumns="repeat(4, 1fr)"
            gap={6}
            width="100%"
          >
            {data.map((sensor) => (
              <GridItem key={sensor.sensorId}>
                <SensorCard
                  sensorId={sensor.sensorId}
                  sensorType={sensor.sensorType}
                  moduleName={sensor.module}
                  moduleId={sensor.moduleId}
                  isAlert={sensor.alert}
                  isActive={sensor.active}
                />
              </GridItem>
            ))}
          </Grid>
        )}
        {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {module_id === 1 && <ModFleet/>}
          {module_id === 2 && <ModForecast/>}
          {module_id === 3 && <ModPredictive/>}
          {module_id === 4 && <ModRFID/> }
          {module_id === 5 && <ModStorage/> }
        </>
      )}
      </VStack>
    </HStack>
  );
};

export default LandingPage;
