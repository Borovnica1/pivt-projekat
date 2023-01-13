import BaseService from "../../common/BaseService";
import { IAddAddress } from "./dto/IAddAddress.dto";
import IAdapterOptions from "../../common/IAdapterOptions.interface";
import { IEditAddress } from "./dto/IEditAddress.dto";

import IModel from "../../common/IModel.interface";

export class AddressModel implements IModel {
  addressId: number;
  restaurantId: number;

  streetAndNumber: string;
  place: string;
  phoneNumber: string;
}

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
      address.streetAndNumber = data?.street_and_number;
      address.place = data?.place;
      address.phoneNumber = data?.phone_number;

      resolve(address);
    });
  }

  add(data: IAddAddress): Promise<AddressModel> {
    return this.baseAdd(data, {});
  }

  edit(addressId: number, data: IEditAddress): Promise<AddressModel> {
    return this.baseEdit(addressId, data, {});
  }

  delete(addressId: number) {
    return this.baseDeleteById(addressId);
  }
}
