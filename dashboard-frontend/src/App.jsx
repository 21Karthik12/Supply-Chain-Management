import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HStack } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage'
import FetchSensorDetails from './pages/FetchSensorDetails';
import Sidebar from './components/Sidebar';
import AddSensor from './pages/AddSensor';
import OldLandingPage from './pages/OldLandingPage';
import SensorInfoPage from './SensorInfoPage'


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <HStack>
        <Sidebar />
        <main style={{ minHeight: "93vh", width:"100%" }}>
          <Routes>
            <Route exact path='/' element={<LandingPage />}></Route>
            <Route exact path='/:page' element={<LandingPage />}></Route>
            <Route path="/info/:id" element={<SensorInfoPage type="Temperature" module="Predictive Maintenance" status="Running"/>} />
            <Route path="/sensor/:sensorId" element={<FetchSensorDetails />} />
            <Route path="/addSensor" element={<AddSensor />} />
          </Routes>
        </main>
      </HStack>
    </BrowserRouter>
  );
}

export default App
