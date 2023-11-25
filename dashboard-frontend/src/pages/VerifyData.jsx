import { HStack, VStack, Heading, Box, Flex, Input, Select, Button, FormLabel } from "@chakra-ui/react"
import { useState } from "react";
const VerifyData = () => {
    // useState variables to hold the values of the form fields
    const [sensorId, setSensorId] = useState(0);
    const [moduleId, setModuleId] = useState(0);
    const [moduleType, setModuleType] = useState('');

    const handleSubmit = () => {
        // Perform actions with the form values (e.g., submit to a server)
        console.log('Integer Field 1:', sensorId);
        console.log('Integer Field 2:', moduleId);
        console.log('Dropdown Value:', moduleType);

        // fetch data from mongodb


        // fetch data from hyperledger


        // compare the hashes

        // display result

    };
    return (
        <>
            <VStack justifyContent={"center"} mt={"3rem"} mb={"3rem"}>
                <Heading as="h1" size="xl" mb={4}>
                    Data Integrity Checker
                </Heading>
                <Box>
                    <Flex align="center" justify="center">
                        <Box width="600px" p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
                            <form>
                                <Flex direction="column">
                                    <Flex justify="space-between" mb={4}>
                                        <Box>
                                            <FormLabel>Sensor ID</FormLabel>
                                            <Input
                                                type="number"
                                                placeholder="Enter Sensor ID"
                                                value={sensorId}
                                                onChange={(e) => setSensorId(parseInt(e.target.value, 10) || 0)}
                                            />
                                        </Box>
                                        <Box>
                                            <FormLabel>Module ID</FormLabel>
                                            <Input
                                                type="number"
                                                placeholder="Enter Module ID"
                                                value={moduleId}
                                                onChange={(e) => setModuleId(parseInt(e.target.value, 10) || 0)}
                                            />
                                        </Box>
                                        <Box>
                                            <FormLabel>Module Type</FormLabel>
                                            <Select
                                                placeholder="Select Module Type"
                                                value={moduleType}
                                                onChange={(e) => setModuleType(e.target.value)}
                                            >
                                                <option value="type1">Type 1</option>
                                                <option value="type2">Type 2</option>
                                                <option value="type3">Type 3</option>
                                            </Select>
                                        </Box>
                                    </Flex>
                                    <Button colorScheme="blue" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </Flex>
                            </form>
                        </Box>
                    </Flex>                </Box>

            </VStack>
        </>
    )
}

export default VerifyData