import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Container, Typography } from '@mui/material';

const localizer = momentLocalizer(moment);

const AvailabilityCalendar = () => {
    const [events, setEvents] = useState([]);

    const handleSelectSlot = ({ start, end }) => {
        const title = window.prompt('Nuevo Bloque de Disponibilidad');
        if (title) {
            setEvents([
                ...events,
                {
                    start,
                    end,
                    title,
                },
            ]);
        }
    };

    return (
        <Container style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom style={{ color: '#0072C6', textAlign: 'center' }}>
                Marca tu Disponibilidad
            </Typography>
            <Calendar
                localizer={localizer}
                events={events}
                defaultView="week"
                selectable
                onSelectSlot={handleSelectSlot}
                views={['week']}
                step={60}
                showMultiDayTimes
                defaultDate={new Date()}
                style={{ height: '500px', margin: '50px' }}
            />
        </Container>
    );
};

export default AvailabilityCalendar;