import Ajv from "ajv";

const ajv = new Ajv();

export default interface IEditRestaurant {
  name: string;
  description: string;
  location_id: number;
}

interface IEditRestaurantServiceDto {
  name: string;
  description: string;
  locationId: number;
}

const EditRestaurantValidator = ajv.compile({
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

export { EditRestaurantValidator, IEditRestaurantServiceDto };
