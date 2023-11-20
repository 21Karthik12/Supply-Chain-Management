import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HStack } from '@chakra-ui/react';
import LandingPage from './pages/LandingPage'
import FetchSensorDetails from './pages/FetchSensorDetails';
import Sidebar from './components/Sidebar';
import OldLandingPage from './pages/OldLandingPage';

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
          </Routes>
        </main>
      </HStack>
    </BrowserRouter>
  );
}

export default App
