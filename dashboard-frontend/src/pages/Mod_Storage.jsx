import React, { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem, Box, Table } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import SensorCard from '../components/SensorCard';
import FacilityBlock from '../components/FacilityBlock';
import io from 'socket.io-client';

const routeDict = {
    storage: ['Storage', 5],
};

const modules = {
    5: 'Storage',
};

const Mod_Storage = () => {
    const [loading, setLoading] = useState(false);
    const [sensorData, setSensorData] = useState([]);
    const [tempSensors, setTempSensors] = useState([]);
    const [humiditySensors, setHumiditySensors] = useState([]);
    const [pressureSensors, setPressureSensors] = useState([]);
    const [minLen, setMinLen] = useState(0)

    const { page } = useParams();
    const title = page ? routeDict[page][0] : '';
    const module_id = title ? routeDict[page][1] : 0;

    // Fetching all sensors
    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                let url = `${import.meta.env.VITE_BASE_URL}:5000/getSensors/5`;
                const response = await fetch(url);
                let data = await response.json();
                data = data.sort((a, b) => a.sensorId - b.sensorId);
                setSensorData(data);
                setLoading(false);
            } catch (error) {
                setSensorData([]);
                console.error('Error fetching sensor data:', error);
            }
        };
        fetchSensorData();
    }, [module_id, title]);

    let _temperatureSensors = sensorData.filter((sensor) => sensor.sensorType === 'Temperature');
    let _humiditySensors = sensorData.filter((sensor) => sensor.sensorType === 'Humidity');
    let _pressureSensors = sensorData.filter((sensor) => sensor.sensorType === 'Pressure');
    let minLength = Math.min(_temperatureSensors.length, _pressureSensors.length, _humiditySensors.length);

    // Organize sensor data by type
    let facilitySensors = [];
    Array.from({ length: minLength }).forEach((_, index) => {
        let element1 = _temperatureSensors[index];
        let element2 = _humiditySensors[index];
        let element3 = _pressureSensors[index];
        facilitySensors.push([element1, element2, element3])
    });

    console.log(facilitySensors)

    for (let i = 0; i < minLength; i++) {
        _temperatureSensors = _temperatureSensors.filter((sensor) => sensor != facilitySensors[i][0])
        _humiditySensors = _humiditySensors.filter((sensor) => sensor != facilitySensors[i][1])
        _pressureSensors = _pressureSensors.filter((sensor) => sensor != facilitySensors[i][2])
    }

    let allSensors = _temperatureSensors.concat(_humiditySensors, _pressureSensors)

    return (
        <HStack justifyContent={"center"}>
            <VStack spacing={4} maxW={'max-content'} w={'80vw'} justifyContent={'center'} alignItems={'center'} align="stretch" p={4}>
                <Heading as="h1" size="xl" mb={4}>
                    Storage
                </Heading>
                <br />
                <br />
                {loading ? (
                    <Spinner size="xl" />
                ) : (
                    <>
                        {
                            facilitySensors.map((sensorBlock, index) => {
                                return (
                                    <FacilityBlock block={sensorBlock} ctr={index + 1} />
                                )
                            })
                        }
                        {
                            <>
                                <Heading as="h1" size="xl" mb={4}>
                                    Remaining Sensors
                                </Heading>
                                <Grid
                                    templateColumns="repeat(4, 1fr)"
                                    gap={6}
                                    width="100%"
                                    justifyContent={"center"}
                                >
                                    {allSensors.map((sensor) => (
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
                            </>
                        }
                    </>
                )}
            </VStack>
        </HStack>
    );
};

export default Mod_Storage;
