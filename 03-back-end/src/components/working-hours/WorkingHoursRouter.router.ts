import { Application } from "express";
import IApplicationResourcesInterface from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import WorkingHoursController from "./WorkingHoursController.controller";

export default class WorkingHoursRouter implements IRouter {
  setUpRoutes(
    application: Application,
    resources: IApplicationResourcesInterface
  ) {
    const workingHoursController = new WorkingHoursController(
      resources.services
    );

    application.get(
      "/api/working-hours",
      workingHoursController.getAll.bind(workingHoursController)
    );

    application.get(
      "/api/working-hours/:whId",
      workingHoursController.getById.bind(workingHoursController)
    );

    application.post(
      "/api/restaurant/:rId/working-hours",
      workingHoursController.add.bind(workingHoursController)
    );

     application.put(
       "/api/restaurant/:rId/working-hours/:whId",
       workingHoursController.edit.bind(workingHoursController)
     );
  }
}
