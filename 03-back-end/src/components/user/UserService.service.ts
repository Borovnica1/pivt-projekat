import BaseService from "../../common/BaseService";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import IEditUser from "./dto/IEditUser.dto";
import { IAddUser } from "./dto/IRegisterUser.dto";
import UserModel from "./UserModel.model";

export interface IUserAdapterOptions extends IAdapterOptions {
  removePassword: boolean;
  removeActivationCode: boolean;
}

export const DefaultUserAdapterOptions: IUserAdapterOptions = {
  removePassword: false,
  removeActivationCode: false,
};

export default class UserService extends BaseService<UserModel, IUserAdapterOptions> {
  tableName(): string {
    return "user";
  }

  protected async adaptToModel(
    data: any,
    options: IUserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel> {
    const user = new UserModel();

    user.userId = +data?.user_id;
    user.email = data?.email;
    user.passwordHash = data?.password_hash;
    user.forename = data?.forename;
    user.surname = data?.surname;
    user.isActive = +data?.is_active === 1;
    user.activationCode = data?.activation_code ? data?.activation_code : null;
    user.passwordResetCode = data?.password_reset_code
      ? data?.password_reset_code
      : null;

    if (options.removePassword) {
      user.passwordHash = null;
    }

    if (options.removeActivationCode) {
      user.activationCode = null;
    }

    return user;
  }

  public async add(data: IAddUser): Promise<UserModel> {
    return this.baseAdd(data, {
      removeActivationCode: false,
      removePassword: true,
    });
  }

  public async edit(
    id: number,
    data: IEditUser,
    options: IUserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel> {
    return this.baseEdit(id, data, options);
  }

  public async getUserByActivationCode(
    code: string,
    options: IUserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("activation_code", [code], options)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getUserByPasswordResetCode(
    code: string,
    option: IUserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("password_reset_code", [code], option)
        .then((result) => {
          if (result.length === 0) {
            return resolve(null);
          }

          resolve(result[0]);
        })
        .catch((error) => {
          reject(error?.message);
        });
    });
  }

  public async getByEmail(
    email: string,
    option: IUserAdapterOptions = DefaultUserAdapterOptions
  ): Promise<UserModel | null> {
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
