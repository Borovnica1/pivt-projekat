interface IConfig {
  server: {
    port: number;
    static: {
      index: string | false;
      dotfiles: "allow" | "deny";
      cacheControl: boolean;
      etag: boolean;
      maxAge: number;
      route: string;
      path: string;
    };
  };
  logging: {
    path: string;
    format: string;
    filename: string;
  };
}

export { IConfig };
