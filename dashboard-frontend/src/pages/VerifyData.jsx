import { HStack, VStack, Heading, Box, Flex, Text, Input, Table, Thead, Tr, Th, Tbody, Td, Select, Button, FormLabel } from "@chakra-ui/react"
import { useState, useEffect } from "react";
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { IoAlertCircle } from "react-icons/io5";
import axios from 'axios'

const VerifyData = () => {
    // useState variables to hold the values of the form fields
    const [sensorId, setSensorId] = useState(0);
    const [moduleId, setModuleId] = useState(0);
    const [moduleType, setModuleType] = useState('');
    const [hashArr, setHashArr] = useState([])
    const [isVerified, setIsVerified] = useState(false)
    const [isMongo, setIsMongo] = useState(false)
    const [isHyper, setIsHyper] = useState(false)
    const [mongoData, setMongoData] = useState([])
    const [hyperData, setHyperData] = useState([])
    const [message, setMessage] = useState("Is your sensor integrity in place?")

    useEffect(()=>{
        console.log("MONGO", mongoData, "HYPER", hyperData)
    }, [mongoData, hyperData])
       


    const handleSubmit = async () => {
        // Perform actions with the form values (e.g., submit to a server)
        console.log('Integer Field 1:', sensorId);
        console.log('Integer Field 2:', moduleId);
        console.log('Dropdown Value:', moduleType);

        setMongoData([])
        setHyperData([])
        setIsVerified(false);
        setIsMongo(false);
        setIsHyper(false);


        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
          };

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
          sleep(2000).then(() => {
            axios.post(url, data, { headers })
            .then(response => {
              console.log('MONGO:', response.data);
              let tempMongo = response.data
              setMongoData(tempMongo)
            setIsMongo(true)
            let updatedArray = response.data.map(obj => {
                return { ...obj, mongo: 'Fetched', hyper: 'Waiting', integrity: false  }; // Adding a new property 'age' with a default value
              });

              console.log("UPDATED ARRAY", updatedArray)
              // Update the state with the new array
              setMongoData(updatedArray);

              console.log("stuff added: ", mongoData)
              const hashes = response.data.map(sensor => sensor.dataHash)
              setHashArr(hashes)
              
              setMessage("Fetching data from Hyperledger for verification...")
              sleep(5000).then(() => {
                axios.get(`${import.meta.env.VITE_BASE_URL}:3001/getDataFromFabric`).then((res) => {
                    console.log("FABRIC: ", res.data)
                    setHyperData(res.data)
                    setIsHyper(true)
                    setMessage("Checking Integrity....")
                    const nextCounters = updatedArray.map(obj => {
                        // Make changes to the object as needed
                        return { ...obj, hyper: 'Fetched', integrity: false  }; // Adding a new property 'age' with a default value
                      });
    
                    console.log("WORKS", nextCounters);
    
                    setMongoData(nextCounters);
                    let hashes = nextCounters.map(obj => obj.dataHash)
                    console.log("hashs", hashes)
    
                    // Filter is based on sensorID
                    const filteredObjects = getObjectsByHashes(res.data, hashes);
                    console.log("Filtered", filteredObjects)
                    setHyperData(filteredObjects)
                    setMessage("Verifying Data Integrity...")
                    // compare integrity of both data arrays
                    // all data => nextCounters
                    // hashes => filteredObjects
                    // for every nextCounter present in filteredObjects array, it is true
    
                    const finalData = nextCounters.map(obj => {
                        let hash = obj.dataHash
                        let check = filteredObjects.filter(obj => obj.Hash === hash)
                        if(check.length){
                            return {...obj, integrity: true}
                        } else {
                            return obj
                        }
                    }) 
                    console.log("FINAL ARRAY", finalData)
                    setMongoData(finalData)
                    console.log("chal jaa please", mongoData)
                    sleep(5000).then(() => {
                        setMessage("Integrity Checked")
                        setIsVerified(true)
                    })
                })
              })
             
            
        })
        .catch(error => {
            console.error('Error:', error);
            });
            
          })
          
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
                        {
                            isVerified ? (<Text fontWeight={"500"} color={"gray"} fontSize={"0.9rem"}> {message} </Text>) : (<Text fontWeight={"500"} color={"gray"} fontSize={"0.9rem"}> {message} </Text>)
                        }
                            
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
                                {isMongo ?  <Td textAlign="center" justifyContent={"center"}>{item.mongo} {item.mongo == 'Fetched' ? (<IoIosCheckmarkCircleOutline color={"green"}/>) : <IoAlertCircle color={"red"}/>}</Td>
                                                                :
                                (<Td textAlign={"center"}>Waiting</Td>)
                                }
                                 {isHyper ?  <Td textAlign="center" justifyContent={"center"}> {item.hyper} {item.hyper == 'Fetched' ? (<IoIosCheckmarkCircleOutline color={"green"}/>) : <IoAlertCircle color={"red"}/>} </Td>
                                                                :
                                (<Td textAlign={"center"}>Waiting</Td>)
                                }
                                {console.log(item.integrity)}
                                {isVerified ? 
                                (<Td textAlign={"center"} justifyContent={"center"}>{item.integrity ? (<IoIosCheckmarkCircleOutline color={"green"}/>) : <IoAlertCircle color={"red"}/>} </Td> ):
                                (<Td textAlign={"center"}>Waiting</Td>)
                                }

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