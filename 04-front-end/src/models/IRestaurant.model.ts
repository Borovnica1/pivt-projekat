import IPhoto from "./IPhoto.model";
import WorkingHours from "./IWorkingHours.model";

interface IAddress {
  addressId: number;
  streetAndNumber: string;
}
interface IDayOffModel {
  dayOffId: number;
  restaurantId: number;

  dayOffDate: string;
  reason: string;
}
export interface ITableModel {
  tableId: number;
  restaurantId: number;

  tableName: string;
  tableCapacity: string;
  tableMaxReservationDuration: number;
}

interface IRestaurant {
  restaurantId: number;
  name: string;
  description: string;

  photos?: IPhoto[];
  workingHours: WorkingHours[];
  addresses?: IAddress[];
  daysOff?: IDayOffModel[];
  tables?: ITableModel[];
}

export default IRestaurant;
