import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { mkdirSync, readFileSync, unlinkSync } from "fs";
import BaseController from "../../common/BaseController";
import { IConfig, IResize } from "../../common/IConfig.interface";
import { DevConfig } from "../../configs";
import {
  EditRestaurantValidator,
  IEditRestaurantServiceDto,
} from "./dto/IEditRestaurant.dto";
import filetype from "magic-bytes.js";
import { basename, dirname, extname } from "path";
import sizeOf from "image-size";
import * as uuid from "uuid";
import PhotoModel from "../photo/PhotoModel.model";
import { AddAddressValidator, IAddAddressDto } from "./dto/IAddAddress.dto";
import sharp = require("sharp");
import {
  EditAddressValidator,
  IEditAddress,
  IEditAddressDto,
} from "./dto/IEditAddress.dto";
import {
  AddDayOffValidator,
  IAddDayOffDto,
  IAddDayOff,
} from "./dto/IAddDayOff.dto";
import {
  EditDayOffValidator,
  IEditDayOff,
  IEditDayOffDto,
} from "./dto/IEditDayOff.dto";
import {
  AddTableValidator,
  IAddTable,
  IAddTableDto,
} from "./dto/IAddTable.dto";
import { EditTableValidator, IEditTableDto } from "./dto/IEditTable.dto";

class RestaurantController extends BaseController {
  async getAll(req: Request, res: Response) {
    this.services.restaurant
      .getAll()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async getById(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);

    const restaurant = await this.services.restaurant.getById(restaurantId, {
      loadPhotos: true,
      loadWorkingHours: true,
      loadAddresses: true,
      loadDaysOff: true,
      loadTables: true,
    });

    if (restaurant === null) return res.status(404).send("nema podaci");

    res.send(restaurant);
  }

