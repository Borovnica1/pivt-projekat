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
  open: number;
  openingHours: string;
  closingHours: string;
}

export { DayInAWeek };
