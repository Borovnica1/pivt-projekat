import PhotoModel from "../photo/PhotoModel.model";
import WorkingHoursModel from "../working-hours/Working-hoursModel.model";
class RestaurantModel {
  restaurantId: number;
  name: string;

  photos?: PhotoModel[];
  workingHours?: WorkingHoursModel[];
}

class RestaurantManagerModel {
  restaurantManagerId: number;
  restaurantId: number;
  managerId: number;
}

export { RestaurantModel as default, RestaurantManagerModel };
