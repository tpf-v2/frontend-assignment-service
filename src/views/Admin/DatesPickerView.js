import React, { useState } from 'react';
import { Box } from '@mui/material';

import DateRangeSelector from "../../components/DateRangeSelector";

const DatePickerView = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateRangeChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <DateRangeSelector
                title="Elegir un rango de fechas de presentación"
                fromLabel="Desde"
                toLabel="Hasta"
                onDateRangeChange={handleDateRangeChange}
            />
        </Box>
      );
  };
  
  export default DatePickerView;
  