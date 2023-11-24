import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const SensorTable = ({ data }) => {
  return (
    <Table variant="simple" borderWidth="1px" borderRadius="md" overflow="hidden">
      <Thead>
        <Tr>
          <Th textAlign="center">Sensor ID</Th>
          <Th textAlign="center">Alert Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <Tr key={index}>
            <Td textAlign="center">{item.sensorId}</Td>
            <Td textAlign="center">{item.nextAlert*5}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default SensorTable;
