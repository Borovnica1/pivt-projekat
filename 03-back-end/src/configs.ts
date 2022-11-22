import { IConfig } from "./common/IConfig.interface";
import RestaurantRouter from "./components/restaurant/RestaurantRouter.router";

const DevConfig: IConfig = {
  server: {
    port: 10000,
    static: {
      index: false,
      dotfiles: "deny",
      cacheControl: true,
      etag: true,
      maxAge: 1000 * 60 * 60 * 24,
      route: "./static",
      path: "/assets",
    },
  },
  logging: {
    path: "./logs",
    format:
      ":date[iso]\t:remote-addr\t:method\t:url\t:status\t:res[content-length] bytes\t:response-time ms",
    filename: "access.log",
  },
  database: {
    host: "localhost",
    port: 3306,
    user: "aplikacija",
    password: "aplikacija",
    database: "pivt_app",
    charset: "utf8",
    timezone: "+01:00",
    supportBigNumbers: true,
  },
  routers: [new RestaurantRouter()],
};

export { DevConfig };
