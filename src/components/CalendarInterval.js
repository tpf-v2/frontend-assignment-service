import moment from "moment";
export class CalendarInterval {
    constructor (start, end) {
        this.start = start
        this.end = end
    }

    formatForSend() {
        console.info("Formatting for send: " + moment(this.start).utc(true).format() + " and " + moment(this.end).utcOffset(0).format() )
        return {
            start: moment(this.start).utc(true).format(),
            end: moment(this.end).utc(true).format(),
        }
    }
}