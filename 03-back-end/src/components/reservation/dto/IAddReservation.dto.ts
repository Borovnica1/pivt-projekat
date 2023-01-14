import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
require("ajv-errors")(ajv /*, {singleError: true} */);

ajv.addKeyword({
  keyword: "checkIfMaxReservationIs30minutesInterval",
  modifying: true,
  schema: false,
  validate: function (minutes) {
    return minutes % 30 === 0 && minutes !== 0;
  },
});

export interface IAddReservationDto {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  reservationDate: string;
  reservationDuration: number;
  status: "pending" | "confirmed";
  tableId: number;
}



export interface IAddReservation extends IServiceData {
  first_name: string;
  last_name: string;
  phone_number?: string;
  email: string;
  reservation_date: string;
  reservation_duration: number;
  status: string;
  table_id: number;
}


const date = new Date();

const AddReservationValidator = ajv.compile({
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    reservationDate: {
      type: "string",
      format: "date-time",
      formatMinimum: date.toISOString(),
      formatExclusiveMaximum: "2099-12-27",
    },
    reservationDuration: {
      type: "number",
      checkIfMaxReservationIs30minutesInterval: true,
      errorMessage: {
        checkIfMaxReservationIs30minutesInterval:
          "max reservation duration has to be in minutes with 30 interval. valid input for example (30, 60, 90, 120...)",
      },
    },
    phoneNumber: {
      type: "string",
      pattern: "\\+[0-9]{8,23}",
    },
  },
  required: ["email", "reservationDate", "reservationDuration"],
  additionalProperties: true,
});

export { AddReservationValidator };
