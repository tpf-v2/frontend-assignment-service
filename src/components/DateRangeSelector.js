import React from 'react';
import { Box, Typography } from '@mui/material';
import DatePickerInput from './DatePickerInput';

const DateRangeSelector = ({title, from_label, to_label }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" gutterBottom>
            {title}
            </Typography>
            <DatePickerInput label={from_label} /><DatePickerInput label={to_label} />
        </Box>
  );
};

export default DateRangeSelector;
