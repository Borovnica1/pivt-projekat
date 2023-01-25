import Ajv from "ajv";
import { DayInAWeek } from "../Working-hoursModel.model";
import { daysInAWeek } from "./IAddWorkingHours.dto";
import addFormats from "ajv-formats";

const ajv = new Ajv({
  $data: true,
});
addFormats(ajv);

export default interface IEditWorkingHours {
  open?: number;
  opening_hours?: string;
  closing_hours?: string;
}

interface IEditWorkingHoursServiceDto {
  open?: number;
  openingHours?: string;
  closingHours?: string;
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
      formatMinimum: {
        $data: "1/openingHours",
      },
    },
    open: {
      enum: ["1", "0"],
    },
  },
  additionalProperties: true,
});

export { EditWorkingHoursValidator, IEditWorkingHoursServiceDto, daysInAWeek };
