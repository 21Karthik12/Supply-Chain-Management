import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Center } from '@chakra-ui/react';
import SensorDetailsBox from '../components/SensorDetailsBox';

const sensorData = {
  sensorId: 1,
  moduleType: 'Temperature',
  isActive: true,
  isAlert: false,
}

const FetchSensorDetails = () => {
  const { sensorId, moduleId } = useParams();
  // const [sensorData, setSensorData] = useState(null);

  // useEffect(() => {
  //   const fetchSensorData = async () => {
  //     try {
  //       // Fetch data for the specific sensor using sensorId and moduleId
  //       const response = await fetch(`/api/sensors/${sensorId}/modules/${moduleId}`);
  //       const data = await response.json();
  //       setSensorData(data);
  //     } catch (error) {
  //       console.error('Error fetching sensor data:', error);
  //     }
  //   };

  //   fetchSensorData();
  // }, [sensorId, moduleId]);

  // if (!sensorData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <Center>
      <Box p={4}>
        <Heading as="h1" mb={4}>
          Sensor Details - Sensor ID: {sensorId}, Module ID: {moduleId}
        </Heading>

        <SensorDetailsBox sensorData={sensorData} />
      </Box>
    </Center>
  );
};

export default FetchSensorDetails;
