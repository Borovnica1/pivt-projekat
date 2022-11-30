import Ajv from "ajv";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv();

export default interface IAddManager extends IServiceData {
  username: string;
  password_hash: string;
}

export interface IAddManagerDto {
  username: string;
  password: string;
}

const AddManagerSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: "^[a-z-]{5,64}$",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

const AddManagerValidator = ajv.compile(AddManagerSchema);

export { AddManagerValidator };
