import BaseService from "../../common/BaseService";
import ReservationModel from "./ReservationModel.model";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IAddReservation } from "./dto/IAddReservation.dto";
import { IEditReservation } from "./dto/IEditReservation.dto";

class IReservationDefaultOptions implements IAdapterOptions {}

export default class ReservationService extends BaseService<
  ReservationModel,
  IReservationDefaultOptions
> {
  tableName() {
    return "reservation";
  }

  adaptToModel(
    data: any,
    options: IReservationDefaultOptions
  ): Promise<ReservationModel> {
    return new Promise((resolve) => {
      const reservation = new ReservationModel();

      reservation.reservationId = data.reservation_id;
      reservation.firstName = data.first_name;
      reservation.lastName = data.last_name;
      reservation.phoneNumber = data.phone_number;
      reservation.email = data.email;
      reservation.reservationDate = data.reservation_date;
      reservation.reservationDuration = data.reservation_duration;
      reservation.status = data.status;
      reservation.tableId = data.table_id;
      reservation.userId = data.user_id;

      resolve(reservation);
    });
  }

  add(data: IAddReservation): Promise<ReservationModel> {
    return this.baseAdd(data, {});
  }

  edit(reservationId: number, data: IEditReservation): Promise<ReservationModel> {
    return this.baseEdit(reservationId, data, {});
  }

  delete(reservationId: number) {
    return this.baseDeleteById(reservationId);
  }
}
