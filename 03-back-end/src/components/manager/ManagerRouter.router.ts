import { Application } from "express";
import IApplicationResourcesInterface from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import ManagerController from "./ManagerController.controller";

export default class ManagerRouter implements IRouter {
  setUpRoutes(
    application: Application,
    resources: IApplicationResourcesInterface
  ) {
    const managerController: ManagerController = new ManagerController(
      resources.services
    );
    application.get(
      "/api/manager", AuthMiddleware.getVerifier('manager'),
      managerController.getAll.bind(managerController)
    );
    application.get(
      "/api/manager/:mId", AuthMiddleware.getVerifier('manager'),
      managerController.getById.bind(managerController)
    );
    application.post(
      "/api/manager",
      managerController.add.bind(managerController)
    );
    application.put(
      "/api/manager/:mId",
      AuthMiddleware.getVerifier("manager"),
      managerController.edit.bind(managerController)
    );
  }
}
