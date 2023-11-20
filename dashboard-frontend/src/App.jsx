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
import { HStack, VStack } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './Home'
import SensorInfoPage from './SensorInfoPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* <Nav></Nav> */}
      <HStack >
        <Sidebar />
        {/* <ContentPane /> */}
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/:id" element={<SensorInfoPage type="Temperature" module="Predictive Maintenance" status="Running"/>} />
          </Routes>
        </BrowserRouter>
      </HStack>
    </div>
  )
}

export default App
