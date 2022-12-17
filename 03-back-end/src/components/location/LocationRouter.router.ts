import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import LocationController from "./LocationController.controller";
import AuthMiddleware from "../middlewares/AuthMiddleware";

export class LocationRouter implements IRouter {
  setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const locationController = new LocationController(resources.services);

    application.get(
      "/api/location",
      locationController.getAll.bind(locationController)
    );
    application.get(
      "/api/location/:lId",
      locationController.getById.bind(locationController)
    );
    application.put(
      "/api/location/:lId",
      AuthMiddleware.getVerifier("administrator"),
      locationController.editById.bind(locationController)
    );
    application.get(
      "/api/location/:lId/restaurant",
      locationController.getAllRestaurants.bind(locationController)
    );
    application.post(
      "/api/location",
      AuthMiddleware.getVerifier("administrator"),
      locationController.add.bind(locationController)
    );
    application.post(
      "/api/location/:lId/restaurant",
      AuthMiddleware.getVerifier("manager"),
      locationController.addRestaurant.bind(locationController)
    );
  }
}
