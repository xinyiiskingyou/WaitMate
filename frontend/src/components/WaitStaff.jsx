
import React, { useState } from "react";
import { Container, Box, Typography, Grid, Button} from '@mui/material';

const WaitStaff = () => {

    const StyledTableCell = ({ children }) => (
          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              display: 'inline-block',
              margin: '5px',
            }}
          >
            {children}
          </Box>
      );

      const CustomTableCell = ({ status }) => {
        const cellStyles = {
          margin: '5px',
          padding: '8px',
          borderRadius: '8px',
          display: 'inline-block',
          backgroundColor: status === 'Seated' ? '#A1C935' : '#C4C4C4',
          color: status === 'Seated' ? 'white' : 'inherit',

        };
      
        return <Button sx={cellStyles}>{status}</Button>;
      };
      const generateTableRows = (data) => {
        return data.map((row, index) => (
          <Box key={index} display= 'flex' justifyContent= 'center' alignItems= 'center' >
            <StyledTableCell>
            <Typography variant="h6" align="center" margin={'10px'}>{row.table}
            </Typography>
            </StyledTableCell>
            <CustomTableCell status={row.status} />
          </Box>
        ));
      };
    return (
    <Container>
        <Box display="flex" >
            <Box sx={{ border: '2px solid #000', width: '50%', height: '80vh', m: 2 }}>
                <Typography variant="h2" align="center" margin={'10px'}>Table status</Typography>

                {generateTableRows([
                    { table: 'Table 1', status: 'Seated' },
                    { table: 'Table 2', status: 'Seated' },
                    { table: 'Table 3', status: 'Empty' },
                    { table: 'Table 4', status: 'Seated' },
                    { table: 'Table 5', status: 'Empty' },
                    { table: 'Table 6', status: 'Empty' },
                    { table: 'Table 7', status: 'Empty' },
                    { table: 'Table 8', status: 'Empty' },
                ])}
            </Box>
        </Box>
    </Container>
    );
};

export default WaitStaff;