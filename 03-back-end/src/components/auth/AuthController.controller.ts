import BaseController from "../../common/BaseController";
import { IManagerLoginDto } from "./dto/IManagerLogin.dto";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import ITokenData from "./dto/ITokenData";
import * as jwt from "jsonwebtoken";
import { DevConfig } from "../../configs";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { IUserLoginDto } from "./dto/IUserLogin.dto";

export default class AuthController extends BaseController {
  public async managerLogin(req: Request, res: Response) {
    const data = req.body as IManagerLoginDto;

    this.services.manager
      .getByUsername(data.username)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Manager account not found!",
          };
        }
        return result;
      })
      .then((manager) => {
        if (!bcrypt.compareSync(data.password, manager.passwordHash)) {
          throw {
            status: 404,
            message: "Manager account not found!",
          };
        }

        return manager;
      })
      .then((manager) => {
        const tokenData: ITokenData = {
          role: "manager",
          id: manager.managerId,
          identity: manager.username,
        };

        const authToken = jwt.sign(
          tokenData,
          DevConfig.auth.manager.tokens.auth.keys.private,
          {
            algorithm: DevConfig.auth.manager.algorithm,
            issuer: DevConfig.auth.manager.issuer,
            expiresIn: DevConfig.auth.manager.tokens.auth.duration,
          }
        );

        const refreshToken = jwt.sign(
          tokenData,
          DevConfig.auth.manager.tokens.refresh.keys.private,
          {
            algorithm: DevConfig.auth.manager.algorithm,
            issuer: DevConfig.auth.manager.issuer,
            expiresIn: DevConfig.auth.manager.tokens.refresh.duration,
          }
        );

        res.send({
          authToken: authToken,
          refreshToken: refreshToken,
        });
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 1500);
      });
  }

  managerRefresh(req: Request, res: Response) {
    const refreshTokenHeader: string = req.headers?.authorization ?? "";

    try {
      const tokenData = AuthMiddleware.validateTokenAs(
        refreshTokenHeader,
        "manager",
        "refresh"
      );

      const authToken = jwt.sign(
        tokenData,
        DevConfig.auth.manager.tokens.auth.keys.private,
        {
          algorithm: DevConfig.auth.manager.algorithm,
          issuer: DevConfig.auth.manager.issuer,
          expiresIn: DevConfig.auth.manager.tokens.auth.duration,
        }
      );

      res.send({
        authToken: authToken,
      });
    } catch (error) {
      res.status(error?.status ?? 500).send(error?.message);
    }
  }

  public async userLogin(req: Request, res: Response) {
    const data = req.body as IUserLoginDto;

    this.services.user
      .getByEmail(data.email)
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "User account not found!",
          };
        }
        return result;
      })
      .then((user) => {
        if (!bcrypt.compareSync(data.password, user.passwordHash)) {
          throw {
            status: 404,
            message: "Wrong password.",
          };
        }

        return user;
      })
      .then((user) => {
        if (!user.isActive) {
          throw {
            status: 404,
            message: "User account is not active!",
          };
        }

        return user;
      })
      .then((user) => {
        const tokenData: ITokenData = {
          role: "user",
          id: user.userId,
          identity: user.email,
        };

        const authToken = jwt.sign(
          tokenData,
          DevConfig.auth.user.tokens.auth.keys.private,
          {
            algorithm: DevConfig.auth.user.algorithm,
            issuer: DevConfig.auth.user.issuer,
            expiresIn: DevConfig.auth.user.tokens.auth.duration,
          }
        );

        const refreshToken = jwt.sign(
          tokenData,
          DevConfig.auth.user.tokens.refresh.keys.private,
          {
            algorithm: DevConfig.auth.user.algorithm,
            issuer: DevConfig.auth.user.issuer,
            expiresIn: DevConfig.auth.user.tokens.refresh.duration,
          }
        );

        res.send({
          authToken: authToken,
          refreshToken: refreshToken,
          id: user.userId,
          firstName: user.forename,
          lastName: user.surname
        });
      })
      .catch((error) => {
        setTimeout(() => {
          res.status(error?.status ?? 500).send(error?.message);
        }, 1500);
      });
  }

  userRefresh(req: Request, res: Response) {
    const refreshTokenHeader: string = req.headers?.authorization ?? "";

    try {
      const tokenData = AuthMiddleware.validateTokenAs(
        refreshTokenHeader,
        "user",
        "refresh"
      );

      const authToken = jwt.sign(
        tokenData,
        DevConfig.auth.user.tokens.auth.keys.private,
        {
          algorithm: DevConfig.auth.user.algorithm,
          issuer: DevConfig.auth.user.issuer,
          expiresIn: DevConfig.auth.user.tokens.auth.duration,
        }
      );

      res.send({
        authToken: authToken,
      });
    } catch (error) {
      res.status(error?.status ?? 500).send(error?.message);
    }
  }
}
