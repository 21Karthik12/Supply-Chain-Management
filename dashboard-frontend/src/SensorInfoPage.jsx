import { useState } from 'react'
import { Card, CardHeader, CardBody, Text, Heading, CardFooter } from '@chakra-ui/react'
import DataStream from './components/DataStream'
import Analytics from './components/Analytics'
import { HStack, VStack } from '@chakra-ui/react'
import { Route, useParams } from 'react-router-dom';
import './SensorInfoPage.css'

function SensorInfoPage(props) {
  const [count, setCount] = useState(0)
  const { id } = useParams();
  return (
    <div style={{'margin':'0 auto', 'width':'100%'}}>
        <h1 style={{'fontSize':'1.7rem'}}>Sensor #{id}</h1> 
        <div class="wrapper" style={{'fontSize':'1.1rem'}}>     
            <div class="box">
                <div class="box-content">
                    <div class="grid">
                        <div class="item bold">SENSOR TYPE:</div>
                        <div class="item">{props.type}</div>
                        <div class="item bold">SENSOR ID:</div>
                        <div class="item">{id}</div>
                        <div class="item bold">MODULE:</div>
                        <div class="item">{props.module}</div>
                        <div class="item bold">STATUS:</div>
                        <div class="item">{props.status}</div>
                    </div>

                    <div class="buttons" style={{'marginTop':'3rem'}}>
                        <a class="button" href="#">Start</a>
                        <a class="button" href="#">Stop</a>
                        <a class="button" href="#">Toggle</a>
                        <a class="button" href="#">Resolve</a>
                    </div>
                </div>
            </div>  
            <div class="box">
                <Analytics/>    
            </div>  
        </div>
    </div>
  )
}

export default SensorInfoPage
