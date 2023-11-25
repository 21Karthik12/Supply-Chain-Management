import { HStack, VStack, Heading, Box, Flex, Text, Input, Table, Thead, Tr, Th, Tbody, Td, Select, Button, FormLabel } from "@chakra-ui/react"
import { useState } from "react";
import axios from 'axios'

const VerifyData = () => {
    // useState variables to hold the values of the form fields
    const [sensorId, setSensorId] = useState(0);
    const [moduleId, setModuleId] = useState(0);
    const [moduleType, setModuleType] = useState('');
    const [hashArr, setHashArr] = useState([])
    const [mongoData, setMongoData] = useState([])
    const [hyperData, setHyperData] = useState([])
    const [message, setMessage] = useState("Is your sensor integrity in place?")



    const handleSubmit = async () => {
        // Perform actions with the form values (e.g., submit to a server)
        console.log('Integer Field 1:', sensorId);
        console.log('Integer Field 2:', moduleId);
        console.log('Dropdown Value:', moduleType);

        let url = `${import.meta.env.VITE_BASE_URL}:3001/getDataFromMongo`

        let data = {
            'sensorId': sensorId,
            'moduleId': moduleId,
            'module' : moduleType,
        }

        const getObjectsByHashes = (objects, hashes) => {
            return  objects.filter(obj => hashes.includes(obj.Hash));
            };

        const headers = {
            'Content-Type': 'application/json',
            // Add any other headers as needed
          };
          
          setMessage("Fetching data from MongoDB Cloud...")
          // Making a POST request with headers
          axios.post(url, data, { headers })
            .then(response => {
              console.log('MONGO:', response.data);
              setMongoData(response.data)
              let tempMongo = mongoData
              tempMongo.forEach(obj => {
                obj.mongo = true
                obj.hyper = false
                obj.integrity = false
              })
              setMongoData(tempMongo)
              console.log("stuff added: ", mongoData)
              const hashes = response.data.map(sensor => sensor.dataHash)
              setHashArr(hashes)

             axios.get(`${import.meta.env.VITE_BASE_URL}:3001/getDataFromFabric`).then((res) => {
                console.log("FABRIC: ", res.data)
                setHyperData(res.data)
                setMessage("Fetching data from Hyperledger for verification...")

                // Filter is based on sensorID
                const filteredObjects = getObjectsByHashes(res.data, hashArr);
                console.log("Filtered", filteredObjects)
                setHyperData(filteredObjects)
            })

            })
            .catch(error => {
              console.error('Error:', error);
            });

            
            // Function to fetch objects based on hash values
            
            
           
            

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
                                                <option value="RFID">RFID</option>
                                                <option value="Storage">Storage</option>
                                                <option value="Predictive">Predictive</option>
                                                <option value="Forecasting">Forecasting</option>
                                                <option value="Fleet">Fleet</option>

                                            </Select>
                                        </Box>
                                    </Flex>
                                    <Button colorScheme="blue" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                </Flex>
                            </form>
                        </Box>
                    </Flex>                
                    </Box>
                    <Box> 
                        <Box border={"1px solid gray"} m={"1.5rem"} p={"1rem"}>
                            <Text fontWeight={"500"} color={"gray"} fontSize={"0.9rem"}> {message} </Text>
                        </Box>
                    <Table variant="simple" borderWidth="1px" borderRadius="md" overflow="hidden">
                        <Thead>
                            <Tr>
                            <Th textAlign="center">Timestamp</Th>
                            {/* <Th textAlign="center">Sensor ID</Th> */}
                            {/* <Th textAlign="center">Sensor Type</Th> */}
                            {/* <Th textAlign="center">Module ID</Th> */}
                            <Th textAlign="center">Sensor Reading</Th>
                            <Th textAlign="center">Measurement Unit</Th>
                            <Th textAlign="center">MongoDB Status</Th>
                            <Th textAlign="center">Hyperledger Status</Th>
                            <Th textAlign="center"> Integrity Check </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {mongoData.map((item, index) => (
                            <Tr key={index}>
                                <Td textAlign="center">{item.timestamp}</Td>
                                {/* <Td textAlign="center">{item.sensorId}</Td> */}
                                {/* <Td textAlign="center">{item.sensorType}</Td> */}
                                {/* <Td textAlign="center">{item.moduleId}</Td> */}
                                <Td textAlign="center">{item.value}</Td>
                                <Td textAlign="center">{item.unit}</Td>
                                <Td textAlign="center">{item.mongo}</Td>
                                <Td textAlign="center">{item.hyper}</Td>
                                <Td textAlign={"center"}>{item.integrity} </Td>

                            </Tr>
                            ))}
                        </Tbody>
                        </Table>
                    </Box>

            </VStack>
        </>
    )
}

export default VerifyData