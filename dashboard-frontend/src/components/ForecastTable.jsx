import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { border } from '@chakra-ui/styled-system';

const ForecastTable = (props) => {
  console.log(props)
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: 'lightblue',
        borderColor: 'blue',
        pointBackgroundColor: 'darkblue',
        tension: 0,
        fill: true,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}:5000/forecasting/1`);
        const jsonData = await response.json();
        const labels = jsonData.map(entry => {
          const timestamp = new Date(entry.timestamp);
          return timestamp.toLocaleTimeString('en-US', { hour12: false });
        });

        const values = jsonData.map(entry => entry.value);
        setData({
          ...data,
          labels,
          datasets: [
            {
              ...data.datasets[0],
              data: values,
              label: props.data,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <div className="wrapper" style={{ fontSize: '1.1rem', border:'None' }}>
        <div className="box">
          <Card width={'100%'}>
            <CardHeader>
              <Heading size="md">Forecast data</Heading>
            </CardHeader>
            <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="App" style={{ width: '400px', height: '200px' }}>
                <Line data={data} options={{ animation: true }} />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForecastTable;
