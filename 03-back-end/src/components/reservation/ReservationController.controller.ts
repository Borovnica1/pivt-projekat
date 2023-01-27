import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import {
  AddReservationValidator,
  IAddReservationDto,
} from "./dto/IAddReservation.dto";
import {
  EditReservationValidator,
  IEditReservation,
  IEditReservationDto,
} from "./dto/IEditReservation.dto";
import { RestaurantManagerModel } from "../restaurant/RestaurantModel.model";
import ReservationModel from "./ReservationModel.model";
import * as Mailer from "nodemailer/lib/mailer";
import { DevConfig } from "../../configs";

export default class ReservationController extends BaseController {
  async getAllReservationsByManagerOrUserId(req: Request, res: Response) {
    const managerUserId = +req.authorisation.id;

    try {
      if (req.authorisation.role === "manager") {
        const restaurantsOwnedByManager =
          await this.services.restaurant.getRestaurantsByManagerId(
            managerUserId
          );
        const resturantIds = restaurantsOwnedByManager.map(
          (restaurant) => restaurant.restaurantId
        );

        const tablesOfAllManagersRestaurants =
          await this.services.table.getAllByFieldNameAndValue(
            "restaurant_id",
            resturantIds,
            {}
          );
        const tableIds = tablesOfAllManagersRestaurants.map(
          (table) => table.tableId
        );

        const allReservationsOfManagersTables =
          await this.services.reservation.getAllReservationsTableAndRestaurantName(
            "table_id",
            tableIds,
            {}
          );

        res.send(allReservationsOfManagersTables);
      } else {
        const reservations =
          await this.services.reservation.getAllByFieldNameAndValue(
            "user_id",
            [managerUserId],
            {}
          );

        res.send(reservations);
      }
    } catch (error) {
      res.send(error);
    }
  }

