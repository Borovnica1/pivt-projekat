import IModel from "../../common/IModel.interface";

export default class ReservationModel implements IModel {
  reservationId: number;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  reservationDate: string;
  reservationDuration: number;
  status: "pending" | "confirmed";
  tableId: number;
  userId: number;
  tableName?: string;
  restaurantName?: string;
  restaurantId?: number;
}
