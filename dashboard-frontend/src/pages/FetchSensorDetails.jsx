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
