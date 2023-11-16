// Import necessary dependencies
import React from 'react';
import { Box, Grid, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

// Sample data for sensors (replace with your actual data)
const sensors = [
    { id: 1, name: 'Sensor 1' },
    { id: 2, name: 'Sensor 2' },
    // Add more sensors as needed
];

// Home component
const Home = () => {
    return (
        <Box p={4}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                {sensors.map((sensor) => (
                    <Box key={sensor.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Box p={4}>
                            <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                                {sensor.name}
                            </Box>
                            <Button colorScheme="teal" mt={2}>
                                <Link to={`/sensor/${sensor.id}`}>View</Link>
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Grid>
        </Box>
    );
};

export default Home;
