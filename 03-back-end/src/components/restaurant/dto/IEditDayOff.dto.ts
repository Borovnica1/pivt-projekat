import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditDayOffDto {
  dayOffDate?: string;
  reason?: string;
}

export interface IEditDayOff extends IServiceData {
  day_off_date?: string;
  reason?: string;
}

const EditDayOffValidator = ajv.compile({
  type: "object",
  properties: {
    dayOffDate: {
      type: "string",
      format: "date",
    },
    reason: {
      type: "string",
      maxLength: 2000,
    },
  },
  additionalProperties: true,
});

export { EditDayOffValidator };
