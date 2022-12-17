import Ajv from "ajv";
import { DayInAWeek } from "../Working-hoursModel.model";
import { daysInAWeek } from "./IAddWorkingHours.dto";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export default interface IEditWorkingHours {
  opening_hours?: Date;
  closing_hours?: Date;
  is_closed?: boolean;
}

interface IEditWorkingHoursServiceDto {
  openingHours?: Date;
  closingHours?: Date;
  isClosed?: boolean;
}

const EditWorkingHoursValidator = ajv.compile({
  type: "object",
  properties: {
    openingHours: {
      type: "string",
      format: "time",
    },
    closingHours: {
      type: "string",
      format: "time",
    },
    isClosed: {
      enum: ["1", "0"],
    },
  },
  additionalProperties: true,
});

export { EditWorkingHoursValidator, IEditWorkingHoursServiceDto, daysInAWeek };
