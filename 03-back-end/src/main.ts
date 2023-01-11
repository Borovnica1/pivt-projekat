import * as express from "express";
import * as cors from "cors";
import { DevConfig } from "./configs";
import { IConfig } from "./common/IConfig.interface";
import * as fs from "fs";
import RestaurantRouter from "./components/restaurant/RestaurantRouter.router";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import morgan = require("morgan");
import LocationService, {
  DefaultLocationAdapterOptions,
} from "./components/location/LocationService.service";
import { AddLocationValidator } from "./components/location/dto/IAddLocation.dto";
import IAddLocation from "./components/location/dto/IAddLocation.dto";
import RestaurantService from "./components/restaurant/RestaurantService.service";
import ManagerService from "./components/manager/ManagerService.service";
import WorkingHoursService from "./components/working-hours/Working-hoursService.service";
import IAddRestaurant, {
  AddRestaurantValidator,
} from "./components/restaurant/dto/IAddRestaurant.dto";
import PhotoService from "./components/photo/PhotoService.service";
import UserService from "./components/user/UserService.service";
import AddressService from "./components/restaurant/AddressService.service";
import fileUpload = require("express-fileupload");
import DayOffService from "./components/restaurant/DayOffService.service copy";
import TableService from './components/restaurant/TableService.service';
import ReservationService from './components/reservation/ReservationService.service';
import AdministratorService from "./components/administrator/AdministratorService.service";

async function main() {
  const config: IConfig = DevConfig;

  fs.mkdirSync("./logs", {
    mode: 0o755,
    recursive: true,
  });

  const db = await mysql2.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    database: config.database.database,
    password: config.database.password,
    charset: config.database.charset,
    timezone: config.database.timezone,
    supportBigNumbers: config.database.supportBigNumbers,
  });

  const applicationResources: IApplicationResources = {
    databaseConnection: db,
    services: {
      location: null,
      restaurant: null,
      manager: null,
      workingHours: null,
      photo: null,
      user: null,
      address: null,
      dayOff: null,
      table: null,
      reservation: null,
      administrator: null,
    },
  };

  applicationResources.services.location = new LocationService(
    db,
    applicationResources.services
  );
  applicationResources.services.restaurant = new RestaurantService(
    db,
    applicationResources.services
  );
  applicationResources.services.manager = new ManagerService(
    db,
    applicationResources.services
  );
  applicationResources.services.workingHours = new WorkingHoursService(
    db,
    applicationResources.services
  );
  applicationResources.services.photo = new PhotoService(
    db,
    applicationResources.services
  );
  applicationResources.services.user = new UserService(
    db,
    applicationResources.services
  );
  applicationResources.services.address = new AddressService(
    db,
    applicationResources.services
  );
  applicationResources.services.dayOff = new DayOffService(
    db,
    applicationResources.services
  );
  applicationResources.services.table = new TableService(
    db,
    applicationResources.services
  );
  applicationResources.services.reservation = new ReservationService(
    db,
    applicationResources.services
  );
    applicationResources.services.administrator = new AdministratorService(
      db,
      applicationResources.services
    );

  const application: express.Application = express();

  application.use(
    morgan(config.logging.format, {
      stream: fs.createWriteStream(
        config.logging.path + "/" + config.logging.filename,
        { flags: "a" }
      ),
    })
  );

  application.use(cors());
  application.use(express.urlencoded({ extended: true }));
  application.use(
    fileUpload({
      limits: {
        files: config.fileUploads.maxFiles,
        fileSize: config.fileUploads.maxFileSize,
      },
      abortOnLimit: true,

      useTempFiles: true,
      tempFileDir: config.fileUploads.temporaryFileDirecotry,
      createParentPath: true,
      safeFileNames: true,
      preserveExtension: true,
    })
  );
  application.use(express.json());

  application.use(
    config.server.static.route,
    express.static(config.server.static.path, {
      index: config.server.static.index,
      dotfiles: config.server.static.dotfiles,
      cacheControl: config.server.static.cacheControl,
      etag: config.server.static.etag,
      maxAge: config.server.static.maxAge,
    })
  );

  for (const router of config.routers) {
    router.setUpRoutes(application, applicationResources);
  }

  application.listen(config.server.port);
}

process.on("uncaughtException", (error) => {
  console.error("ERROR", error);
});

main();
