import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  EditRestaurantValidator,
  IEditRestaurantServiceDto,
} from "./dto/IEditRestaurant.dto";

class RestaurantController extends BaseController {
  async getAll(req: Request, res: Response) {
    this.services.restaurant
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

    const restaurant = await this.services.restaurant.getById(restaurantId, {});

    if (restaurant === null) return res.status(404).send("nema podaci");

    res.send(restaurant);
  }

  async edit(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const data = req.body as IEditRestaurantServiceDto;

    if (!EditRestaurantValidator(data)) {
      return res.status(400).send(EditRestaurantValidator.errors);
    }

    this.services.restaurant
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
        return this.services.restaurant.editById(
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

    this.services.restaurant
      .getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }

        this.services.restaurant
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
