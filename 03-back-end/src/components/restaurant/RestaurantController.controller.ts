import { Request, Response } from "express";
import RestaurantService from "./RestaurantService.service";

class RestaurantController {
  private RestaurantService: RestaurantService;

  constructor(RestaurantService: RestaurantService) {
    this.RestaurantService = RestaurantService;
  }

  async getAll(req: Request, res: Response) {
    this.RestaurantService.getAll()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getById(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);

    const restaurant = await this.RestaurantService.getById(restaurantId, {});

    if (restaurant === null) return res.status(404).send("nema podaci");

    res.send(restaurant);
  }
}

export default RestaurantController;
