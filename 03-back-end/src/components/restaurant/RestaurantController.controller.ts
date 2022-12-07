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
import sharp = require("sharp");

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
    });

    if (restaurant === null) return res.status(404).send("nema podaci");

    res.send(restaurant);
  }

  async edit(req: Request, res: Response) {
    const restaurantId: number = Number(req.params?.rId);
    const data = req.body as IEditRestaurantServiceDto;

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

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
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

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: false })
      .then(async (result) => {
        if (result === null) {
          return res.status(404).send("Restaurant not found!");
        }

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

    this.services.restaurant
      .getById(restaurantId, { loadPhotos: true })
      .then((result) => {
        if (result === null)
          throw { status: 404, message: "Restaurant not found!" };
        return result;
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
}

export default RestaurantController;
