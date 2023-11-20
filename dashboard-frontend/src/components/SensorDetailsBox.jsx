import React from 'react';
import { VStack, Text, Button, HStack, Box, Center} from '@chakra-ui/react';

const SensorDetailsBox = ({ sensorData }) => {
  const handleStart = () => {
  };

  const handleStop = () => {
  };

  const handleTogglePauseReset = () => {
  };

  const handleResolve = () => {
  };

  return (
    <Box>
        <VStack spacing={4} align="start">
            <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold">Sensor Details</Text>
                <Text fontSize="lg" fontWeight="bold">Graph</Text>
            </HStack>
            <HStack spacing={4}>
                <Button colorScheme="green" onClick={handleStart}>Start</Button>
                <Button colorScheme="red" onClick={handleStop}>Stop</Button>
                <Button colorScheme="yellow" onClick={handleTogglePauseReset}>Pause/Reset Toggle</Button>
                <Button colorScheme="blue" onClick={handleResolve}>Resolve</Button>
            </HStack>
        </VStack>
    </Box>
  );
};

export default SensorDetailsBox;
