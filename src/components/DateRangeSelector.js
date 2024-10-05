import React from 'react';
import { Box, Typography } from '@mui/material';
import DatePickerInput from './DatePickerInput';

const DateRangeSelector = ({ title, fromLabel, toLabel, onDateRangeChange }) => {
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
            <DatePickerInput
                label={fromLabel}
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)} />
            <DatePickerInput
                label={toLabel}
                value={toDate}
                onChange={(newValue) => setToDate(newValue)} />
        </Box>
  );
};

export default DateRangeSelector;
