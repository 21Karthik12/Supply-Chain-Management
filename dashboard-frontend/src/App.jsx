import React from 'react';
import { useState, } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HStack } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage'
import FetchSensorDetails from './pages/FetchSensorDetails';
import Sidebar from './components/Sidebar';
import AddSensor from './pages/AddSensor';
import OldLandingPage from './pages/OldLandingPage';
import SensorInfoPage from './SensorInfoPage'
import Mod_Storage from './pages/Mod_Storage';
import VerifyData from './pages/VerifyData';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <HStack>
        <Sidebar />
        <main style={{ minHeight: "93vh", width: "100%" }}>
          <Routes>
            <Route exact path='/' element={<LandingPage />}></Route>
            <Route exact path='/storage' element={<Mod_Storage />}></Route>
            <Route exact path='/:page' element={<LandingPage />}></Route>
            <Route path="/sensor/:sensorId" element={<SensorInfoPage />} />
            <Route path="/addSensor" element={<AddSensor />} />
            <Route path="/verifyData" element={<VerifyData />} />

          </Routes>
        </main>
      </HStack>
    </BrowserRouter>
  );
}

export default App
