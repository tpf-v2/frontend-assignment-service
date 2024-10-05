import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import DateTimeSelector from "../../components/DateTimeSelector";
import DatePickerInput from "../../components/DatePickerInput";
import TimePickerInput from '../../components/TimePickerInput';
import AddButton from '../../components/AddButton';

const DatePickerView = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateRangeChange = (newStartDate, newEndDate) => {
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const [isFlagActive, setIsFlagActive] = useState(false); // Estado del flag

    const handleFlagChange = () => {
        setIsFlagActive(prev => !prev); // Alternar el estado del flag
    };
    
    return (
        <div>
            <Typography variant="h5" gutterBottom> Seleccionar Fechas</Typography>
            <DateTimeSelector
                title=""
                fromLabel="Desde"
                toLabel="Hasta"
                onDateRangeChange={handleDateRangeChange}
                Component={DatePickerInput}
            />
            { isFlagActive &&
                <DateTimeSelector
                title=""
                fromLabel="Desde"
                toLabel="Hasta"
                onDateRangeChange={handleDateRangeChange}
                Component={DatePickerInput}
            />
            }
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, padding: 3}}>
                <AddButton
                    onFlagChange={handleFlagChange} 
                    isFlagActive={isFlagActive}
                    infoActive="Eliminar nuevo intervalo de fechas"
                    infoNotActive="Agregar nuevo intervalo de fechas"
                />
            </Box>
            <Divider sx={{ margin: 5 }} />
            <Typography variant="h5" gutterBottom>Seleccionar Horarios</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 2, padding: 3}}>
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
        </div>
    );
};
  
export default DatePickerView;
