import Sidebar from '../components/Sidebar'
import '../App.css'
import DataStream from '../components/DataStream'
import SensorStatus from '../components/SensorStatus'
import SensorControl from '../components/SensorControl'
import Analytics from '../components/Analytics'
import { HStack, VStack } from '@chakra-ui/react'

const OldLandingPage = () => {
  return (
    <>
      {/* <Nav></Nav> */}
      <HStack >
        <Sidebar />
        {/* <ContentPane /> */}
        <HStack flexBasis="50%" flex="1" spacing={4}>
          <VStack flexBasis="50%" align={"center"} border={'1px solid black'}>

            <DataStream border={'1px solid black'} />
            <SensorStatus/>

          </VStack>
          <VStack flexBasis="50%" align={"center"} border={'1px solid black'}>
            <SensorControl />
            <Analytics />
          </VStack>
        </HStack>
      </HStack>
    </>
  )
};
  
export default OldLandingPage;