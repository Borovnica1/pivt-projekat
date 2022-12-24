import IModel from "../../common/IModel.interface";

export default class ManagerModel implements IModel {
  managerId: number;
  username: string;
  passwordHash?: string;
  createdAt: string;
  isActive: boolean;
  activationCode: string | null;
  passwordResetCode: string | null;
}
