import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();
addFormats(ajv);

export interface IEditAddressDto {
  streetAndNumber?: string;
  place?: string;
  phoneNumber?: string;
}

export interface IEditAddress extends IServiceData {
  street_and_number?: string;
  place?: string;
  phone_number?: string;
}

const EditAddressValidator = ajv.compile({
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
  additionalProperties: true,
});

export { EditAddressValidator };
