import BaseService from "../../common/BaseService";

class AdministratorModel {
  administratorId: number;
  username: string;
  passwordHash: string;
}

export default class AdministratorService extends BaseService<
  AdministratorModel,
  {}
> {
  tableName() {
    return "administrator";
  }

  adaptToModel(data, options): Promise<AdministratorModel> {
    return new Promise((resolve) => {
      const administrator = new AdministratorModel();

      administrator.administratorId = data.administrator_id;
      administrator.username = data.username;
      administrator.passwordHash = data.password_hash;

      resolve(administrator);
    });
  }

  getByUsername(username: string): Promise<AdministratorModel> {
    return new Promise((resolve, reject) => {
      this.getAllByFieldNameAndValue("username", [username], {})
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
}
