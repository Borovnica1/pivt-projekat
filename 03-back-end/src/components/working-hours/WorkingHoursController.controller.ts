import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  AddWorkingHoursValidator,
  IAddWorkingHoursServiceDto,
} from "./dto/IAddWorkingHours.dto";

export default class WorkingHoursController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.workingHours
      .getAll({})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.whId;
    this.services.workingHours
      .getById(id, {})
      .then((result) => {
        if (result === null) {
          res.status(404).send({ message: "working-hours not found!" });
        }
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const body = req.body as IAddWorkingHoursServiceDto;

    if (!AddWorkingHoursValidator(body)) {
      return res.status(400).send(AddWorkingHoursValidator.errors);
    }

    this.services.workingHours
      .add({
        day: body.day,
        opening_hours: body.openingHours,
        closing_hours: body.closingHours,
        restaurant_id: restaurantId,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}
