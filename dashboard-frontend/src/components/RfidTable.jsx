import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const RfidTable = ({ data }) => {
  return (
    <Table variant="simple" borderWidth="1px" borderRadius="md" overflow="hidden" justifyContent={"center"}>
      <Thead>
        <Tr>
          <Th textAlign="center">Scanned ID</Th>
          <Th textAlign="center">Timestamp</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <Tr key={index}>
            <Td textAlign="center">{item.scannedId}</Td>
            <Td textAlign="center">{item.timestamp}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default RfidTable;
