import Ajv from "ajv";

const ajv = new Ajv();

export interface IManagerLoginDto {
  email: string;
  password: string;
}

const ManagerLoginValidator = ajv.compile({
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$",
    },
  },
  required: ["email", "password"],
  additionalProperties: false,
});

export { ManagerLoginValidator };
