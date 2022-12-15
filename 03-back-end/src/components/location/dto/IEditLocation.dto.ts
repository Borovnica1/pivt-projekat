import Ajv from "ajv";

const ajv = new Ajv();

export default interface IEditLocation {
  location_name: string;
}

interface IEditLocationServiceDto {
  locationName: string;
}

const EditLocationSchema = {
  type: "object",
  properties: {
    location_name: {
      type: "string",
      minLength: 2,
      maxLength: 30,
    },
  },
  required: ["locationName"],
  additionalProperties: false,
};

const EditLocationValidator = ajv.compile(EditLocationSchema);

export { EditLocationValidator, IEditLocationServiceDto };
