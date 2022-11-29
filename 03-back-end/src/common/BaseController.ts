import { IServices } from "./IApplicationResources.interface";

export default abstract class BaseController {
  private serviceIntances: IServices;

  constructor(services: IServices) {
    this.serviceIntances = services;
  }

  protected get services(): IServices {
    return this.serviceIntances;
  }
}