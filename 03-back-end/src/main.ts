import * as express from "express";
import * as cors from "cors";
import { DevConfig } from "./config/configs";
import { IConfig } from "./config/IConfig.interface";
import RestaurantController from "./components/restaurant/RestaurantController.controller";
import RestaurantService from "./components/restaurant/RestaurantService.service";
import * as fs from "fs";
import morgan = require("morgan");

const config: IConfig = DevConfig;

fs.mkdirSync("./logs", {
  mode: 0o755,
  recursive: true,
});

const application: express.Application = express();

application.use(
  morgan(
    ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms",
    {
      stream: fs.createWriteStream("./logs/access.log"),
    }
  )
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

const restaurantService: RestaurantService = new RestaurantService();
const restaurantController: RestaurantController = new RestaurantController(
  restaurantService
);

application.get(
  "/restaurant/:rId",
  restaurantController.getById.bind(restaurantController)
);

application.listen(config.server.port);
