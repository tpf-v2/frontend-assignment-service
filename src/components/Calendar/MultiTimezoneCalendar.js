import { Calendar } from "react-big-calendar";
import moment from "moment-timezone";

const defaultTimezone = 'America/Argentina/Buenos_Aires';

export const MultiTimezoneCalendar = (props) => {
  function revertfixRelativeDate(date) {
        // Convertir el horario que NO es de Argentina a horario de Argentina
        const formattedDate = moment.tz(
          moment(date).format('YYYY-MM-DDTHH:mm:ss'),
          'YYYY-MM-DDTHH:mm:ss',
          defaultTimezone).format()

        return new Date(formattedDate);
  };

  function fixRelativeDate(date) {
    // Convertir el horario que NO es de Argentina a horario de Argentina
     const formattedDate = moment
      .tz(date, Intl.DateTimeFormat().resolvedOptions().timeZone)
      .clone()
      .tz(defaultTimezone)
      // Formatear la fecha para que sea compatible con el calendario
      // (Esto le elimina cualquier definicion de timezone)
      .format('YYYY-MM-DDTHH:mm:ss');

    return new Date(formattedDate);
  };

  function mapEvents(events) {
    return events.map(event => ({
      ...event,
      start: fixRelativeDate(event.start),
      end: fixRelativeDate(event.end)
    }));
  }

  // clone props
  const newProps = { ...props };

  if (props.events) {
    newProps.events = mapEvents(props.events);
  }

  if (props.onSelectEvent) {
    newProps.onSelectEvent = (event) => {
      props.onSelectEvent({
        ...event,
        start: revertfixRelativeDate(event.start),
        end: revertfixRelativeDate(event.end)
      });
    }
  }

  if (props.onSelectSlot) {
    newProps.onSelectSlot = (slotInfo) => {
      props.onSelectSlot({
        ...slotInfo,
        start: revertfixRelativeDate(slotInfo.start),
        end: revertfixRelativeDate(slotInfo.end)
      });
    }
  }

  return <Calendar {...newProps} />;
};

export default MultiTimezoneCalendar;
