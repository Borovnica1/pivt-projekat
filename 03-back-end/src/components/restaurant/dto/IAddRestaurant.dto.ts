import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddRestaurant {
  name: string;
  description?: string;
}

interface IAddRestaurantServiceDto {
  name: string;
  description?: string;
  location_id: number;
}

const AddRestaurantValidator = ajv.compile({
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 4,
      maxLength: 32,
    },
  },
  required: ["name"],
  additionalProperties: true,
});

export { AddRestaurantValidator, IAddRestaurantServiceDto };
