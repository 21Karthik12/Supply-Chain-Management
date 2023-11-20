import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HStack } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage'
import FetchSensorDetails from './pages/FetchSensorDetails';
import Sidebar from './components/Sidebar';
import OldLandingPage from './pages/OldLandingPage';
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
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <HStack>
        <Sidebar />
        <main style={{ minHeight: "93vh" }}>
          <Routes>
            <Route exact path='/' element={<LandingPage />}></Route>
            <Route path="/:sensorId/:moduleId" element={<FetchSensorDetails />} />
            <Route path="/:id" element={<SensorInfoPage type="Temperature" module="Predictive Maintenance" status="Running"/>} />
          </Routes>
        </main>
      </HStack>
    </BrowserRouter>
  );
}

export default App
