import BaseService from "../../common/BaseService";
import { IAddAddress } from "./dto/IAddAddress.dto";
import AddressModel from "./AddressModel.model";
import IAdapterOptions from "../../common/IAdapterOptions.interface";

export interface IAddressAdapterOptions extends IAdapterOptions {}

export default class AddressService extends BaseService<
  AddressModel,
  IAddressAdapterOptions
> {
  tableName(): string {
    return "address";
  }

  adaptToModel(
    data: any,
    options: IAddressAdapterOptions
  ): Promise<AddressModel> {
    return new Promise((resolve) => {
      const address = new AddressModel();

      address.addressId = +data?.address_id;
      address.restaurantId = data?.restaurant_id;
      address.streetAndNmber = data?.street_and_number;
      address.place = data?.place;
      address.phoneNumber = data?.phone_number;

      resolve(address);
    });
  }

  add(data: IAddAddress): Promise<AddressModel> {
    return this.baseAdd(data, {});
  }
}