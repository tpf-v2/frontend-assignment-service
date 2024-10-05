import React, { useState } from 'react';
import { Box, Divider } from '@mui/material';

import DateTimeSelector from "../../components/DateTimeSelector";
import DatePickerInput from "../../components/DatePickerInput"
import TimePickerInput from '../../components/TimePickerInput';

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
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, padding: 3, border: "1px solid grey" }}>
                <DateTimeSelector
                    title="Mañana"
                    fromLabel="Desde"
                    toLabel="Hasta"
                    onDateRangeChange={handleDateRangeChange}
                    Component={TimePickerInput}
                />
                <DateTimeSelector
                    title="Tarde/Noche"
                    fromLabel="Desde"
                    toLabel="Hasta"
                    onDateRangeChange={handleDateRangeChange}
                    Component={TimePickerInput}
                />
            </Box>
        </Box>
      );
  };
  
  export default DatePickerView;
  