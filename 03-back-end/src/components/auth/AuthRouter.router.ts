import IRouter from "../../common/IRouter.interface";
import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import AuthController from "./AuthController.controller";

export default class AuthRouter implements IRouter {
  public setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const authController = new AuthController(resources.services);

    application.post(
      "/api/auth/manager/login",
      authController.managerLogin.bind(authController)
    );
    application.post(
      "/api/auth/manager/refresh",
      authController.managerRefresh.bind(authController)
    );
    application.post(
      "/api/auth/user/login",
      authController.userLogin.bind(authController)
    );
    application.post(
      "/api/auth/user/refresh",
      authController.userRefresh.bind(authController)
    );
  }
}
