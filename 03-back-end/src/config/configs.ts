import { IConfig } from "../common/IConfig.interface";

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
};

export { DevConfig };
