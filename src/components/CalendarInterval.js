import moment from "moment";
export class CalendarInterval {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    lastHourAvailable(){
        // Obtener la última hora disponible a partir del intervalo
        const finalHourSlot = new Date(this.end);
        finalHourSlot.setHours(finalHourSlot.getHours() - 1);
        return finalHourSlot
    }

    ISOStart() {
        return this.start.toISOString()
    }

    ISOEnd() {
        return this.end.toISOString()
    }

    /**
     * Revisa si este intervalo está estrictamente dentro de ISOAvailableDates.
     * @param {ISOAvailableDates} ISOAvailableDates lista de strings de fecha en formato ISO
     */
    isWithin(ISOAvailableDates) {
        const isStartAvailable = ISOAvailableDates.has(this.ISOStart());
        const isEndAvailable = ISOAvailableDates.has(this.lastHourAvailable().toISOString()); // Verificar con la fecha ajustada
        return isStartAvailable && isEndAvailable
    }

    overlapsWithAny(intervals) {
        return intervals.some(
            (interval) => this.start < interval.end && this.end > interval.start
        );
    } 

    minuteDuration() {
        return (this.end - this.start) / (1000 * 60)
    }

    formatForSendingToServer() {
        return {
            start: moment(this.start).subtract(3, "hours").utc().format(),
            end: moment(this.end).subtract(3, "hours").utc().format(),
        }
    }
}
