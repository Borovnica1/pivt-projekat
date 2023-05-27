import { IMailConfiguration } from "./common/IConfig.interface";

const MailConfigurationParameters: IMailConfiguration = {
  host: "smtp.office365.com",
  port: 587,
  email: "ime.prezime.18@singimail.rs",
  password: "sifra123",
  debug: true,
};

export { MailConfigurationParameters };
