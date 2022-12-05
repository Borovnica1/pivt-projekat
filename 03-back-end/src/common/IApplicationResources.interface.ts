import * as mysql2 from "mysql2/promise";
import LocationService from "../components/location/LocationService.service";
import ManagerService from "../components/manager/ManagerService.service";
import RestaurantService from "../components/restaurant/RestaurantService.service";
import WorkingHoursService from "../components/working-hours/Working-hoursService.service";
import PhotoService from '../components/photo/PhotoService.service';

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
  services: IServices;
}

export interface IServices {
  location: LocationService;
  restaurant: RestaurantService;
  manager: ManagerService;
  workingHours: WorkingHoursService;
  photo: PhotoService;
}
