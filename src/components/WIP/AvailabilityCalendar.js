// AvailabilityCalendar.js
import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { styled } from '@mui/material/styles';

const localizer = momentLocalizer(moment);

const CalendarStyled = styled(Calendar)(({ theme }) => ({
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: theme.shadows[5],
  '& .rbc-header': {
    backgroundColor: '#0072C6',
    color: 'white',
    fontWeight: 'bold',
  },
  '& .rbc-event': {
    backgroundColor: '#005B9A',
    color: '#ffffff',
    borderRadius: '5px',
  },
  '& .rbc-selected': {
    backgroundColor: '#0072C6',
    color: '#ffffff',
  },
  '& .rbc-off-range-bg': {
    backgroundColor: '#f1f1f1', 
  },
  '& .rbc-day-slot': {
    border: '1px solid #d9d9d9',
  },
}));

const AvailabilityCalendar = ({ events, handleSelectSlot }) => {
  // Función para filtrar las fechas visibles
  const filterDates = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // solo permite días de lunes a viernes
  };

  // No mostrar sábados y domingos en el display
  const renderedWeeks = (date) => {
    const weeks = [];
    const startDate = moment(date).startOf('isoweek').toDate(); // Primer día de la semana (lunes mapeado a 0)
    
    for (let i = 0; i < 5; i++) { // Solo 5 días (lunes a viernes)
      const weekDate = moment(startDate).add(i, 'days').toDate();
      weeks.push(weekDate);
    }
    
    return weeks;
  };

  return (
    <CalendarStyled
      localizer={localizer}
      events={events}
      selectable
      onSelectSlot={handleSelectSlot}
      views={['week', 'day']}
      defaultView="week"
      step={60}
      showMultiDayTimes
      defaultDate={new Date()}
      style={{ height: '500px', margin: '50px' }}
      min={new Date(0, 0, 0, 9, 0, 0)}  // Comienza a las 9 AM
      max={new Date(0, 0, 0, 21, 0, 0)} // Termina a las 9 PM
      components={{
        month: {
          header: () => null,
        },
      }}
      dayPropGetter={(date) => {
        const day = date.getDay();
        if (day === 0 || day === 6) { // sábado y domingo
          return {
            style: { display: "none" }, // Ocultar este día
          };
        }
        return {};
      }}
      onNavigation={(date) => {
        const day = date.getDay();
        if (day === 0 || day === 6) {
          return false;
        }
      }}
      onShowMore={(events, date) => {
        const filteredEvents = events.filter(event => filterDates(event.start));
      }}
    />
  );
};

export default AvailabilityCalendar;