import Ajv from "ajv";

const ajv = new Ajv();

export default interface IEditRestaurant {
  name: string;
}

interface IEditRestaurantServiceDto {
  name: string;
  location_id: number;
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
  additionalProperties: false,
});

export { EditRestaurantValidator, IEditRestaurantServiceDto };
