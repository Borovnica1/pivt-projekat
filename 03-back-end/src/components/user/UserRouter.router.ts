import IRouter from "../../common/IRouter.interface";
import UserController from "./UserController.controller";
import IApplicationResources from "../../common/IApplicationResources.interface";
import * as express from "express";
import AuthMiddleware from "../middlewares/AuthMiddleware";

class UserRouter implements IRouter {
  setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const userController = new UserController(resources.services);
    application.get(
      "/api/user",
      AuthMiddleware.getVerifier("administrator"),
      userController.getAll.bind(userController)
    );
    application.get(
      "/api/user/:uId",
      AuthMiddleware.getVerifier("administrator", "user"),
      userController.getById.bind(userController)
    );
    application.post(
      "/api/user/register",
      userController.register.bind(userController)
    );
    application.put(
      "/api/user/:uId",
      AuthMiddleware.getVerifier("administrator", "user"),
      userController.editById.bind(userController)
    );
    application.get(
      "/api/user/activate/:code",
      userController.activate.bind(userController)
    );
    application.post(
      "/api/user/resetPassword",
      userController.passwordResetEmailSend.bind(userController)
    );
    application.get(
      "/api/user/reset/:code",
      userController.passwordReset.bind(userController)
    );
  }
}

export default UserRouter;
