import React from "react";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { CalendarStyled } from "../../../styles/AvailabilityCalendarStyle";

const localizer = momentLocalizer(moment);

const CalendarSection = (events) => (
  <CalendarStyled
    localizer={localizer}
    // events={events}
    selectable
    //   onSelectSlot={handleSelectSlot}
    // onSelectEvent={handleSelectEvent}
    views={["week"]}
    defaultView="week"
    timeslots={1}
    step={60}
    showMultiDayTimes
    defaultDate={new Date()}
    style={{ height: "500px", margin: "50px" }}
    min={new Date(0, 0, 0, 9, 0, 0)}
    max={new Date(0, 0, 0, 21, 0, 0)}
    components={{
      month: {
        header: () => null,
      },
    }}
    dayPropGetter={(date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        // sábado y domingo
        return { style: { display: "none" } }; // Ocultar este día
      }
      return {};
    }}
    onNavigation={(date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return false;
      }
    }}
  />
);

export default CalendarSection;
