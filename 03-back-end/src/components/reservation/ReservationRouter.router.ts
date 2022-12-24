import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import ReservationController from "./ReservationController.controller";
import AuthMiddleware from "../middlewares/AuthMiddleware";

export default class ReservationRouter implements IRouter {
  setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const reservationController = new ReservationController(resources.services);

    application.get(
      "/api/reservation",
      AuthMiddleware.getVerifier("manager", "user"),
      reservationController.getAllReservationsByManagerOrUserId.bind(
        reservationController
      )
    );

    application.get(
      "/api/reservation/:rId",
      reservationController.getById.bind(reservationController)
    );
    application.post(
      "/api/restaurant/:rId/table/:tId/reservation",
      reservationController.add.bind(reservationController)
    );
    application.put(
      "/api/restaurant/:rId/table/:tId/reservation/:reseId",
      AuthMiddleware.getVerifier("manager", "user"),
      reservationController.edit.bind(reservationController)
    );
    application.delete(
      "/api/restaurant/:rId/table/:tId/reservation/:reseId",
      AuthMiddleware.getVerifier("manager", "user"),
      reservationController.delete.bind(reservationController)
    );
  }
}
