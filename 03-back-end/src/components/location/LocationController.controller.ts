import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import IAddRestaurant, {
  AddRestaurantValidator,
} from "../restaurant/dto/IAddRestaurant.dto";
import IAddLocation, { AddLocationValidator } from "./dto/IAddLocation.dto";
import { IEditLocationServiceDto } from "./dto/IEditLocation.dto";
export default class LocationController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.location
      .getAll(undefined)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  getById(req, res) {
    this.services.location
      .getById(req.params?.lId)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error.message);
      });
  }

  editById(req, res) {
    const data = req.body as IEditLocationServiceDto;
    this.services.location
      .edit(req.params?.lId, { location_name: data.locationName })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error.message);
      });
  }

  getAllRestaurants(req, res) {
    const locationId = +req.params.lId;
    this.services.restaurant
      .getAllByLocationId(locationId, { loadPhotos: true })
      .then((result) => {
        res.send(result);
      });
  }

  add(req, res) {
    const data: IAddLocation = req.body;

    if (!AddLocationValidator(data))
      return res.status(400).send(AddLocationValidator.errors);

    this.services.location
      .add(data)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
      });
  }

  addRestaurant(req: Request, res: Response) {
    const locationId = +req.params?.lId;
    const data: IAddRestaurant = req.body;
    const managerId = req.authorisation.id;

    if (!AddRestaurantValidator(data)) {
      return res.status(404).send(AddRestaurantValidator.errors);
    }

    this.services.restaurant.startTransaction().then(() => {
      return this.services.restaurant
        .add({ name: data.name, location_id: locationId })
        .then(async (result) => {
          // after adding restaurant connect restaurant_id and manager_id in restaurant_manager table

          await this.services.restaurant
            .addRestaurantManager(result.restaurantId, managerId)
            .then((result) => {
              return result;
            })
            .catch((error) => {
              throw error;
            });
          this.services.restaurant.commitChanges();
          res.send(result);
        })
        .catch((error) => {
          this.services.restaurant.rollbackChanges();
          res.send(error.message);
        });
    });
  }
}
