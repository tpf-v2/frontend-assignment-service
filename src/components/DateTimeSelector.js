import React from 'react';
import { Box, Typography } from '@mui/material';

const DateTimeSelector = ({ title, fromLabel, toLabel, onRangeChange, Component, rangeKey }) => {
    const [from, setFrom] = React.useState(null);
    const [to, setTo] = React.useState(null);

    React.useEffect(() => {
        onRangeChange(rangeKey, from, to); 
    }, [from, to]);
        
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h6" gutterBottom>
            {title}
            </Typography>
            <Component
                label={fromLabel}
                value={from}
                onChange={(newValue) => setFrom(newValue)} />
            <Component
                label={toLabel}
                value={to}
                onChange={(newValue) => setTo(newValue)} 
            />
        </Box>
  );
};

export default DateTimeSelector;
