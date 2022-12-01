import Ajv from "ajv";
import { DayInAWeek } from "../Working-hoursModel.model";

const ajv = new Ajv();

export default interface IAddWorkingHours {
  day: DayInAWeek;
  opening_hours: Date;
  closing_hours: Date;
  restaurant_id: number;
}

interface IAddWorkingHoursServiceDto {
  day: DayInAWeek;
  openingHours: Date;
  closingHours: Date;
}

const AddWorkingHoursValidator = ajv.compile({
  type: "object",
  properties: {
    day: {
      type: "string",
    },
  },
  required: ["day"],
  additionalProperties: true,
});

export { AddWorkingHoursValidator, IAddWorkingHoursServiceDto };
