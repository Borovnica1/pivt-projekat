import BaseController from "../../common/BaseController";
import { Request, Response } from "express";
import {
  IRegisterUserDto,
  RegisterUserValidator,
} from "./dto/IRegisterUser.dto";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import IEditUser, {
  EditUserValidator,
  IEditUserDto,
} from "./dto/IEditUser.dto";
import UserModel from "./UserModel.model";

class UserController extends BaseController {
  getAll(req: Request, res: Response) {
    this.services.user
      .getAll({
        removePassword: true,
        removeActivationCode: true,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  getById(req: Request, res: Response) {
    const id = +req.params?.uId;
    this.services.user
      .baseGetById(id, {
        removePassword: true,
        removeActivationCode: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }

        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  register(req: Request, res: Response) {
    const body = req.body as IRegisterUserDto;

    if (!RegisterUserValidator(body)) {
      return res.status(400).send(RegisterUserValidator.errors);
    }

    const passwordHash = bcrypt.hashSync(body.password, 10);

    this.services.user
      .add({
        email: body.email,
        password_hash: passwordHash,
        forename: body.forename,
        surname: body.surname,
        activation_code: uuid.v4(),
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  editById(req: Request, res: Response) {
    const id: number = +req.params?.uId;
    const data = req.body as IEditUserDto;

    if (!EditUserValidator(data)) {
      return res.status(400).send(EditUserValidator.errors);
    }

    const serviceData: IEditUser = {};

    if (data.password !== undefined) {
      const passwordHash = bcrypt.hashSync(data.password, 10);
      serviceData.password_hash = passwordHash;
    }

    if (data.isActive !== undefined) {
      serviceData.is_active = data.isActive ? 1 : 0;
    }

    if (data.forename !== undefined) {
      serviceData.forename = data.forename;
    }

    if (data.surname !== undefined) {
      serviceData.surname = data.surname;
    }

    this.services.user
      .edit(id, serviceData)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  activate(req: Request, res: Response) {
    const code = req.params?.code;
    console.log("code:;", code);
    this.services.user
      .getUserByActivationCode(code, {
        removeActivationCode: true,
        removePassword: true,
      })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User not found!",
          };
        }
        return result;
      })
      .then((result) => {
        const user = result as UserModel;

        return this.services.user.edit(user.userId, {
          is_active: 1,
          activation_code: null,
        });
      })
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 500);
      });
  }
}

export default UserController;