  getById(req: Request, res: Response) {
    const reservationId = +req.params?.rId;

    this.services.reservation
      .baseGetById(reservationId, {})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  getAllByTableIdAndDate(req: Request, res: Response) {
    const tableId = +req.params?.tId;
    const date = req.params?.date;

    this.services.reservation
      .getAllByTableIdAndDate(tableId, date, {})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  add(req: Request, res: Response) {
    const data: IAddReservationDto = req.body;
    const tableId = +req.params.tId;

    if (!AddReservationValidator(data))
      return res.status(400).send(AddReservationValidator.errors);

    this.services.reservation
      .add({
        table_id: tableId,
        email: data.email,
        ...(data.phoneNumber && {phone_number: data.phoneNumber}),
        first_name: data.firstName,
        last_name: data.lastName,
        reservation_date: data.reservationDate,
        reservation_duration: data.reservationDuration,
        status: "pending",
      })
      .then((result) => {
        this.sendReservationCreatedEmail(result);
        this.sendReservationConfirmationEmailForManager(result);
        return result;
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
      });
  }

  private async sendReservationCreatedEmail(
    reservation: ReservationModel
  ): Promise<ReservationModel> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: reservation.email,
        subject: "Reservation was created!",
        html: `<!doctype html>
               <html>
                  <head><meta charset="utf-8"></head>
                  <body>
                    <p> Dear ${reservation.firstName} ${reservation.lastName}, <br>
                    Your reservation was successfully created and now is pending confirmation from manager!
                    </p>
                  </body>
               </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          resolve(reservation);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  private async sendReservationConfirmationEmail(
    reservation: ReservationModel
  ): Promise<ReservationModel> {
    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: reservation.email,
        subject: "Reservation confirmed!",
        html: `<!doctype html>
               <html>
                  <head><meta charset="utf-8"></head>
                  <body>
                    <p> Dear ${reservation.firstName} ${reservation.lastName}, <br>
                    Your reservation is confirmed!.
                    </p>
                    <p>
                    Your reservation date: ${reservation.reservationDate}
                    </p>
                                        <p>
                    Your reservation duration: ${reservation.reservationDuration} min
                    </p>
                  </body>
               </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          resolve(reservation);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  private async sendReservationConfirmationEmailForManager(
    reservation: ReservationModel
  ): Promise<ReservationModel> {
    const manager = await this.services.table
      .baseGetById(reservation.tableId, {})
      .then(async (table) => {
        return await this.services.restaurant.getRestaurantManagerByRestaurantId(
          table.restaurantId
        );
      })
      .then(async (restaurantManager) => {
        return await this.services.manager.baseGetById(
          restaurantManager.managerId,
          { removePassword: true }
        );
      });

    return new Promise((resolve, reject) => {
      const transport = this.getMailTransport();

      const mailOptions: Mailer.Options = {
        to: manager.email,
        subject: "Reservation made!",
        html: `<!doctype html>
               <html>
                  <head><meta charset="utf-8"></head>
                  <body>
                    <p> Dear ${manager.username},
                    <br>
                                                  <a href="${DevConfig.frontend.route}/manager/dashboard/reservations/pending"
                                sryle="display: inline-block; padding: 10px 20px; color:#fff; background-color: #db0002; text-decoration: none;">
                                  Click here to check reservation!
                            </a>
                    </p>
                  </body>
               </html>`,
      };

      transport
        .sendMail(mailOptions)
        .then(() => {
          transport.close();

          resolve(reservation);
        })
        .catch((error) => {
          transport.close();

          reject({
            message: error?.message,
          });
        });
    });
  }

  async edit(req: Request, res: Response) {
    const data: IEditReservationDto = req.body;
    const restaurantId = +req.params.rId;
    const reservationId = +req.params.reseId;
    const managerUserId = +req.authorisation.id;
    const newReservation: IEditReservation = {};

    let reservationBelongsToThisAccount: boolean;

    if (req.authorisation.role === "manager") {
      const restaurantManager =
        await this.services.restaurant.getRestaurantManagerByRestaurantId(
          restaurantId
        );
      if (managerUserId === restaurantManager.managerId) {
        reservationBelongsToThisAccount = true;
      }
    } else {
      const reservation = await this.services.reservation.baseGetById(
        reservationId,
        {}
      );
      if (managerUserId === reservation.userId) {
        reservationBelongsToThisAccount = true;
      }
    }

    if (!EditReservationValidator(data)) {
      return res.status(400).send(EditReservationValidator.errors);
    }

    if (data.status) {
      newReservation.status = data.status;
    }

    if (data.phoneNumber) {
      newReservation.phone_number = data.phoneNumber;
    }

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then(async (restaurant) => {
        // check if reservation is of managers restaurant or users reservation
        if (!reservationBelongsToThisAccount) {
          throw {
            status: 403,
            message: "You dont have right to edit this reservation!",
          };
        }
        return restaurant;
      })
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }

        this.services.reservation
          .edit(reservationId, newReservation)
          .then((result) => {
            if (result.status === "confirmed") {
              this.sendReservationConfirmationEmail(result);
            }
            res.send(result);
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not edit this reservation due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async delete(req: Request, res: Response) {
    const restaurantId = +req.params.rId;
    const reservationId = +req.params.reseId;
    const managerUserId = +req.authorisation.id;

    let reservationBelongsToThisAccount: boolean;

    if (req.authorisation.role === "manager") {
      const restaurantManager =
        await this.services.restaurant.getRestaurantManagerByRestaurantId(
          restaurantId
        );
      if (managerUserId === restaurantManager.managerId) {
        reservationBelongsToThisAccount = true;
      }
    } else {
      const reservation = await this.services.reservation.baseGetById(
        reservationId,
        {}
      );
      if (managerUserId === reservation.userId) {
        reservationBelongsToThisAccount = true;
      }
    }
    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then(async (restaurant) => {
        // check if reservation is of managers restaurant or users reservation
        if (!reservationBelongsToThisAccount) {
          throw {
            status: 403,
            message: "You dont have right to delete this reservation!",
          };
        }
        return restaurant;
      })
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }

        this.services.reservation
          .delete(reservationId)
          .then((result) => {
            res.send("This reservation has been deleted!");
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not delete this reservation due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}
