import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditReservationDto {
  phoneNumber?: string;
  status?: "pending" | "confirmed";
}

export interface IEditReservation extends IServiceData {
  phone_number?: string;
  status?: "pending" | "confirmed";
}

const date = new Date();

const EditReservationValidator = ajv.compile({
  type: "object",
  properties: {
    phoneNumber: {
      type: "string",
      pattern: "\\+[0-9]{8,23}",
    },
  },
  additionalProperties: true,
});

export { EditReservationValidator };
