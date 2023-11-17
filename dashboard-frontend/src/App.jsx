import React from 'react';
import { useState } from 'react';
import {  BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage  from './pages/LandingPage'
import FetchSensorDetails from './pages/FetchSensorDetails';
import OldLandingPage from './pages/OldLandingPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <main style={{minHeight:"93vh"}}>
        <Routes>
          <Route exact path='/' element={<LandingPage/>}></Route>
          <Route path="/:sensorId/:moduleId" element={<FetchSensorDetails/>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
