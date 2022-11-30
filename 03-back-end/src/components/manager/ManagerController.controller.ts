import { Request, Response } from "express";
import BaseController from "../../common/BaseController";
import * as bcrypt from "bcrypt";
import { AddManagerValidator, IAddManagerDto } from "./dto/IAddManager.dto";
import { EditManagerValidator, IEditManagerDto } from "./dto/IEditManager.dto";
import IEditManager from "./dto/IEditManager.dto";

export default class ManagerController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.manager
      .getAll({ removePassword: true })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id: number = +req.params?.mId;
    this.services.manager
      .getById(id, { removePassword: true })
      .then((result) => {
        if (result === null) {
          res.status(404).send({ message: "manager not found!" });
        }
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  add(req: Request, res: Response) {
    const body = req.body as IAddManagerDto;

    if (!AddManagerValidator(body)) {
      return res.status(400).send(AddManagerValidator.errors);
    }

    const passwordHash = bcrypt.hashSync(body.username, 10);

    this.services.manager
      .add({ username: body.username, password_hash: passwordHash })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  edit(req: Request, res: Response) {
    const id: number = +req.params?.mId;
    const data = req.body as IEditManagerDto;

    if (!EditManagerValidator(data)) {
      return res.status(400).send(EditManagerValidator.errors);
    }

    const serviceData: IEditManager = {};

    if (data.password !== undefined) {
      const passwordHash = bcrypt.hashSync(data.password, 10);
      serviceData.password_hash = passwordHash;
    }

    if (data.isActive !== undefined) {
      serviceData.is_active = data.isActive ? 1 : 0;
    }

    this.services.manager
      .edit(id, serviceData)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}
