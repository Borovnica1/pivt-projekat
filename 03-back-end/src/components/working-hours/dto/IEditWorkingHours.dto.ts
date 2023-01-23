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
  is_closed?: boolean;
}

interface IEditWorkingHoursServiceDto {
  open?: number;
  openingHours?: string;
  closingHours?: string;
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
      formatMinimum: {
        $data: "1/openingHours",
      },
    },
    isClosed: {
      enum: ["1", "0"],
    },
  },
  additionalProperties: true,
});

export { EditWorkingHoursValidator, IEditWorkingHoursServiceDto, daysInAWeek };
