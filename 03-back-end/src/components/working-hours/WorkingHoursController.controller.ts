import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import {
  AddWorkingHoursValidator,
  IAddWorkingHoursServiceDto,
} from "./dto/IAddWorkingHours.dto";
import {
  IEditWorkingHoursServiceDto,
  EditWorkingHoursValidator,
} from "./dto/IEditWorkingHours.dto";
import IEditWorkingHours from "./dto/IEditWorkingHours.dto";

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
      .baseGetById(id, {})
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
        open: body.open,
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

  edit(req: Request, res: Response) {
    const workingHoursId: number = +req.params?.whId;
    const body = req.body as IEditWorkingHoursServiceDto;

    if (!EditWorkingHoursValidator(body)) {
      return res.status(400).send(EditWorkingHoursValidator.errors);
    }

    const data: IEditWorkingHours = {};

    if (body.open) {
      data.open = body.open;
    }

    if (body.openingHours) {
      data.opening_hours = body.openingHours;
    }

    if (body.closingHours) {
      data.closing_hours = body.closingHours;
    }


    this.services.workingHours
      .editById(workingHoursId, data, {})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}
