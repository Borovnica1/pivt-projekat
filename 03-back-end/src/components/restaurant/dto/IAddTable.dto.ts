import Ajv from "ajv";
import addFormats from "ajv-formats";
import IServiceData from "../../../common/IServiceData.interface";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
require("ajv-errors")(ajv /*, {singleError: true} */);

ajv.addKeyword({
  keyword: "checkIfMaxReservationIs30minutesInterval",
  modifying: true,
  schema: false,
  validate: function (minutes) {
    return minutes % 30 === 0 && minutes !== 0;
  },
});
export interface IAddTableDto {
  tableName: string;
  tableCapacity: number;
  tableMaxReservationDuration: number;
}

export interface IAddTable extends IServiceData {
  restaurant_id: number;
  table_name: string;
  table_capacity: number;
  table_max_reservation_duration: number;
}

const AddTableValidator = ajv.compile({
  type: "object",
  properties: {
    tableName: {
      type: "string",
      maxLength: 64,
    },
    tableCapacity: {
      type: "number",
    },
    tableMaxReservationDuration: {
      type: "number",
      checkIfMaxReservationIs30minutesInterval: true,
      errorMessage: {
        checkIfMaxReservationIs30minutesInterval:
          "max reservation duration has to be in minutes with 30 interval. valid input for example (30, 60, 90, 120...)",
      },
    },
  },
  required: ["tableName", "tableCapacity", "tableMaxReservationDuration"],
  additionalProperties: true,
});

export { AddTableValidator };
