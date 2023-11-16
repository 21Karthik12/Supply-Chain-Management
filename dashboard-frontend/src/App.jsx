import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Nav from './components/Navbar'
import Sidebar from './components/Sidebar'
import './App.css'
import DataStream from './components/DataStream'
import SensorStatus from './components/SensorStatus'
import SensorControl from './components/SensorControl'
import ContentPane from './components/ContentPane'
import Analytics from './components/Analytics'
import Home from './pages/Home'
import { HStack, VStack } from '@chakra-ui/react'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Nav></Nav> */}
      <HStack >
        <Sidebar />
        {/* <ContentPane /> */}
        <HStack flexBasis="50%" flex="1" spacing={4}>
          <VStack flexBasis="100%" align={"center"} border={'1px solid black'}>

            <Home />
            {/* <DataStream border={'1px solid black'} />
            <SensorStatus /> */}

          </VStack>
          {/* <VStack flexBasis="50%" align={"center"} border={'1px solid black'}> */}
          {/* <SensorControl /> */}
          {/* <Analytics /> */}
          {/* </VStack>  */}
        </HStack>
      </HStack>
    </>
  )
}

export default App
