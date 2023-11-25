import React from 'react';
import { useState } from 'react';
import { VStack, Heading, Spinner, HStack, Grid, GridItem, Box, Text, Table } from '@chakra-ui/react';
import SensorCard from '../components/SensorCard';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { AiOutlineWarning } from 'react-icons/ai';
const FacilityBlock = (props) => {
    const sensorArr = props.block
    const ctr = props.ctr
    let alert = false;
    if (sensorArr[0].alert || sensorArr[1].alert || sensorArr[2].alert) {
        alert = true;
    }
    return (
        <>
            <Box justifyContent={"center"}>
                {(alert == false) ? (
                    <HStack alignItems={"center"} justifyContent={"center"}>
                        <Heading as="h2" size="lg" mb={2}>
                            Facility Block {ctr}
                        </Heading>
                        <IoIosCheckmarkCircleOutline color="rgb(0, 220, 0)" size="1.5em" />
                    </HStack>) : (
                    <HStack alignItems={"center"} justifyContent={"center"}>
                        <Heading as="h2" color={"red"} size="lg" mb={2}>
                            Facility Block {ctr}
                        </Heading>
                        <AiOutlineWarning color="rgb(220, 0, 0)" size="1.5em" />
                    </HStack>)}

                <br />
                <Grid templateColumns="repeat(3, 1fr)" gap={6} width="100%">
                    {sensorArr.map((sensor) => {
                        console.log(sensor)
                        if (sensor)
                            return (<GridItem key={sensor.sensorId}>
                                <SensorCard sensorId={sensor.sensorId} sensorType={sensor.sensorType} moduleName={sensor.module} moduleId={sensor.moduleId} isAlert={sensor.alert} isActive={sensor.active} />
                            </GridItem>)
                    })}
                </Grid>
            </Box>

        </>
    )
}

export default FacilityBlock