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
import ManagerService from './components/manager/ManagerService.service';
import IAddRestaurant, {
  AddRestaurantValidator,
} from "./components/restaurant/dto/IAddRestaurant.dto";

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
      location: new LocationService(db),
      restaurant: new RestaurantService(db),
      manager: new ManagerService(db),
    },
  };

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

  const locationServ = new LocationService(
    applicationResources.databaseConnection
  );

  application.get("/locations", (req, res) => {
    locationServ.getAll(DefaultLocationAdapterOptions).then((result) => {
      res.send(result);
    });
  });

  application.put("/api/location/:lId", (req, res) => {
    locationServ
      .edit(req.params?.lId, req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error.message);
      });
  });

  application.get("/locations/:lId/restaurants", (req, res) => {
    const restServ = new RestaurantService(
      applicationResources.databaseConnection
    );
    const locationId = +req.params.lId;
    restServ.getAllByLocationId(locationId, {}).then((result) => {
      res.send(result);
    });
  });

  application.post("/locations", async (req, res) => {
    const data: IAddLocation = req.body;
    console.log("reqqq body", req.body);

    if (!AddLocationValidator(data))
      return res.status(400).send(AddLocationValidator.errors);

    locationServ
      .add(data)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error?.message);
      });
  });

  application.post("/location/:lId/restaurant", (req, res) => {
    const restServ = new RestaurantService(
      applicationResources.databaseConnection
    );
    const locationId = +req.params?.lId;
    const data: IAddRestaurant = req.body;

    if (!AddRestaurantValidator(data)) {
      return res.status(404).send(AddRestaurantValidator.errors);
    }

    restServ
      .add({ name: data.name, location_id: locationId })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        console.log("eerr", error);
        res.send(error.message);
      });
  });
}

process.on("uncaughtException", (error) => {
  console.error("ERROR", error);
});

main();
