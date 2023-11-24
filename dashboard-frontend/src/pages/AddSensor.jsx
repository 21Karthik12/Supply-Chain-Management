import { Box, Button, FormControl, FormLabel, Select, Input, Text } from '@chakra-ui/react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    CloseButton,
    VStack,
    Heading,
    HStack
} from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios'

const YourComponent = () => {
    const [module, setModule] = useState("")
    const [sensorType, setSensorType] = useState("")
    const [isSubmitted, setSubmitted] = useState(false)
    const [isErrored, setErrored] = useState(false)
    const base_url = import.meta.env.VITE_BASE_URL
    const url = `${base_url}:5000`

    const modules = [
        "Fleet",
        "Forecasting",
        "Predictive",
        "RFID",
        "Storage"
    ]
    const sensors = [
        "Temperature",
        "Humidity",
        "Pressure",
        "RFID",
        "GPS",
        "Accelerometer",
        "Speedometer",
        "Light",
        "IR"
    ]

    const handleModuleChange = (e) => {
        setModule(e.target.value)
    };

    const handleSensorChange = (e) => {
        setSensorType(e.target.value)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(module)
        console.log(sensorType)

        // POST request
        const data = {
            type: sensorType,
            module: module
        }

        axios.post(url + '/createSensor', data)
            .then((response) => {
                console.log(response)
                setSubmitted(true)
            })
            .catch((error) => {
                console.error(error)
                setErrored(true)
            })
        // Your form submission logic here
    };

    return (
        <HStack>
            <VStack border={"1px solid black"} spacing={4} align="stretch" p={4} minW={"96%"} minH={"100vh"}>
                <Heading as="h1" size="xl" mb={4}>
                    Add a Sensor
                </Heading>

                <Box mx="auto" width="100%" maxW="400px" justifyContent="center" alignItems="center">
                    <Box
                        mt="8"
                        p="6"
                        border="1px"
                        borderRadius="md"
                        borderColor="gray.200"
                        textAlign="center"
                        mx="auto"
                    >
                        <form onSubmit={handleSubmit}>
                            <FormControl mb="4">
                                <FormLabel htmlFor="module">Select Module</FormLabel>
                                <Select
                                    value={module}
                                    onChange={handleModuleChange}
                                    placeholder='Choose a Module'>
                                    {modules.map((module) => {
                                        return (
                                            <option value={module}>{module}</option>
                                        )
                                    })}

                                </Select>
                            </FormControl>

                            <FormControl mb="4">
                                <FormLabel htmlFor="module">Select Sensor Type</FormLabel>
                                <Select
                                    placeholder='Choose a Sensor Type'
                                    value={sensorType}
                                    onChange={handleSensorChange}
                                >
                                    {sensors.map((sensor) => {
                                        return (
                                            <option value={sensor}>{sensor}</option>
                                        )
                                    })}
                                </Select>
                            </FormControl>


                            <Button type="submit" colorScheme="teal" size="md" w="100%">
                                Create Sensor
                            </Button>
                        </form>
                        <Box>
                            {isSubmitted && (
                                <Alert status="success" mb="4" mt="8">
                                    <AlertIcon />
                                    <AlertTitle mr={2}>Sensor Created Successfully!</AlertTitle>
                                    <CloseButton onClick={() => setSubmitted(false)} position="absolute" right="8px" top="8px" />
                                </Alert>
                            )}
                            {isErrored && (
                                <Alert status="warning" mb="4" mt="8">
                                    <AlertIcon />
                                    <AlertTitle mr={2}>Failed to Create Sensor</AlertTitle>
                                    <CloseButton onClick={() => setErrored(false)} position="absolute" right="8px" top="8px" />
                                </Alert>
                            )}
                        </Box>
                    </Box>
                </Box>
            </VStack>
        </HStack>
    );
};

export default YourComponent;
