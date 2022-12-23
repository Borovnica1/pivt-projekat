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

export default class ReservationController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.reservation
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
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

  add(req: Request, res: Response) {
    const data: IAddReservationDto = req.body;
    const tableId = +req.params.tId;

    if (!AddReservationValidator(data))
      return res.status(400).send(AddReservationValidator.errors);

    this.services.reservation
      .add({
        table_id: tableId,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        reservation_date: data.reservationDate,
        reservation_duration: data.reservationDuration,
        status: data.status,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
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
