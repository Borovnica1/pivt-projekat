import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import IAddRestaurant, {
  AddRestaurantValidator,
  IAddRestaurantServiceDto,
} from "../restaurant/dto/IAddRestaurant.dto";
import { DayInAWeek } from "../working-hours/Working-hoursModel.model";
import { daysInAWeek } from "../working-hours/dto/IAddWorkingHours.dto";
import IAddLocation, { AddLocationValidator } from "./dto/IAddLocation.dto";
import { IEditLocationServiceDto } from "./dto/IEditLocation.dto";
export default class LocationController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.location
      .getAll({ loadRestaurants: true })
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
      .getAllByLocationId(locationId, {
        loadPhotos: true,
        loadWorkingHours: true,
      })
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
    let restaurantData: IAddRestaurantServiceDto = {
      location_id: locationId,
      name: data.name,
    };

    if (!AddRestaurantValidator(data)) {
      return res.status(404).send(AddRestaurantValidator.errors);
    }

    if (data.description) {
      restaurantData.description = data.description;
    }
    console.log("restauran dataa", restaurantData);
    this.services.restaurant.startTransaction().then(() => {
      return this.services.restaurant
        .add(restaurantData)
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

          // and also create default 7 days with working hours in wroking hours table

          await Promise.all(
            daysInAWeek.map((day) => {
              return this.services.workingHours.add({
                day: day as DayInAWeek,
                open: 0,
                closing_hours: "23:30:00",
                restaurant_id: result.restaurantId,
              });
            })
          )
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
          res.status(400).send(error.message);
        });
    });
  }
}
