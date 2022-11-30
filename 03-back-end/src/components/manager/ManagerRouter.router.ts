import { Application } from "express";
import IApplicationResourcesInterface from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
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
      "/api/manager",
      managerController.getAll.bind(managerController)
    );
    application.get(
      "/api/manager/:mId",
      managerController.getById.bind(managerController)
    );
    application.post(
      "/api/manager",
      managerController.add.bind(managerController)
    );
    application.put(
      "/api/manager/:mId",
      managerController.edit.bind(managerController)
    );
  }
}
