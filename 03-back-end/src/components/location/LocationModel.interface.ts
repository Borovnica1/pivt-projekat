import RestaurantModel from '../restaurant/RestaurantModel.model';
class LocationModel {
  locationId: number;
  locationName: string;

  restaurants?: RestaurantModel[]
}

export default LocationModel;
