import React, { useState } from 'react';
import { Box } from '@mui/material';

import DateTimeSelector from "../../components/DateTimeSelector";
import DatePickerInput from "../../components/DatePickerInput"

const DatePickerView = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateRangeChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <DateTimeSelector
                title="Elegir un rango de fechas de presentación"
                fromLabel="Desde"
                toLabel="Hasta"
                onDateRangeChange={handleDateRangeChange}
                Component={DatePickerInput}
            />
        </Box>
      );
  };
  
  export default DatePickerView;
  