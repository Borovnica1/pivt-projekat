import * as mysql2 from "mysql2";

export default interface IApplicationResources {
  databaseConnection: mysql2.Connection;
}
