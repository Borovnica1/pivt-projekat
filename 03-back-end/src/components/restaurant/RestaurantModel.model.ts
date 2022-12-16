import PhotoModel from "../photo/PhotoModel.model";
class RestaurantModel {
  restaurantId: number;
  name: string;

  photos?: PhotoModel[];
}

class RestaurantManagerModel {
  restaurantManagerId: number;
  restaurantId: number;
  managerId: number;
}

export { RestaurantModel as default, RestaurantManagerModel };
