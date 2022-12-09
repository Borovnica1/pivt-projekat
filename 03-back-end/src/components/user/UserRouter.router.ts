import IRouter from "../../common/IRouter.interface";
import UserController from "./UserController.controller";
import IApplicationResources from "../../common/IApplicationResources.interface";
import * as express from "express";

class UserRouter implements IRouter {
  setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  ) {
    const userController = new UserController(resources.services);

    application.get("/api/user", userController.getAll.bind(userController));
    application.get(
      "/api/user/:uId",
      userController.getById.bind(userController)
    );
    application.post(
      "/api/user/register",
      userController.register.bind(userController)
    );
    application.put(
      "/api/user/:uId",
      userController.editById.bind(userController)
    );
    application.get("/api/user/activate/:code", userController.activate.bind(userController));
  }
}

export default UserRouter;
