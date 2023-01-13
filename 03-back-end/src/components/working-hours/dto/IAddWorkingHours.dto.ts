import Ajv from "ajv";
import { DayInAWeek } from "../Working-hoursModel.model";

const ajv = new Ajv();

const daysInAWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default interface IAddWorkingHours {
  day: keyof typeof DayInAWeek;
  open: number;
  opening_hours?: Date;
  closing_hours?: Date;
  restaurant_id: number;
}

interface IAddWorkingHoursServiceDto {
  day: keyof typeof DayInAWeek;
  open: number;
  openingHours?: Date;
  closingHours?: Date;
}

const AddWorkingHoursValidator = ajv.compile({
  type: "object",
  properties: {
    day: {
      enum: daysInAWeek,
    },
  },
  required: ["day"],
  additionalProperties: true,
});

export { AddWorkingHoursValidator, IAddWorkingHoursServiceDto, daysInAWeek };
