import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IAddAddressDto {
  streetAndNumber: string;
  place?: string;
  phoneNumber: string;
}

export interface IAddAddress extends IServiceData {
  restaurant_id: number;
  street_and_number: string;
  place?: string;
  phone_number: string;
}

const AddAddressValidator = ajv.compile({
  type: "object",
  properties: {
    streetAndNumber: {
      type: "string",
      minLength: 2,
      maxLength: 255,
    },
    place: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
    phoneNumber: {
      type: "string",
      pattern: "\\+[0-9]{8,23}",
    },
  },
  required: ["streetAndNumber", "phoneNumber"],
  additionalProperties: false,
});

export { AddAddressValidator };
