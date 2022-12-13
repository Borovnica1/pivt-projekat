import RestaurantController from "./RestaurantController.controller";
import RestaurantService from "./RestaurantService.service";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../middlewares/AuthMiddleware";

class RestaurantRouter implements IRouter {
  public setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const restaurantController: RestaurantController = new RestaurantController(
      resources.services
    );

    application.get(
      "/api/restaurant",
      AuthMiddleware.getVerifier("manager", "user"),
      restaurantController.getAll.bind(restaurantController)
    );
    application.get(
      "/api/restaurant/:rId",
      restaurantController.getById.bind(restaurantController)
    );
    application.put(
      "/api/restaurant/:rId",
      restaurantController.edit.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId",
      restaurantController.delete.bind(restaurantController)
    );
    application.post(
      "/api/restaurant/:rId/photo",
      restaurantController.uploadPhoto.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId/photo/:pId",
      restaurantController.deletePhoto.bind(restaurantController)
    );
  }
}

export default RestaurantRouter;
