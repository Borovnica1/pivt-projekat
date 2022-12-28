enum DayInAWeek {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}

export default interface IWorkingHours {
  workingHoursId: number;
  day: DayInAWeek;
  openingHours: string;
  closingHours: string;
  isClosed: string;
}

export { DayInAWeek };
