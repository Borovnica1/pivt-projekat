import RestaurantController from "./RestaurantController.controller";
import RestaurantService from "./RestaurantService.service";
import * as express from "express";

class RestaurantRouter {
  static setUpRoutes(application: express.Application) {
    throw new Error("Method not implemented.");
  }
  public setUpRoutes(application: express.Application) {
    const restaurantService: RestaurantService = new RestaurantService();
    const restaurantController: RestaurantController = new RestaurantController(
      restaurantService
    );
    
    application.get(
      "/restaurant/:rId",
      restaurantController.getById.bind(restaurantController)
    );
  }
}

export default RestaurantRouter;
