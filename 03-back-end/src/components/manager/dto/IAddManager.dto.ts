import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);
export default interface IAddManager extends IServiceData {
  email: string;
  username: string;
  password_hash: string;
}

export interface IAddManagerDto {
  email: string;
  username: string;
  password: string;
}

const AddManagerSchema = {
  type: "object",
  properties: {
    email: {
      type: "string",
      // format: "idn-email", // Za IDN podrsku
      format: "email",
    },
    username: {
      type: "string",
      pattern: "^[a-z-]{5,64}$",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
  },
  required: ["email","username", "password"],
  additionalProperties: false,
};

const AddManagerValidator = ajv.compile(AddManagerSchema);

export { AddManagerValidator };
