import { useState } from 'react'
import { Card, CardHeader, CardBody, Text, Heading, CardFooter } from '@chakra-ui/react'
import DataStream from './components/DataStream'
import Analytics from './components/Analytics'
import { HStack, VStack } from '@chakra-ui/react'
import { Route, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import './SensorInfoPage.css'
import { useNavigate } from 'react-router-dom'

function SensorInfoPage() {
  const [count, setCount] = useState(0);
  const [matchingSensor, setMatchingSensor] = useState(null);
  const id = useParams().sensorId;
  /////
  const [sensorData, setSensorData] = useState([]);
  useEffect(() => {
    fetchSensorData();
  }, []); 
  let navigate = useNavigate(); 
  useEffect(() => {
    axios.get(`http://192.168.118.24:5000/getSensors`)
      .then(response => {
        const matchingSensor = response.data.find(item => item.sensorId === Number(id));
        if (matchingSensor) {
          setMatchingSensor(matchingSensor);
        } else {
          setMatchingSensor(null);
        }
        setSensorData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [id]); 
  
  let modul = '';
  let type = '';
  
  if (matchingSensor) {
    ({ module: modul, sensorType: type } = matchingSensor);
  }

  const fetchSensorData = async () => {
    try {
      const response = await axios.get(`http://192.168.118.24:5000/getSensors`);
      setSensorData(response.data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const handleResolve = async (sensorId) => {
    try {
      const payload = { command: 'resolve' };
      console.log('Resolve Payload:', payload);
      await axios.post(`http://192.168.118.24:5000/controlSensor/${sensorId}`, { command: 'resolve' });
      fetchSensorData();
    } catch (error) {
      console.error(`Error resolving sensor ${sensorId}:`, error);
    }
  };

  const handleStop = async (sensorId) => {
    try {
      await axios.post(`http://192.168.118.24:5000/controlSensor/${sensorId}`, { command: 'stop' });
      fetchSensorData();
      navigate('/');
    } catch (error) {
      console.error(`Error stopping sensor ${sensorId}:`, error);
    }
  };

  const handleToggle = async (sensorId) => {
    try {
      await axios.post(`http://192.168.118.24:5000/controlSensor/${sensorId}`, { command: 'toggle' });
      fetchSensorData();
    } catch (error) {
      console.error(`Error toggling sensor ${sensorId}:`, error);
    }
  };

  ////
  return (
    <div style={{'margin':'0 auto', 'width':'100%'}}>
        <h1 style={{'fontSize':'1.7rem'}}>Sensor #{id}</h1> 
        <div className="wrapper" style={{'fontSize':'1.1rem'}}>     
            <div className="box">
                <div className="box-content">
                    <div className="grid">
                        <div className="item bold">SENSOR TYPE:</div>
                        <div className="item">{type}</div>
                        <div className="item bold">SENSOR ID:</div>
                        <div className="item">{id}</div>
                        <div className="item bold">MODULE:</div>
                        <div className="item">{modul}</div>
                        <div className="item bold">STATUS:</div>
                        <div className="item">Running</div>
                    </div>

                    <div className="buttons" style={{'marginTop':'3rem'}}>
                        <button className="button" onClick={() => handleStop(id)}>Stop</button>
                        <button className="button" onClick={() => handleToggle(id)}>Toggle</button>
                        <button className="button" onClick={() => handleResolve(id)}>Resolve</button>
                    </div>
                </div>
            </div>  
            <div className="box">
                <Analytics id={id} type={type}/>    
            </div>  
        </div>
    </div>
  )
}

export default SensorInfoPage
