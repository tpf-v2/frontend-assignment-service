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

    function formatInfo(info) {
        if (!info) return null;
        return info.toDate()
    }

    function getDatesBetween(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
    
        if (currentDate > endDate) {
            console.log(`Start Date: ${currentDate} greater than End Date: ${currentDate}`)
            return dates;
        }
    
        while (currentDate <= endDate) {
            const day = currentDate.getDay();
            if (day !== 0 && day !== 6) { // filter weekends
                console.log(`week date: ${currentDate}`)
                dates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    function formatRanges(ranges, startKey, endKey) {
        let result = [];
        Object.entries(ranges).forEach(([key, range]) => {
            if (startKey === "startDate" && endKey === "endDate") {
                const daysInBetween = getDatesBetween(range["startDate"], range["endDate"])
                result = result.concat(daysInBetween);
                console.log("result + days in between: ", result)
            } else {
                if(range[`${startKey}`])result.push(formatInfo(range[`${startKey}`]))
                if(range[`${endKey}`])result.push(formatInfo(range[`${endKey}`]))
            }
          }
        )

        return result;
    }

    function getContinuosHours(times, startHour, endHour) {
        console.log("times: ", times)
        let hours = []
        times.forEach((hour, index) => {
            let slot_hour = startHour + index;
            if (slot_hour <= endHour) {
                slot_hour.setHours(slot_hour);
                console.log("slot_hour: ", slot_hour)
                hours.push(slot_hour);
            }
        });

        return hours;
    }

    function getAvailableHours(times) {
        const AmRange = getContinuosHours(times, times[0].getHours(), times[1].getHours());
        console.log("AmRange: ", AmRange)
        const PmRange = getContinuosHours(times, times[2].getHours(), times[3].getHours());
        console.log("PmRange: ", PmRange)
        
        return AmRange.concat(PmRange);
    }

    const handleSubmit = () => {
        const availableDates = formatRanges(dateRanges, "startDate", "endDate")
        availableDates.pop()
        console.log('availableDates:', availableDates);

        const formattedTimes = formatRanges(timeRanges, "startTime", "endTime")
        const availableHours = getAvailableHours(formattedTimes)
        console.log('availableHours:', availableHours);
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
