import * as express from "express";
import * as cors from "cors";
import { DevConfig } from "./configs";
import { IConfig } from "./common/IConfig.interface";
import * as fs from "fs";
import RestaurantRouter from "./components/restaurant/RestaurantRouter.router";
import IApplicationResources from "./common/IApplicationResources.interface";
import * as mysql2 from "mysql2/promise";
import morgan = require("morgan");
import LocationService from "./components/location/LocationService.service";

async function main() {
  const config: IConfig = DevConfig;

  fs.mkdirSync("./logs", {
    mode: 0o755,
    recursive: true,
  });

  const applicationResources: IApplicationResources = {
    databaseConnection: await mysql2.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      database: config.database.database,
      password: config.database.password,
      charset: config.database.charset,
      timezone: config.database.timezone,
      supportBigNumbers: config.database.supportBigNumbers,
    }),
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
    locationServ.getAll().then((result) => {
      res.send(result);
    });
  });
}

process.on("uncaughtException", (error) => {
  console.error("ERROR", error);
});

main();
