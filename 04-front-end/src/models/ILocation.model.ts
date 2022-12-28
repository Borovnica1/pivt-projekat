import IRestaurantModel from "./IRestaurant.model";

interface ILocation {
  locationId: number;
  locationName: string;

  restaurants?: IRestaurantModel[];
}

export default ILocation;
