import * as mysql2 from "mysql2/promise";
import LocationService from "../components/location/LocationService.service";
import ManagerService from "../components/manager/ManagerService.service";
import RestaurantService from "../components/restaurant/RestaurantService.service";
import WorkingHoursService from "../components/working-hours/Working-hoursService.service";
import PhotoService from "../components/photo/PhotoService.service";
import UserService from "../components/user/UserService.service";
import AddressService from "../components/restaurant/AddressService.service";
import DayOffService from "../components/restaurant/DayOffService.service copy";
import TableService from '../components/restaurant/TableService.service';

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
  user: UserService;
  address: AddressService;
  dayOff: DayOffService;
  table: TableService;
}
