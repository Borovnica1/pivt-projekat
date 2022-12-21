import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddDayOffDto {
  dayOffDate: string;
  reason: string;
}

export interface IAddDayOff extends IServiceData {
  restaurant_id: number;
  day_off_date: string;
  reason: string;
}

const date = new Date();

const AddDayOffValidator = ajv.compile({
  type: "object",
  properties: {
    dayOffDate: {
      type: "string",
      format: "date",
      formatMinimum: date.toISOString(),
      formatExclusiveMaximum: "2099-12-27",
    },
    reason: {
      type: "string",
      maxLength: 2000,
    },
  },
  required: ["dayOffDate"],
  additionalProperties: true,
});

export { AddDayOffValidator };
