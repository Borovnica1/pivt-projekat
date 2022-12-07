import PhotoModel from "../photo/PhotoModel.model";
class RestaurantModel {
  restaurantId: number;
  name: string;

  photos?: PhotoModel[];
}

export default RestaurantModel;
