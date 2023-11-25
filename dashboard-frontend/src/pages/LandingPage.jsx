import React, { useEffect, useState, useReducer } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem, Box, Table } from '@chakra-ui/react';
import SensorCard from '../components/SensorCard';
import SensorTablePredictive from '../components/SensorTablePredictive';

import RfidTable from '../components/RfidTable';
import ForecastTable from '../components/ForecastTable';
import { useParams } from 'react-router-dom'
import { IoMdArrowRoundBack } from 'react-icons/io';
import io from 'socket.io-client'


const routeDict = {
  "fleet": ["Fleet Maintenance", 1],
  "predictive": ["Predictive Maintenance", 3],
  "storage": ["Storage", 5],
  "rfid": ["RFID Module", 4],
  "forecasting": ["Forecasting", 2]
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
  const [predictiveAnalytics, setPredictiveAnalytics] = useState([])
  const [rfidData, dispatchRfidData] = useReducer((state, action) => {
    switch (action.type) {
      case 'ADD':
        return [...state, action.payload];
      case 'REMOVE':
        return state.filter((entry) => entry.scannedId !== action.payload);
      default:
        return state;
    }
  }, []);
  const { page } = useParams()
  let title = page ? routeDict[page][0] : ""
  let module_id = title ? routeDict[page][1] : 0
  let shouldFetchAnalytics = false
  let shouldFetchRfidData = false
  if (module_id == 3) shouldFetchAnalytics = true
  if (module_id == 4) shouldFetchRfidData = true

  //fetching all sensors
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        let url = `${import.meta.env.VITE_BASE_URL}:5000/getSensors`
        if (module_id != 0)
          url += '/' + module_id
        const response = await fetch(url);
        let data = await response.json();
        data = data.filter(value => value != null)
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

  //fetching predictive analytics
  useEffect(() => {
    const fetchPredictiveAnalytics = async () => {
      try {
        if (shouldFetchAnalytics) {
          let url = `${import.meta.env.VITE_BASE_URL}:5000/analytics`
          const response = await fetch(url);
          let data = await response.json();
          data = data.filter(value => value != null)
          data = data.sort((a, b) => a.sensorId - b.sensorId)
          setPredictiveAnalytics(data);
          setLoading(false);
          console.log(data);
        }
      } catch (error) {
        setPredictiveAnalytics([]);
        console.error('Error fetching predictive analytics:', error);
      }
    };
    fetchPredictiveAnalytics();
  }, [shouldFetchAnalytics]);

  //fetch rfid data
  const socket = io(`${import.meta.env.VITE_BASE_URL}:5000`);
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('json', (incomingData) => {
      console.log(incomingData)
      if (incomingData && shouldFetchRfidData) {
        if (incomingData.moduleId == 4) {
          let newScannedId = incomingData.scannedId;
          let newTimestamp = incomingData.timestamp;
          const parsedTimestamp = new Date(newTimestamp);
          const formattedTime = `${parsedTimestamp.toLocaleTimeString('en-US', {
            hour12: false,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })}:${('00' + parsedTimestamp.getMilliseconds()).slice(-3).slice(0, 2)}`;

          // Check if the scannedId already exists in the array
          const existingEntryIndex = rfidData.findIndex((entry) => entry.scannedId === newScannedId);

          if (existingEntryIndex !== -1) {
            // If the scannedId exists, remove the existing entry
            dispatchRfidData({ type: 'REMOVE', payload: newScannedId });
          }

          // Add the new entry to the array
          dispatchRfidData({ type: 'ADD', payload: { scannedId: newScannedId, timestamp: formattedTime } });
        }
      }
    });
  }, []);


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
                  alertTime={predictiveAnalytics ? predictiveAnalytics : []}
                />
              </GridItem>
            ))}
          </Grid>
        )}
        {
          module_id == 2 && <h1></h1>
        }
        {
          module_id == 3 && <SensorTablePredictive data={predictiveAnalytics} />
        }
        {
          module_id == 4 && <RfidTable data={rfidData} />
        }
        {
          module_id == 1 && <ModFleet />
        }
      </VStack>
    </HStack>
  );
};

export default LandingPage;
