import { Request, Response } from "express";
import {
  EditRestaurantValidator,
  IEditRestaurantServiceDto,
} from "./dto/IEditRestaurant.dto";
import RestaurantService from "./RestaurantService.service";

class RestaurantController {
  private restaurantService: RestaurantService;

  constructor(restaurantService: RestaurantService) {
    this.restaurantService = restaurantService;
  }

  async getAll(req: Request, res: Response) {
    this.restaurantService
      .getAll()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getById(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);

    const restaurant = await this.restaurantService.getById(restaurantId, {});

    if (restaurant === null) return res.status(404).send("nema podaci");

    res.send(restaurant);
  }

  async edit(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const data = req.body as IEditRestaurantServiceDto;

    if (!EditRestaurantValidator(data)) {
      return res.status(400).send(EditRestaurantValidator.errors);
    }

    this.restaurantService
      .getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }
      })
      .then(() => {
        return this.restaurantService.editById(
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

  async delete(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;

    this.restaurantService
      .getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }

        this.restaurantService
          .deleteById(restaurantId)
          .then((result) => {
            res.send("This restaurant has been deleted!");
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not deelte this restaurant due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}

export default RestaurantController;
