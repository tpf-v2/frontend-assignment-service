import React, { useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { useParams } from "react-router-dom";

import DateTimeSelector from "../../components/DateTimeSelector";
import DatePickerInput from "../../components/DatePickerInput";
import TimePickerInput from '../../components/TimePickerInput';
import AddButton from '../../components/Buttons/AddButton';
import SubmitButton from '../../components/Buttons/SubmitButton';

const DatePickerView = () => {
    const { cuatrimestre } = useParams();

    const [isFlagActive, setIsFlagActive] = useState(false); 
    const handleFlagChange = () => {
        setIsFlagActive(prev => !prev); // Alternar el estado del flag
    };
    
    const [dateRanges, setDateRanges] = useState({
        range1: { startDate: null, endDate: null },
        range2: { startDate: null, endDate: null },
      });
      
    const handleDateRangeChange = (rangeKey, newStartDate, newEndDate) => {
        setDateRanges(prevRanges => ({
            ...prevRanges,
            [rangeKey]: { startDate: newStartDate, endDate: newEndDate }
        }));
    };

    const [timeRanges, setTimeRanges] = useState({
        range1: { startTime: null, endTime: null },
        range2: { startTime: null, endTime: null },
      });
      
    const handleTimeRangeChange = (rangeKey, newStartTime, newEndTime) => {
        setTimeRanges(prevRanges => ({
            ...prevRanges,
            [rangeKey]: { startTime: newStartTime, endTime: newEndTime }
        }));
    };

    const handleSubmit = () => {
        console.log("Submit available dates")
        console.log("date ranges: ", dateRanges)
        console.log("time ranges: ", timeRanges)
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom> Seleccionar Fechas</Typography>
            <DateTimeSelector
                title=""
                fromLabel="Desde"
                toLabel="Hasta"
                onRangeChange={handleDateRangeChange}
                Component={DatePickerInput}
                rangeKey="range1"
            />
            { isFlagActive &&
                <DateTimeSelector
                title=""
                fromLabel="Desde"
                toLabel="Hasta"
                onRangeChange={handleDateRangeChange}
                Component={DatePickerInput}
                rangeKey="range2"
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
                    onRangeChange={handleTimeRangeChange}
                    Component={TimePickerInput}
                    rangeKey="range1"
                />
                <DateTimeSelector
                    title="Tarde/Noche"
                    fromLabel="Desde"
                    toLabel="Hasta"
                    onRangeChange={handleTimeRangeChange}
                    Component={TimePickerInput}
                    rangeKey="range2"
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <SubmitButton url={`/dashboard/${cuatrimestre}`} title="Cargar Fechas Disponibles" width="50%" handleSubmit={handleSubmit} />
            </Box>
        </div>
    );
};
  
export default DatePickerView;
