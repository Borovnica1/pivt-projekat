import BaseService from "../../common/BaseService";
import ReservationModel from "./ReservationModel.model";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IAddReservation } from "./dto/IAddReservation.dto";
import { IEditReservation } from "./dto/IEditReservation.dto";
import * as mysql2 from "mysql2/promise";

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
      reservation.reservationDuration = +data.reservation_duration;
      reservation.status = data.status;
      reservation.tableId = data.table_id;
      reservation.userId = data.user_id;

      resolve(reservation);
    });
  }

  add(data: IAddReservation): Promise<ReservationModel> {
    return this.baseAdd(data, {});
  }

  edit(
    reservationId: number,
    data: IEditReservation
  ): Promise<ReservationModel> {
    return this.baseEdit(reservationId, data, {});
  }

  delete(reservationId: number) {
    return this.baseDeleteById(reservationId);
  }

  getAllByTableIdAndDate(tableId, date, options): Promise<ReservationModel[]> {
    return new Promise((resolve, reject) => {

      const sql = `SELECT * FROM reservation WHERE reservation_date REGEXP(?) AND table_id = ?;`;
      this.db
        .execute(sql, [date, tableId])
        .then(async ([rows]) => {
          const items: ReservationModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(await this.adaptToModel(row, options));
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
