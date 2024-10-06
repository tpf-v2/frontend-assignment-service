import React from 'react';
import { Box, Typography } from '@mui/material';

const DateTimeSelector = ({ title, fromLabel, toLabel, onRangeChange, Component, rangeKey }) => {
    const [from, setFrom] = React.useState(null);
    const [to, setTo] = React.useState(null);

    React.useEffect(() => {
        if (from && to && from > to) {
            console.error("La fecha de inicio no puede ser posterior a la fecha de finalización.");
        } else {
            onRangeChange(rangeKey, from, to); 
        }
    }, [from, to, rangeKey]);
        
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
