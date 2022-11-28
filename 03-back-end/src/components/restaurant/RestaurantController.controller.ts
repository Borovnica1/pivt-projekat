import { Request, Response } from "express";
import {
  EditRestaurantValidator,
  IEditRestaurantServiceDto,
} from "./dto/IEditRestaurant.dto";
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

  async edit(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const data = req.body as IEditRestaurantServiceDto;

    if (!EditRestaurantValidator(data)) {
      return res.status(400).send(EditRestaurantValidator.errors);
    }

    this.RestaurantService.getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }
      })
      .then(() => {
        return this.RestaurantService.editById(
          restaurantId,
          {
            name: data.name,
          },
          {}
        );
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }
}

export default RestaurantController;
