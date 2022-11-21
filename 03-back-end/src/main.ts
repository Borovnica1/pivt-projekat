import * as express from "express";
import * as cors from "cors";
import { DevConfig } from "./config/configs";
import { IConfig } from "./common/IConfig.interface";
import * as fs from "fs";
import RestaurantRouter from "./components/restaurant/RestaurantRouter.router";
import morgan = require("morgan");

const config: IConfig = DevConfig;

fs.mkdirSync("./logs", {
  mode: 0o755,
  recursive: true,
});

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

RestaurantRouter.setUpRoutes(application);

application.listen(config.server.port);
