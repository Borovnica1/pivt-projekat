import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddLocation {
  location_name: string;
}

const AddLocationSchema = {
  type: "object",
  properties: {
    location_name: {
      type: "string",
      minLength: 2,
      maxLength: 30,
    },
  },
  required: ["location_name"],
  additionalProperties: false,
};

const AddLocationValidator = ajv.compile(AddLocationSchema);

interface IAddLocationServiceDto {
  location_name: string;
  locationId: number;
}
export { AddLocationValidator, IAddLocationServiceDto };
