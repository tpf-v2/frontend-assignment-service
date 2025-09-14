import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMemo } from 'react';
import {
  CalendarStyled,
  AvailabilityContainer,
  DescriptionBox,
} from "../styles/AvailabilityCalendarStyle";
import 'moment-timezone' // or 'moment-timezone/builds/moment-timezone-with-data[-datarange].js'. See their docs
// Set the IANA time zone you want to use


const CommonCalendar = ({
            defaultDate,
            userAvailability,
            handleSelectSlot, 
            handleSelectEvent, 
            slotPropGetter}) => {
    const localizer = momentLocalizer(moment);
    const messages = {next: "Siguiente",previous: "Atrás",today: "Hoy"}

    const { formats } = useMemo(() => ({
        formats: {
            dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd DD/MM', culture),

            dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
            localizer.format(start, 'dddd D, YYYY', culture) +
            ' - ' +
            localizer.format(end, 'dddd D, YYYY', culture),
        },
    }))
    return (<CalendarStyled
        messages={messages} 
        localizer={localizer}
        events={userAvailability}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={["week"]}
        defaultView="week"
        timeslots={1}
        step={60}
        showMultiDayTimes
        defaultDate={defaultDate || new Date()}
        culture={"es"}
        style={{ height: "500px", margin: "50px" }}
        min={new Date(0, 0, 0, 9, 0, 0)}
        max={new Date(0, 0, 0, 21, 0, 0)}
        formats={formats}
        components={{
        month: {
            header: () => null,
        },
        }}
        dayPropGetter={(date) => {
        const day = date.getDay();
        if (day === 0 || day === 6) {
            return { style: { display: "none" } };
        }
        return {};
        }}
        slotPropGetter={slotPropGetter}
        onNavigate={(date) => {
        const day = date.getDay();
        if (day === 0 || day === 6) {
            return false;
        }
        }}
    />)
}

export default CommonCalendar;