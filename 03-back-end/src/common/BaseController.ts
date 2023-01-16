import { IServices } from "./IApplicationResources.interface";
import * as nodemailer from 'nodemailer';
import { DevConfig } from "../configs";

export default abstract class BaseController {
  private serviceIntances: IServices;

  constructor(services: IServices) {
    this.serviceIntances = services;
  }

  protected get services(): IServices {
    return this.serviceIntances;
  }

  protected getMailTransport() {
    return nodemailer.createTransport(
      {
        host: DevConfig.mail.host,
        port: DevConfig.mail.port,
        secure: false,
        tls: {
          ciphers: "SSLv3",
        },
        debug: DevConfig.mail.debug,
        auth: {
          user: DevConfig.mail.email,
          pass: DevConfig.mail.password,
        },
      },
      {
        from: DevConfig.mail.email,
      }
    );
  }
}