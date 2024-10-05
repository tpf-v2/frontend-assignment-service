import React from 'react';
import { Box, Typography } from '@mui/material';

const DateTimeSelector = ({ title, fromLabel, toLabel, onDateRangeChange, Component }) => {
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);

    React.useEffect(() => {
        onDateRangeChange(fromDate, toDate); 
    }, [fromDate, toDate, onDateRangeChange]);
        
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
            {title}
            </Typography>

            <Component
                label={fromLabel}
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)} />

            <Component
                label={toLabel}
                value={toDate}
                onChange={(newValue) => setToDate(newValue)} 
            />
        </Box>
  );
};

export default DateTimeSelector;
