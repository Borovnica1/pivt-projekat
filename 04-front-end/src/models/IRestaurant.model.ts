import IPhoto from "./IPhoto.model";
import WorkingHours from "./IWorkingHours.model";

export interface IAddressModel {
  addressId: number;
  streetAndNumber: string;
  phoneNumber: string;
  toDelete?: boolean;
}
export interface IDayOffModel {
  dayOffId: number;
  restaurantId: number;

  dayOffDate: Date;
  reason: string;
  toDelete?: boolean;
}
export interface ITableModel {
  tableId: number;
  restaurantId: number;

  tableName: string;
  tableCapacity: string;
  tableMaxReservationDuration: number;
  toDelete?: boolean;
}

interface IRestaurant {
  restaurantId: number;
  name: string;
  description: string;

  photos?: IPhoto[];
  workingHours: WorkingHours[];
  addresses?: IAddressModel[];
  daysOff?: IDayOffModel[];
  tables?: ITableModel[];
}

export default IRestaurant;
