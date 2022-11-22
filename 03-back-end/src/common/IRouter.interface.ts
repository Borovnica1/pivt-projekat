import IApplicationResources from "./IApplicationResources.interface";
import * as express from 'express';

export default interface IRouter {
  setUpRoutes(
    application: express.Application,
    resources: IApplicationResources
  );
}
