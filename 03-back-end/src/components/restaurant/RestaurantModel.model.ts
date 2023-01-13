import PhotoModel from "../photo/PhotoModel.model";
import WorkingHoursModel from "../working-hours/Working-hoursModel.model";
import { AddressModel } from "./AddressService.service";
import { TableModel } from "./TableService.service";
import { DayOffModel } from './DayOffService.service copy';
class RestaurantModel {
  restaurantId: number;
  name: string;

  photos?: PhotoModel[];
  workingHours?: WorkingHoursModel[];
  daysOff?: DayOffModel[];
  addresses?: AddressModel[];
  tables?: TableModel[];
}

class RestaurantManagerModel {
  restaurantManagerId: number;
  restaurantId: number;
  managerId: number;
}

export { RestaurantModel as default, RestaurantManagerModel };
