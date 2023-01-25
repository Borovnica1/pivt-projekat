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
      restaurantController.getAll.bind(restaurantController)
    );
    application.get(
      "/api/restaurant/:rId",
      restaurantController.getById.bind(restaurantController)
    );
    application.put(
      "/api/restaurant/:rId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.edit.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.delete.bind(restaurantController)
    );
    application.post(
      "/api/restaurant/:rId/photo",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.uploadPhoto.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId/photo/:pId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.deletePhoto.bind(restaurantController)
    );
    application.get(
      "/api/address/:aId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.getAddressById.bind(restaurantController)
    );
    application.post(
      "/api/restaurant/:rId/address",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.addAddress.bind(restaurantController)
    );
    application.put(
      "/api/restaurant/:rId/address/:aId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.editAddress.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId/address/:aId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.deleteAddress.bind(restaurantController)
    );
    application.post(
      "/api/restaurant/:rId/day-off",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.addDayOff.bind(restaurantController)
    );
    application.put(
      "/api/restaurant/:rId/day-off/:dId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.editDayOff.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId/day-off/:dId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.deleteDayOff.bind(restaurantController)
    );
    application.post(
      "/api/restaurant/:rId/table",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.addTable.bind(restaurantController)
    );
    application.put(
      "/api/restaurant/:rId/table/:tId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.editTable.bind(restaurantController)
    );
    application.delete(
      "/api/restaurant/:rId/table/:tId",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.deleteTable.bind(restaurantController)
    );

    application.get(
      "/api/table/:tId",
      AuthMiddleware.getVerifier("manager", "user"),
      restaurantController.getTableById.bind(restaurantController)
    );

    application.get(
      "/api/day-off/:dId",
      AuthMiddleware.getVerifier("manager", "user"),
      restaurantController.getDayOffById.bind(restaurantController)
    );

    application.get(
      "/api/manager/restaurant",
      AuthMiddleware.getVerifier("manager"),
      restaurantController.getAllRestaurantsOwnedByManagerId.bind(
        restaurantController
      )
    );
  }
}

export default RestaurantRouter;