  async edit(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const data = req.body as IEditRestaurantServiceDto;
    const managerId = req.authorisation.id;

    if (!EditRestaurantValidator(data)) {
      return res.status(400).send(EditRestaurantValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }
        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to edit this restaurant!",
          };
        }
        return restaurant;
      })
      .then(() => {
        return this.services.restaurant.editById(
          restaurantId,
          {
            name: data.name,
          },
          { loadPhotos: false }
        );
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async delete(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const managerId = req.authorisation.id;

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to delete this restaurant!",
          };
        }
        return restaurant;
      })
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }

        this.services.restaurant
          .deleteById(restaurantId)
          .then((result) => {
            res.send("This restaurant has been deleted!");
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not delete this restaurant due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async uploadPhoto(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const managerId = req.authorisation.id;

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }
        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to delete this photo!",
          };
        }
        return restaurant;
      })
      .then(async () => {
        const uploadedFiles = this.doFileUpload(req, res);

        if (uploadedFiles === null) {
          return;
        }

        const photos: PhotoModel[] = [];

        for (let singleFile of await uploadedFiles) {
          const filename = basename(singleFile);

          const photo = await this.services.photo.add({
            name: filename,
            file_path: singleFile,
            restaurant_id: restaurantId,
          });

          if (photo === null) {
            return res
              .status(500)
              .send("Failed to add this photo into the database!");
          }

          photos.push(photo);
        }

        res.send(photos);
      })
      .catch((error) => {
        if (!res.headersSent) {
          res.status(500).send(error?.message);
        }
      });
  }

  private async doFileUpload(
    req: Request,
    res: Response
  ): Promise<string[] | null> {
    const config: IConfig = DevConfig;

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send("No files were uploaded!");
      return null;
    }

    console.log("req.files::: ", req.files);
    const fileFieldNames = Object.keys(req.files);

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1 + "").padStart(2, "0");

    const uploadDestinationRoot = config.server.static.path + "/";
    const destinationDirectory =
      config.fileUploads.destinationDirectoryRoot + year + "/" + month + "/";

    mkdirSync(uploadDestinationRoot + destinationDirectory, {
      recursive: true,
    });
    const uploadedFiles = [];

    for (let fileFieldName of fileFieldNames) {
      const file = req.files[fileFieldName] as UploadedFile;

      const type = filetype(readFileSync(file.tempFilePath))[0]?.typename;

      if (!config.fileUploads.photos.allowedTypes.includes(type)) {
        unlinkSync(file.tempFilePath);
        res.status(415).send(`File ${fileFieldName} - type is not supported!`);
        return null;
      }

      const declaredExtension = extname(file.name);

      if (
        !config.fileUploads.photos.allowedExtensions.includes(declaredExtension)
      ) {
        unlinkSync(file.tempFilePath);
        res
          .status(415)
          .send(`File ${fileFieldName} - extension is not supported!`);
        return null;
      }

      const size = sizeOf(file.tempFilePath);

      if (
        size.width < config.fileUploads.photos.width.min ||
        size.width > config.fileUploads.photos.width.max
      ) {
        unlinkSync(file.tempFilePath);
        res
          .status(415)
          .send(`File ${fileFieldName} - image width is not supported!`);
        return null;
      }

      if (
        size.height < config.fileUploads.photos.height.min ||
        size.height > config.fileUploads.photos.height.max
      ) {
        unlinkSync(file.tempFilePath);
        res
          .status(415)
          .send(`File ${fileFieldName} - image height is not supported!`);
        return null;
      }

      const fileNameRandomPart = uuid.v4();

      const fileDestinationPath =
        uploadDestinationRoot +
        destinationDirectory +
        fileNameRandomPart +
        "-" +
        file.name;

      file.mv(fileDestinationPath, async (error) => {
        if (error) {
          res
            .status(500)
            .send(`File ${fileFieldName} - could not be saved on the server!`);
          return null;
        }

        for (let resizeOptions of config.fileUploads.photos.resize) {
          await this.createResizedPhotos(
            destinationDirectory,
            fileNameRandomPart + "-" + file.name,
            resizeOptions
          );
        }
      });

      uploadedFiles.push(
        destinationDirectory + fileNameRandomPart + "-" + file.name
      );
    }

    return uploadedFiles;
  }

  private async createResizedPhotos(
    directory: string,
    filename: string,
    resizeOptions: IResize
  ) {
    const config: IConfig = DevConfig;

    await sharp(config.server.static.path + "/" + directory + filename)
      .resize({
        width: resizeOptions.width,
        height: resizeOptions.height,
        fit: resizeOptions.fit,
        background: resizeOptions.defaultBackground,
        withoutEnlargement: true,
      })
      .toFile(
        config.server.static.path +
          "/" +
          directory +
          resizeOptions.prefix +
          filename
      );
  }

  async deletePhoto(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const photoId: number = +req.params?.pId;
    const managerId = req.authorisation.id;

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: true })
      .then((result) => {
        if (result === null)
          throw { status: 404, message: "Restaurant not found!" };
        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to delete this restaurants photos!",
          };
        }
        return restaurant;
      })
      .then(async (restaurant) => {
        const photo = restaurant.photos?.find(
          (photo) => photo.photoId === photoId
        );
        if (!photo) {
          throw { status: 404, message: "Photo not found in this restaurant!" };
        }
        return photo;
      })
      .then(async (photo) => {
        await this.services.photo.deleteById(photo.photoId);
        return photo;
      })
      .then((photo) => {
        const directoryPart =
          DevConfig.server.static.path + "/" + dirname(photo.filePath);
        const fileName = basename(photo.filePath);

        for (const resize of DevConfig.fileUploads.photos.resize) {
          const filePath = directoryPart + "/" + resize.prefix + fileName;
          unlinkSync(filePath);
        }

        unlinkSync(DevConfig.server.static.path + "/" + photo.filePath);

        res.send("Deleted!");
      })
      .catch((error) => {
        res
          .status(error?.status ?? 500)
          .send(error?.message ?? "Server side error!");
      });
  }

  async addAddress(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const data = req.body as IAddAddressDto;
    const managerId = req.authorisation.id;

    if (!AddAddressValidator(data)) {
      return res.status(400).send(AddAddressValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }

        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to add adddress to this restaurant!",
          };
        }
        return restaurant;
      })

      .then(async (restaurant) => {
        const newAddress = await this.services.address
          .add({
            restaurant_id: restaurantId,
            phone_number: data.phoneNumber,
            place: data.place,
            street_and_number: data.streetAndNumber,
          })
          .then((result) => {
            if (result === null) {
              throw { message: "Server error" };
            }

            return result;
          });

        res.send(newAddress);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  async editAddress(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const addressId: number = Number(req.params?.aId);
    const data = req.body as IEditAddressDto;

    if (!EditAddressValidator(data)) {
      return res.status(400).send(EditAddressValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }
        return result;
      })
      .then(async (restaurant) => {
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (restaurantManager.managerId !== req.authorisation.id) {
          throw {
            status: 403,
            message: "You dont have permission to edit this address!",
          };
        }

        return restaurant;
      })
      .then(() => {
        const address: IEditAddress = {};

        if (data.phoneNumber) {
          address.phone_number = data.phoneNumber;
        }
        if (data.place) {
          address.place = data.place;
        }
        if (data.streetAndNumber) {
          address.street_and_number = data.streetAndNumber;
        }

        return this.services.address.edit(addressId, address);
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async deleteAddress(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const addressId: number = Number(req.params?.aId);
    const managerId = req.authorisation.id;

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }

        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to delete this address!",
          };
        }
        return restaurant;
      })
      .then((result) => {
        this.services.address
          .delete(addressId)
          .then((result) => {
            res.send("This address has been deleted!");
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not delete this address due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async addDayOff(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const data = req.body as IAddDayOffDto;
    const managerId = req.authorisation.id;

    console.log("AddDayOffValidator", AddDayOffValidator(data));

    if (!AddDayOffValidator(data)) {
      return res.status(400).send(AddDayOffValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }

        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to add day off for this restaurant!",
          };
        }
        return restaurant;
      })

      .then(async () => {
        const newDayOff = await this.services.dayOff
          .add({
            restaurant_id: restaurantId,
            day_off_date: data.dayOffDate ?? null,
            reason: data.reason ?? null,
          })
          .then((result) => {
            if (result === null) {
              throw { message: "Server error" };
            }

            return result;
          });

        res.send(newDayOff);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  async editDayOff(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const dayOffId: number = Number(req.params?.dId);
    const data = req.body as IEditDayOffDto;

    if (!EditDayOffValidator(data)) {
      return res.status(400).send(EditDayOffValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }
        return result;
      })
      .then(async (restaurant) => {
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (restaurantManager.managerId !== req.authorisation.id) {
          throw {
            status: 403,
            message: "You dont have permission to edit this day off!",
          };
        }

        return restaurant;
      })
      .then(() => {
        const dayOff = {} as IAddDayOff;

        if (data.dayOffDate) {
          dayOff.day_off_date = data.dayOffDate;
        }

        if (data.reason) {
          dayOff.reason = data.reason;
        }

        return this.services.dayOff.edit(dayOffId, dayOff);
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async deleteDayOff(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const dayOffId: number = Number(req.params?.dId);
    const managerId = req.authorisation.id;

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }

        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to delete this day off!",
          };
        }
        return restaurant;
      })
      .then((result) => {
        this.services.dayOff
          .delete(dayOffId)
          .then((result) => {
            res.send("This day off has been deleted!");
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not delete this day off due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }

  async addTable(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const data = req.body as IAddTableDto;
    const managerId = req.authorisation.id;

    if (!AddTableValidator(data)) {
      return res.status(400).send(AddTableValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, {})
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }

        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to add table for this restaurant!",
          };
        }
        return restaurant;
      })

      .then(async () => {
        const newTable = await this.services.table
          .add({
            restaurant_id: restaurantId,
            table_capacity: data.tableCapacity,
            table_name: data.tableName,
            table_max_reservation_duration: data.tableMaxReservationDuration,
          })
          .then((result) => {
            if (result === null) {
              throw { message: "Server error" };
            }

            return result;
          });

        res.send(newTable);
      })
      .catch((error) => {
        res.send(error);
      });
  }

  async editTable(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const tableId: number = Number(req.params?.tId);
    const data = req.body as IEditTableDto;

    if (!EditTableValidator(data)) {
      return res.status(400).send(EditTableValidator.errors);
    }

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }
        return result;
      })
      .then(async (restaurant) => {
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (restaurantManager.managerId !== req.authorisation.id) {
          throw {
            status: 403,
            message: "You dont have permission to edit this table!",
          };
        }

        return restaurant;
      })
      .then(() => {
        const table = {} as IAddTable;

        if (data.tableName) {
          table.table_name = data.tableName;
        }

        if (data.tableCapacity) {
          table.table_capacity = data.tableCapacity;
        }

        if (data.tableMaxReservationDuration) {
          table.table_max_reservation_duration =
            data.tableMaxReservationDuration;
        }

        return this.services.table.edit(tableId, table);
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(error?.status ?? 500).send(error?.message);
      });
  }

  async deleteTable(req: Request, res: Response) {
    const restaurantId: number = +req.params?.rId;
    const tableId: number = Number(req.params?.tId);
    const managerId = req.authorisation.id;

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then((result) => {
        if (result === null) {
          throw {
            status: 404,
            message: "Restaurant not found!",
          };
        }

        return result;
      })
      .then(async (restaurant) => {
        // check if restaurant is managed by this current manager
        const restaurantManager =
          await this.services.restaurant.getRestaurantManagerByRestaurantId(
            restaurantId
          );

        if (managerId !== restaurantManager.managerId) {
          throw {
            status: 403,
            message: "You dont have right to delete this table!",
          };
        }
        return restaurant;
      })
      .then((result) => {
        this.services.table
          .delete(tableId)
          .then((result) => {
            res.send("This table has been deleted!");
          })
          .catch((error) => {
            res
              .status(406)
              .send(
                "Could not delete this table due to an integrity constraint check!"
              );
          });
      })
      .catch((error) => {
        res.status(500).send(error?.message);
      });
  }
}

export default RestaurantController;
