// Card.jsx
import React from 'react';
import { Box, Text, Flex, Badge, Button } from '@chakra-ui/react';
import { IoIosWarning, IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Card = ({ sensorId, moduleType, moduleId, isAlert }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <Box p="6">
        <Text fontSize="xl" fontWeight="bold">
          Sensor ID: {sensorId}
        </Text>
        <Text mt="2" color="gray.600">
          Module Type: {moduleType}
        </Text>
      </Box>

      <Flex align="center" justify="space-between" p="6">
        <Badge
          variant="subtle"
          colorScheme={isAlert ? 'red' : 'green'}
          fontSize="0.8em"
        >
          {isAlert ? 'Alert' : 'OK'}
        </Badge>
        {isAlert ? (
          <IoIosWarning color="red" size="1.5em" />
        ) : (
          <IoIosCheckmarkCircleOutline color="green" size="1.5em" />
        )}
      </Flex>

      <Flex justify="center" p="6">
        <Button as={Link} to={`/${sensorId}/${moduleId}`} colorScheme="teal">
          View
        </Button>
      </Flex>
    </Box>
  );
};

export default Card;
