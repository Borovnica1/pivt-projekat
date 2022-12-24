import BaseService from "../../common/BaseService";
import IAdapterOptionsInterface from "../../common/IAdapterOptions.interface";
import ManagerModel from "./ManagerModel.model";
import IAddManager from "./dto/IAddManager.dto";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IEditManager from "./dto/IEditManager.dto";

export class ManagerAdapterOptions implements IAdapterOptions {
  removePassword: boolean;
}

export const DefaultManagerAdapterOptions: ManagerAdapterOptions = {
  removePassword: false,
};

export default class ManagerService extends BaseService<
  ManagerModel,
  ManagerAdapterOptions
> {
  tableName(): string {
    return "manager";
  }

  protected async adaptToModel(
    data: any,
    options: ManagerAdapterOptions = DefaultManagerAdapterOptions
  ): Promise<ManagerModel> {
    const manager = new ManagerModel();

    manager.managerId = +data?.manager_id;
    manager.username = data.username;
    manager.passwordHash = data?.password_hash;
    manager.createdAt = data?.created_at;
    manager.isActive = +data?.is_active === 1;

    if (options.removePassword) {
      manager.passwordHash = null;
    }
    return manager;
  }

  public async add(data: IAddManager): Promise<ManagerModel> {
    return this.baseAdd(data, DefaultManagerAdapterOptions);
  }

  public async edit(id: number, data: IEditManager): Promise<ManagerModel> {
    return this.baseEdit(id, data, { removePassword: true });
  }

  public async getByUsername(username: string): Promise<ManagerModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("username", [username], undefined)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public async getByEmail(
    email: string,
    option = {}
  ): Promise<ManagerModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("email", [email], undefined)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
