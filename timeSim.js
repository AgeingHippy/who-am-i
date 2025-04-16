//An attempt at simulating the time in a different location
//Construction parameter offset is the simulated time offset in minutes from UTC
/*export default*/ class SimDate {
  #offset = 0;
  #offsetHHMM = "+0000";
  #timeZoneName="";

  constructor(offset) {
    if (!Number.isFinite(offset) || offset < -14 * 60 || offset > +12 * 60) {
      throw new Error(
        "Provided offset must be valid. Expected -14*60 <= offset <= +12*60. Note UTC-8 has offset +480"
      );
    }
    this.#offset = offset;
    let absOffset = Math.abs(offset);
    this.#offsetHHMM =
      (offset < 0 ? "+" : "-") +
      String(Math.floor(absOffset / 60)).padStart(2, "0") +
      String(absOffset % 60).padStart(2, "0");
  }

  setTimeZoneName(timeZoneName) {
    this.#timeZoneName = timeZoneName;
  }

  getTimeZoneOffset() {
    return this.#offset;
  }

  getTime() {
    let now = new Date();
    return this.#simGetTime(now);
  }

  #simGetTime(now) {
    return now.getTime() - (this.#offset - now.getTimezoneOffset())*60*1000;
  }

  toTimeString() {
    let now = new Date();
    return this.#simToTimeString(now);
  }

  #simToTimeString(now) {
    let nowSim = new Date(this.#simGetTime(now));
    let nowSimTimeString = nowSim.toLocaleTimeString();
    let timeZone = this.#timeZoneName != "" ?` (${this.#timeZoneName})`:"";
    return `${nowSimTimeString} GMT${this.#offsetHHMM}${timeZone}`;
  }

  toDateString() {
    let now = new Date();
    return this.#simToDateString(now);
  }

  #simToDateString(now) {
    let simDate = new Date(this.#simGetTime(now));
    return simDate.toDateString();
  }

  toString() {
    let now = new Date();
    return `${this.#simToDateString(now)} ${this.#simToTimeString(now)}`;
  }

  //Input parameter timeZone in format '+00:00' or '-00:00'
  //returns timezone offset in minutes
  //NOTE: -01:00 has offset +60
  static timezoneToOffset(timeZone) {
    const timeZonePattern = /^([+|-])(\d{2}):(\d{2})$/;
    let timeZoneMatch = timeZone.match(timeZonePattern);
    if (!timeZoneMatch) {
        throw new Error("timeZone parameter expected in format '+00:00' or '-00:00'. i.e. Matching pattern /^([+|-])(\d{2}):(\d{2})$/")
    }
    return (timeZoneMatch[1] == "+" ? -1 : +1) * (+timeZoneMatch[2]*60 + +timeZoneMatch[3]) 
  }

}
