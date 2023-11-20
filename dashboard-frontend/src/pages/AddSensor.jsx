import { Box, Button, FormControl, FormLabel, Select, Input, Text } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, CloseButton } from '@chakra-ui/react';
import React, { useState } from 'react';

const YourComponent = () => {
    const [module, setModule] = useState("")
    const [sensorType, setSensorType] = useState("")
    const [isSubmitted, setSubmitted] = useState(false)

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
        setSubmitted(true)
        // Your form submission logic here
    };

    return (
        <>
            <Box margin={"0 auto"} width={"100%"} maxW={"100%"} border={"1px solid white"} justifyContent={"center"} alignItems={"center"}>
                <Text fontSize={"2rem"}>Add a Sensor</Text>
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
                                <option value='option1'>Option 1</option>
                                <option value='option2'>Option 2</option>
                                <option value='option3'>Option 3</option>
                                <option value='option4'>Option 4</option>
                                <option value='option5'>Option 5</option>
                            </Select>
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel htmlFor="module">Select Sensor Type</FormLabel>
                            <Select
                                placeholder='Choose a Module'
                                value={sensorType}
                                onChange={handleSensorChange}
                            >
                                <option value='sensor1'>Sensor 1</option>
                                <option value='sensor2'>Sensor 2</option>
                                <option value='sensor3'>Sensor 3</option>
                                <option value='sensor4'>Sensor 4</option>
                                <option value='sensor5'>Sensor 5</option>
                            </Select>
                        </FormControl>


                        <Button type="submit" colorScheme="teal" size="md" w="100%">
                            Create a Sensor
                        </Button>
                    </form>
                    <Box>
                        {isSubmitted && (
                            <Alert status="success" mb="4" mt="8">
                                <AlertIcon />
                                <AlertTitle mr={2}>Sensor Created Successfully!</AlertTitle>
                                <CloseButton onClick={() => setIsSubmitted(false)} position="absolute" right="8px" top="8px" />
                            </Alert>
                        )}
                    </Box>
                </Box>
            </Box>
        </>

    );
};

export default YourComponent;
