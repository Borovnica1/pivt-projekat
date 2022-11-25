import Ajv from "ajv";

const ajv = new Ajv();

export default interface IAddRestaurant {
  restaurantName: string;
}

interface IAddRestaurantServiceDto {
  name: string;
  location_id: number;
}

const AddRestaurantValidator = ajv.compile({
  type: "object",
  properties: {
    restaurantName: {
      type: "string",
      minLength: 4,
      maxLength: 32,
    },
  },
  required: ["restaurantName"],
  additionalProperties: false,
});

export { AddRestaurantValidator, IAddRestaurantServiceDto };
