import moment from "moment";
export class CalendarInterval {
    constructor (start, end) {
        this.start = start
        this.end = end
    }

    formatForSend() {
        return {
            start: moment(this.start).subtract(3, "hours").utc().format(),
            end: moment(this.end).subtract(3, "hours").utc().format(),
        }
    }
}