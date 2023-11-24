// Card.jsx
import React from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Button,
  Switch,
  HStack,
  useColorModeValue,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import { AiOutlineWarning } from 'react-icons/ai'; // Import AiOutlineWarning
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Card = ({ sensorId, sensorType, moduleName, moduleId, isAlert, isActive }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(sensorId)

    // POST request
    const data = {
      command: 'toggle'
    }

    axios.post(`${import.meta.env.VITE_BASE_URL}:5000/controlSensor/` + sensorId, data)
      .then((response) => {
        console.log(response)
      })
  };

  const theme = extendTheme({
    components: {
      Switch: {
        baseStyle: {
          track: {
            _checked: {
              bg: "green.500", // Background color when the switch is checked
            },
          },
          thumb: {
            _checked: {
              bg: "white", // Thumb color when the switch is checked
            },
          },
        },
      },
    },
  });

  return (
    <Box
      minW="300px"
      maxW="md" // Adjusted max width for a wider card
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      position="relative" // Added position relative
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: useColorModeValue('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)'), // Adjusted color based on light/dark mode
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Sensor ID in a circle */}
      <Flex align="center" justify="center" p="4">
        <Badge borderRadius="full" px="2" colorScheme="blue" fontSize="md">
          {sensorId}
        </Badge>
      </Flex>

      {/* Horizontal line */}
      <Box borderBottom="1px" borderColor="gray.200"></Box>

      {/* Sensor Type */}
      <Box p="4" textAlign="center">
        <Text fontWeight="bold"> {/* Adjusted font size */}
          {sensorType}
        </Text>
      </Box>

      {/* Horizontal line */}
      <Box borderBottom="1px" borderColor="gray.200"></Box>

      {/* Additional Information */}
      <Box p="4">
        <Text fontSize="sm">
          Module: {moduleName}
        </Text>
        <Text fontSize="sm" p="2">
          Status:{' '}
          <ChakraProvider theme={theme}>
            <Switch
              defaultChecked={isActive}
              size="sm" // Adjusted switch size
              onChange={handleSubmit}
            />
          </ChakraProvider>
        </Text>
        <HStack justifyContent={'center'}>
          <Text fontSize="sm">
            Health:{' '}
          </Text>
          {isAlert ? (
            <AiOutlineWarning color="rgb(220, 0, 0)" size="1.2em" />
          ) : (
            <IoIosCheckmarkCircleOutline color="rgb(0, 220, 0)" size="1.2em" />
          )}
        </HStack>
      </Box>

      {/* Horizontal line */}
      <Box borderBottom="1px" borderColor="gray.200"></Box>

      {/* View Button */}
      <Flex justify="center" p="4">
        <Button as={Link} to={`/sensor/${sensorId}`} colorScheme="blue" size="xs">
          View
        </Button>
      </Flex>
    </Box>
  );
};

export default Card;
