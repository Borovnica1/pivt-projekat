import IModel from "./IModel.interface";
import IAdapterOptions from "./IAdapterOptions.interface";
import * as mysql2 from "mysql2/promise";
import IServiceData from "./IServiceData.interface";

export default abstract class BaseService<
  ReturnModel extends IModel,
  AdapterOptions extends IAdapterOptions
> {
  private database: mysql2.Connection;

  constructor(databaseConnection: mysql2.Connection) {
    this.database = databaseConnection;
  }

  protected get db(): mysql2.Connection {
    return this.database;
  }

  abstract tableName(): string;
  protected abstract adaptToModel(
    data: any,
    options: IAdapterOptions
  ): Promise<ReturnModel>;

  public async getAll(options: AdapterOptions): Promise<ReturnModel[]> {
    const tableName = this.tableName();

    return new Promise<ReturnModel[]>((resolve, reject) => {
      const sql = `SELECT * FROM \`${tableName}\`;`;

      this.db
        .execute(sql)
        .then(async ([rows]) => {
          const items: ReturnModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            items.push(await this.adaptToModel(row, options));
          }

          resolve(items);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public getById(
    id: number,
    options: AdapterOptions
  ): Promise<ReturnModel | null> {
    const tableName = this.tableName();

    return new Promise<ReturnModel>((resolve, reject) => {
      const sql: string = `SELECT * FROM \`${tableName}\` WHERE ${tableName}_id = ?;`;

      this.db
        .execute(sql, [id])
        .then(async ([rows]) => {
          if (rows === undefined) {
            return resolve(null);
          }

          if (Array.isArray(rows) && rows.length === 0) {
            return resolve(null);
          }

          resolve(await this.adaptToModel(rows[0], options));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getAllByFieldNameAndValue(
    fieldName: string,
    value: number,
    options: IAdapterOptions
  ): Promise<ReturnModel[]> {
    const tableName = this.tableName();

    return new Promise((resolve, reject) => {
      const sql: string = `SELECT * FROM \`${tableName}\` WHERE  \`${fieldName}\` = ?;`;

      this.database
        .execute(sql, [value])
        .then(async ([rows]) => {
          const restaurants: ReturnModel[] = [];

          for (const row of rows as mysql2.RowDataPacket[]) {
            restaurants.push(await this.adaptToModel(row, options));
          }

          resolve(restaurants);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async baseAdd(
    data: IServiceData,
    options: AdapterOptions
  ): Promise<ReturnModel> {
    const tableName = this.tableName();

    return new Promise<ReturnModel>((resolve, reject) => {
      const dataProperties = Object.getOwnPropertyNames(data);
      const sqlPairs: string = dataProperties
        .map((property) => "`" + property + "` = ?")
        .join(", ");
      const sqlValues = dataProperties.map((property) => data[property]);
      const sql: string = `INSERT ${tableName} SET ${sqlPairs}`;

      this.db
        .execute(sql, sqlValues)
        .then(async (result) => {
          const info: any = result;

          const newItemtId = +info[0]?.insertId;

          const newItem: ReturnModel | null = await this.getById(
            newItemtId,
            options
          );

          if (newItem === null)
            return reject({
              message: "Could not add new " + newItem + " into " + tableName,
            });

          resolve(newItem);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async baseEdit(
    id: number,
    data: IServiceData,
    options: AdapterOptions
  ): Promise<ReturnModel> {
    const tableName = this.tableName();

    return new Promise<ReturnModel>((resolve, reject) => {
      const dataProperties = Object.getOwnPropertyNames(data);

      if (dataProperties.length === 0) reject({message: 'There are no properties to edit!'})

      const sqlPairs: string = dataProperties
        .map((property) => "`" + property + "` = ?")
        .join(", ");
      const sqlValues = dataProperties.map((property) => data[property]);
      sqlValues.push(id);
      const sql: string = `UPDATE ${tableName} SET ${sqlPairs} WHERE ${tableName}_id = ?;`;

      this.db
        .execute(sql, sqlValues)
        .then(async (result) => {
          const info: any = result;

          if (info[0]?.affectedRows === 0) {
            return reject({
              message:
                "Could not change any items in the " + tableName + " table!",
            });
          }

          const item: ReturnModel | null = await this.getById(id, options);

          if (item === null)
            return reject({
              message:
                "Could not find this item in the " + tableName + " table!",
            });

          resolve(item);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected async baseDeleteById(id: number): Promise<true> {
    const tableName = this.tableName();

    return new Promise((resolve, reject) => {
      const sql: string =
        "DELETE FROM " + tableName + " WHERE " + tableName + "_id = ?;";

      this.db
        .execute(sql, [id])
        .then(async (result) => {
          const info: any = result;

          if (info[0]?.affectedRows === 0) {
            return reject({
              message:
                "Could not delete this items from the " + tableName + " table!",
            });
          }

          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
