import { useEffect, useReducer, useRef, useState } from "react";
import {
  Alert,
  Button,
  Form,
  InputGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ILocation from "../../../models/ILocation.model";
import {
  IAddressModel,
  IDayOffModel,
  ITableModel,
} from "../../../models/IRestaurant.model";
import IWorkingHours from "../../../models/IWorkingHours.model";
import "./ManagerRestaurantEdit.sass";
import TimePicker from "react-bootstrap-time-picker";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import ManagerRestaurantPhotos from "./ManagerRestaurantPhotos";

let nextId = 0;

interface IAddRestaurantFormState {
  restaurantId: number;
  name: string;
  description: string;
  locationId: number;
  addresses: IAddressModel[];
  workingHours: IWorkingHours[];
  daysOff: IDayOffModel[];
  tables: ITableModel[];
}

type TSetName = { type: "editRestaurantForm/setName"; value: string };
type TSetDescription = {
  type: "editRestaurantForm/setDescription";
  value: string;
};
type TSetLocation = {
  type: "editRestaurantForm/setLocation";
  value: number;
};
type TAddAddress = {
  type: "editRestaurantForm/addAddress";
  value: IAddressModel;
};
type TAddDayOff = {
  type: "editRestaurantForm/addDayOff";
  value: IDayOffModel;
};
type TAddTable = {
  type: "editRestaurantForm/addTable";
  value: ITableModel;
};
type TRemoveAddress = {
  type: "editRestaurantForm/removeAddress";
  value: number;
};
type TRemoveDayOff = {
  type: "editRestaurantForm/removeDayOff";
  value: number;
};
type TRemoveTable = {
  type: "editRestaurantForm/removeTable";
  value: number;
};
type TEditAddress = {
  type: "editRestaurantForm/editAddress";
  value: { addressId: number; newAddress: IAddressModel };
};
type TEditDayOff = {
  type: "editRestaurantForm/editDayOff";
  value: { dayOffId: number; newDayOff: IDayOffModel };
};
type TEditTable = {
  type: "editRestaurantForm/editTable";
  value: { tableId: number; newTable: ITableModel };
};
type TEditWorkingHours = {
  type: "editRestaurantForm/editWorkingHours";
  value: { workingHourId: number; newWorkingHour: IWorkingHours };
};

type AddRestaurantFormAction =
  | TSetName
  | TSetDescription
  | TSetLocation
  | TAddAddress
  | TAddDayOff
  | TAddTable
  | TRemoveAddress
  | TRemoveDayOff
  | TRemoveTable
  | { type: "initialStateReady"; value: IAddRestaurantFormState }
  | TEditAddress
  | TEditDayOff
  | TEditTable
  | TEditWorkingHours;

function AddRestaurantFormReducer(
  oldState: IAddRestaurantFormState,
  action: AddRestaurantFormAction
): IAddRestaurantFormState {
  console.log("AddRestaurantFormReducer:  ", oldState);
  switch (action.type) {
    case "editRestaurantForm/setName": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        workingHours: [...oldState.workingHours],
        tables: [...oldState.tables],
        name: action.value,
      };
    }
    case "editRestaurantForm/setDescription": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        workingHours: [...oldState.workingHours],
        tables: [...oldState.tables],
        description: action.value,
      };
    }
    case "editRestaurantForm/setLocation": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        workingHours: [...oldState.workingHours],
        tables: [...oldState.tables],
        locationId: action.value,
      };
    }
    case "editRestaurantForm/addAddress": {
      return {
        ...oldState,
        addresses: [...oldState.addresses, action.value],
        daysOff: [...oldState.daysOff],
        workingHours: [...oldState.workingHours],
        tables: [...oldState.tables],
      };
    }
    case "editRestaurantForm/addDayOff": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff, action.value],
        workingHours: [...oldState.workingHours],
        tables: [...oldState.tables],
      };
    }
    case "editRestaurantForm/addTable": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        workingHours: [...oldState.workingHours],
        tables: [...oldState.tables, action.value],
      };
    }
    case "editRestaurantForm/removeAddress": {
      return {
        ...oldState,
        addresses: [
          ...oldState.addresses.map((address) => {
            return address.addressId === action.value
              ? { ...address, toDelete: true }
              : address;
          }),
        ],
        workingHours: [...oldState.workingHours],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
      };
    }
    case "editRestaurantForm/removeDayOff": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        workingHours: [...oldState.workingHours],
        daysOff: [
          ...oldState.daysOff.map((dayOff) => {
            return dayOff.dayOffId === action.value
              ? { ...dayOff, toDelete: true }
              : dayOff;
          }),
        ],
        tables: [...oldState.tables],
      };
    }
    case "editRestaurantForm/removeTable": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        workingHours: [...oldState.workingHours],
        daysOff: [...oldState.daysOff],
        tables: [
          ...oldState.tables.map((table) => {
            return table.tableId === action.value
              ? { ...table, toDelete: true }
              : table;
          }),
        ],
      };
    }
    case "editRestaurantForm/editAddress": {
      return {
        ...oldState,
        addresses: [
          ...oldState.addresses.map((address) =>
            address.addressId === action.value.addressId
              ? action.value.newAddress
              : address
          ),
        ],
        workingHours: [...oldState.workingHours],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
      };
    }
    case "editRestaurantForm/editDayOff": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        workingHours: [...oldState.workingHours],
        daysOff: [
          ...oldState.daysOff.map((dayOff) =>
            dayOff.dayOffId === action.value.dayOffId
              ? action.value.newDayOff
              : dayOff
          ),
        ],
        tables: [...oldState.tables],
      };
    }
    case "editRestaurantForm/editTable": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        workingHours: [...oldState.workingHours],
        tables: [
          ...oldState.tables.map((table) =>
            table.tableId === action.value.tableId
              ? action.value.newTable
              : table
          ),
        ],
      };
    }
    case "editRestaurantForm/editWorkingHours": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        workingHours: [
          ...oldState.workingHours.map((workingHour) =>
            workingHour.workingHoursId === action.value.workingHourId
              ? action.value.newWorkingHour
              : workingHour
          ),
        ],
        tables: [...oldState.tables],
      };
    }
    case "initialStateReady": {
      return { ...action.value };
    }

    default:
      return oldState;
  }
}

async function createInitialState(
  restaurantId: number
): Promise<IAddRestaurantFormState> {
  const restaurant = await api(
    "get",
    "/api/restaurant/" + restaurantId,
    "manager"
  ).then((res) => {
    if (res.status === "ok") {
      return res.data;
    } else {
      return {
        restaurantId: 0,
        name: "",
        description: "",
        locationId: 0,
        addresses: [],
        workingHours: [],
        daysOff: [],
        tables: [],
      };
    }
  });
  console.log("RESTAURANT 505:", restaurant);
  // make sure our nextId is biggest id so we dont have duplicate ids of some items in our state!!
  nextId =
    1 +
    Math.max(
      nextId,
      ...restaurant.addresses.map(
        (address: IAddressModel) => address.addressId
      ),
      ...restaurant.workingHours.map(
        (workingHour: IWorkingHours) => workingHour.workingHoursId
      ),
      ...restaurant.daysOff.map((dayOff: IDayOffModel) => dayOff.dayOffId),
      ...restaurant.tables.map((table: ITableModel) => table.tableId)
    );
  return restaurant;
}

export default function ManagerRestaurantEdit() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [file, setFile] = useState<File>();
  const locationRef = useRef<HTMLSelectElement>(null);
  const [addStreetAndNumber, setAddStreetAndNumber] = useState<string>("");
  const [addPhoneNumber, setAddPhoneNumber] = useState<string>("");
  const [addTableName, setAddTableName] = useState<string>("");
  const [addTableCapacity, setAddTableCapacity] = useState<string>("");
  const [addTableMaxDuration, setAddTableMaxDuration] = useState<string>("");
  const [addDayOffDate, setAddDayOffDate] = useState<Date | null>(null);
  const [addDayOffReason, setAddDayOffReason] = useState<string>("");
  const [toastShow, setToastShow] = useState<boolean>(false);

  const navigate = useNavigate();
  const params = useParams();

  const [formState, dispatchFormStateAction] = useReducer(
    AddRestaurantFormReducer,
    {
      restaurantId: 0,
      name: "",
      description: "",
      locationId: 0,
      addresses: [],
      workingHours: [],
      daysOff: [],
      tables: [],
    }
  );

  const loadLocations = () => {
    api("get", "/api/location", "manager")
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not load this category!");
        }
        return res.data;
      })
      .then((locations) => {
        setLocations(locations);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  const doEditRestaurant = () => {
    api("put", "/api/restaurant/" + formState.restaurantId, "manager", {
      name: formState.name,
      description: formState.description,
      locationId: formState.locationId,
    })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not edit this Restaurant! Reason: " + res?.data
          );
        }
        return res.data.restaurantId;
      })
      .then(async (restaurantId) => {
        // edit all addresses related to restaurant or add if there is no address in database and delete marked addresses for deletion
        const promises1 = Promise.all([
          ...formState.addresses.map((address) =>
            api("get", "/api/address/" + address.addressId, "manager").then(
              (res) => {
                if (res.status === "ok") {
                  return address?.toDelete
                    ? api(
                        "delete",
                        "/api/restaurant/" +
                          formState.restaurantId +
                          "/address/" +
                          address.addressId,
                        "manager"
                      )
                    : api(
                        "put",
                        "/api/restaurant/" +
                          formState.restaurantId +
                          "/address/" +
                          address.addressId,
                        "manager",
                        {
                          streetAndNumber: address.streetAndNumber,
                          phoneNumber:
                            (address.phoneNumber[0] === "+" ? "" : "+") +
                            address.phoneNumber,
                        }
                      );
                } else {
                  return api(
                    "post",
                    "/api/restaurant/" + formState.restaurantId + "/address",
                    "manager",
                    {
                      streetAndNumber: address.streetAndNumber,
                      phoneNumber:
                        address.phoneNumber[0] === "+"
                          ? ""
                          : "+" + address.phoneNumber,
                    }
                  );
                }
              }
            )
          ),
        ]);

        // edit all workingHOurs related to restaurant
        const promises2 = Promise.all([
          ...formState.workingHours.map((workingHour) =>
            api(
              "put",
              "/api/restaurant/" +
                formState.restaurantId +
                "/working-hours/" +
                workingHour.workingHoursId,
              "manager",
              {
                open: "" + workingHour.open,
                openingHours: (workingHour.openingHours + ":00").slice(0, 8),
                closingHours: (workingHour.closingHours + ":00").slice(0, 8),
              }
            )
          ),
        ]);

        // edit all tables related to restaurant or add if there is no table in database and delete marked tables for deletion
        const promises3 = Promise.all([
          ...formState.tables.map((table) =>
            api("get", "/api/table/" + table.tableId, "manager").then((res) => {
              if (res.status === "ok") {
                return table?.toDelete
                  ? api(
                      "delete",
                      "/api/restaurant/" +
                        formState.restaurantId +
                        "/table/" +
                        table.tableId,
                      "manager"
                    )
                  : api(
                      "put",
                      "/api/restaurant/" +
                        formState.restaurantId +
                        "/table/" +
                        table.tableId,
                      "manager",
                      {
                        tableName: table.tableName,
                        tableCapacity: Number(table.tableCapacity),
                        tableMaxReservationDuration:
                          table.tableMaxReservationDuration,
                      }
                    );
              } else {
                return api(
                  "post",
                  "/api/restaurant/" + formState.restaurantId + "/table",
                  "manager",
                  {
                    tableName: table.tableName,
                    tableCapacity: Number(table.tableCapacity),
                    tableMaxReservationDuration:
                      table.tableMaxReservationDuration,
                  }
                );
              }
            })
          ),
        ]);

        // edit all daysOff related to restaurant or add if there is no dayOff in database and delete marked daysOff for deletion
        const promises4 = await Promise.all([
          ...formState.daysOff.map((dayOff) => {
            const newDayOffDate = new Date(dayOff.dayOffDate);
            console.log(
              "newDAY OFFDATE???",
              newDayOffDate,
              "0" + newDayOffDate.getMonth() + 1
            );
            return api(
              "get",
              "/api/day-off/" + dayOff.dayOffId,
              "manager"
            ).then((res) => {
              if (res.status === "ok") {
                return dayOff?.toDelete
                  ? api(
                      "delete",
                      "/api/restaurant/" +
                        formState.restaurantId +
                        "/day-off/" +
                        dayOff.dayOffId,
                      "manager"
                    )
                  : api(
                      "put",
                      "/api/restaurant/" +
                        formState.restaurantId +
                        "/day-off/" +
                        dayOff.dayOffId,
                      "manager",
                      {
                        dayOffDate:
                          newDayOffDate.getFullYear() +
                          "-" +
                          ("0" + (newDayOffDate.getMonth() + 1)).slice(-2) +
                          "-" +
                          ("0" + newDayOffDate.getDate()).slice(-2),
                        reason: dayOff.reason,
                      }
                    );
              } else {
                return api(
                  "post",
                  "/api/restaurant/" + formState.restaurantId + "/day-off",
                  "manager",
                  {
                    dayOffDate:
                      newDayOffDate.getFullYear() +
                      "-" +
                      ("0" + (newDayOffDate.getMonth() + 1)).slice(-2) +
                      "-" +
                      ("0" + newDayOffDate.getDate()).slice(-2),
                    reason: dayOff.reason,
                  }
                );
              }
            });
          }),
        ]);

        console.log("promises1", promises1);
        console.log("promises2", promises2);
        console.log("promises3", promises3);
        console.log("promises4", promises4);
        return restaurantId;
      })
      .then((res) => {
        setToastShow(true);
        setTimeout(() => {
          navigate("/manager/dashboard/restaurant/list", {
            replace: true,
          });
        }, 1000);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    loadLocations();
    createInitialState(Number(params?.rid)).then((res) => {
      dispatchFormStateAction({ type: "initialStateReady", value: res });
    });
  }, []);

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h1 className="h5">Edit restaurant</h1>
          </div>
          <div className="card-text">
            {errorMessage && (
              <div className="alert alert-danger mb-3">{errorMessage}</div>
            )}

            <div className="form-group mb-3">
              <label>Name</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={formState.name}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "editRestaurantForm/setName",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Description</label>
              <div className="input-group">
                <textarea
                  className="form-control form-control-sm"
                  rows={5}
                  value={formState.description}
                  onChange={(e) =>
                    dispatchFormStateAction({
                      type: "editRestaurantForm/setDescription",
                      value: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="form-froup mb-3">
              <label>Izaberite lokaciju restorana</label>
              <Form.Select
                aria-label="Default select example"
                ref={locationRef}
                onChange={() =>
                  dispatchFormStateAction({
                    type: "editRestaurantForm/setLocation",
                    value: Number(locationRef?.current?.value),
                  })
                }
                required
                value={formState.locationId}
              >
                <option value={0}>Lokacije</option>
                {locations.map((location) => {
                  return (
                    <option
                      key={"location-" + location.locationId}
                      value={location.locationId}
                    >
                      {location.locationName}
                    </option>
                  );
                })}
              </Form.Select>
            </div>

            <div className="form-froup mb-3">
              <label>Addresses</label>
              {formState.addresses
                ?.filter((address) => !address?.toDelete)
                .map((address) => {
                  return (
                    <InputGroup
                      className="mb-3"
                      key={"address" + address.addressId}
                    >
                      <InputGroup.Text id="basic-addon1">
                        Street and number
                      </InputGroup.Text>
                      <Form.Control
                        placeholder={address.streetAndNumber}
                        aria-label="Street and number"
                        aria-describedby="basic-addon1"
                        value={address.streetAndNumber}
                        onChange={(e) =>
                          dispatchFormStateAction({
                            type: "editRestaurantForm/editAddress",
                            value: {
                              addressId: address.addressId,
                              newAddress: {
                                addressId: address.addressId,
                                streetAndNumber: e.target.value,
                                phoneNumber: address.phoneNumber,
                              },
                            },
                          })
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        Phone Number
                      </InputGroup.Text>
                      <Form.Control
                        placeholder={address.phoneNumber}
                        aria-label="Phone Number"
                        aria-describedby="basic-addon1"
                        value={address.phoneNumber}
                        onChange={(e) =>
                          dispatchFormStateAction({
                            type: "editRestaurantForm/editAddress",
                            value: {
                              addressId: address.addressId,
                              newAddress: {
                                addressId: address.addressId,
                                streetAndNumber: address.streetAndNumber,
                                phoneNumber: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <InputGroup.Text
                        id="basic-addon1"
                        style={{ padding: "0px" }}
                      >
                        <Button
                          value={address.addressId}
                          variant="danger"
                          onClick={(e) =>
                            dispatchFormStateAction({
                              type: "editRestaurantForm/removeAddress",
                              value: +(e.target as HTMLButtonElement).value,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </InputGroup.Text>
                    </InputGroup>
                  );
                })}
              <label style={{ display: "block" }}>Add a new address</label>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                  Street and number
                </InputGroup.Text>
                <Form.Control
                  placeholder="Street and number"
                  aria-label="Street and number"
                  aria-describedby="basic-addon1"
                  value={addStreetAndNumber}
                  onChange={(e) => setAddStreetAndNumber(e.target.value)}
                />
                <InputGroup.Text id="basic-addon1">
                  Phone Number
                </InputGroup.Text>
                <Form.Control
                  placeholder="+13156059728"
                  aria-label="Phone Number"
                  aria-describedby="basic-addon1"
                  value={addPhoneNumber}
                  onChange={(e) => setAddPhoneNumber(e.target.value)}
                />
                <InputGroup.Text id="basic-addon1" style={{ padding: "0px" }}>
                  <Button
                    disabled={addStreetAndNumber === ""}
                    variant="success"
                    onClick={(e) =>
                      dispatchFormStateAction({
                        type: "editRestaurantForm/addAddress",
                        value: {
                          addressId: nextId++,
                          phoneNumber: addPhoneNumber,
                          streetAndNumber: addStreetAndNumber,
                        },
                      })
                    }
                  >
                    Add
                  </Button>
                </InputGroup.Text>
                <InputGroup.Text id="basic-addon1" style={{ padding: "0px" }}>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setAddStreetAndNumber("");
                      setAddPhoneNumber("");
                    }}
                  >
                    Cancel
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </div>

            <div className="form-froup mb-3 workingHours">
              <label>Working Hours</label>
              {formState.workingHours.map((workingHour) => {
                return (
                  <InputGroup
                    className="mb-3"
                    key={"workingHour-" + workingHour.workingHoursId}
                  >
                    <InputGroup.Text id="basic-addon1">
                      {workingHour.day + ": "}
                    </InputGroup.Text>
                    <InputGroup.Text id="basic-addon1">
                      Opening Hours
                    </InputGroup.Text>
                    <TimePicker
                      format={24}
                      step={30}
                      value={workingHour.openingHours}
                      onChange={(time: any) => {
                        console.log(
                          "opening",
                          time,
                          workingHour.closingHours,
                          +workingHour.closingHours.slice(0, 2) * 3600 +
                            +workingHour.closingHours.slice(3, 5) * 60,
                          ("0" + Math.floor(time / 3600)).slice(-2) +
                            ":" +
                            ("0" + (time % 3600) / 60).slice(-2)
                        );
                        dispatchFormStateAction({
                          type: "editRestaurantForm/editWorkingHours",
                          value: {
                            workingHourId: workingHour.workingHoursId,
                            newWorkingHour: {
                              ...workingHour,
                              openingHours:
                                time <
                                +workingHour.closingHours.slice(0, 2) * 3600 +
                                  +workingHour.closingHours.slice(3, 5) * 60
                                  ? ("0" + Math.floor(time / 3600)).slice(-2) +
                                    ":" +
                                    ("0" + (time % 3600) / 60).slice(-2)
                                  : workingHour.closingHours,
                            },
                          },
                        });
                      }}
                    />
                    <InputGroup.Text id="basic-addon1">
                      Closing Hours
                    </InputGroup.Text>
                    <TimePicker
                      format={24}
                      step={30}
                      value={workingHour.closingHours}
                      onChange={(time: any) => {
                        dispatchFormStateAction({
                          type: "editRestaurantForm/editWorkingHours",
                          value: {
                            workingHourId: workingHour.workingHoursId,
                            newWorkingHour: {
                              ...workingHour,
                              closingHours:
                                time >
                                +workingHour.openingHours.slice(0, 2) * 3600 +
                                  +workingHour.openingHours.slice(3, 5) * 60
                                  ? ("0" + Math.floor(time / 3600)).slice(-2) +
                                    ":" +
                                    ("0" + (time % 3600) / 60).slice(-2)
                                  : workingHour.openingHours,
                            },
                          },
                        });
                      }}
                    />
                    <InputGroup.Text
                      id="basic-addon1"
                      style={{ padding: "0px" }}
                    >
                      <Alert variant={!workingHour.open ? "danger" : "success"}>
                        Status: {!workingHour.open ? "Closed" : "Open"}
                      </Alert>
                    </InputGroup.Text>
                    <Button
                      variant={workingHour.open ? "danger" : "success"}
                      onClick={() =>
                        dispatchFormStateAction({
                          type: "editRestaurantForm/editWorkingHours",
                          value: {
                            workingHourId: workingHour.workingHoursId,
                            newWorkingHour: {
                              ...workingHour,
                              open: workingHour.open ? 0 : 1,
                            },
                          },
                        })
                      }
                    >
                      {workingHour.open ? "Close" : "Open"}
                    </Button>
                  </InputGroup>
                );
              })}
            </div>

            <div className="form-froup mb-3">
              <label>Tables</label>
              {formState.tables
                ?.filter((table) => !table?.toDelete)
                .map((table) => {
                  return (
                    <InputGroup className="mb-3" key={"table" + table.tableId}>
                      <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                      <Form.Control
                        placeholder={table.tableName}
                        aria-label="tableName"
                        aria-describedby="basic-addon1"
                        value={table.tableName}
                        onChange={(e) =>
                          dispatchFormStateAction({
                            type: "editRestaurantForm/editTable",
                            value: {
                              tableId: table.tableId,
                              newTable: {
                                ...table,
                                tableName: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        Capacity
                      </InputGroup.Text>
                      <Form.Control
                        placeholder={table.tableCapacity}
                        aria-label="tableCapacity"
                        aria-describedby="basic-addon1"
                        value={table.tableCapacity}
                        onChange={(e) =>
                          dispatchFormStateAction({
                            type: "editRestaurantForm/editTable",
                            value: {
                              tableId: table.tableId,
                              newTable: {
                                ...table,
                                tableCapacity: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <InputGroup.Text id="basic-addon1">
                        Max Reservation Time
                      </InputGroup.Text>
                      <Form.Control
                        placeholder={table.tableMaxReservationDuration + ""}
                        aria-label="tableDuration"
                        aria-describedby="basic-addon1"
                        value={table.tableMaxReservationDuration}
                        onChange={(e) => {
                          dispatchFormStateAction({
                            type: "editRestaurantForm/editTable",
                            value: {
                              tableId: table.tableId,
                              newTable: {
                                ...table,
                                tableMaxReservationDuration: +e.target.value,
                              },
                            },
                          });
                          setTimeout(() => {
                            dispatchFormStateAction({
                              type: "editRestaurantForm/editTable",
                              value: {
                                tableId: table.tableId,
                                newTable: {
                                  ...table,
                                  tableMaxReservationDuration:
                                    +e.target.value < 30
                                      ? 30
                                      : +e.target.value -
                                        (+e.target.value % 30),
                                },
                              },
                            });
                          }, 1000);
                        }}
                      />
                      <InputGroup.Text
                        id="basic-addon1"
                        style={{ padding: "0px" }}
                      >
                        <Button
                          value={table.tableId}
                          variant="danger"
                          onClick={(e) =>
                            dispatchFormStateAction({
                              type: "editRestaurantForm/removeTable",
                              value: +(e.target as HTMLButtonElement).value,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </InputGroup.Text>
                    </InputGroup>
                  );
                })}
              <label style={{ display: "block" }}>Add a new table</label>

              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                <Form.Control
                  placeholder={"Table Name"}
                  aria-label="tableName"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setAddTableName(e.target.value)}
                />
                <InputGroup.Text id="basic-addon1">Capacity</InputGroup.Text>
                <Form.Control
                  placeholder={"6"}
                  aria-label="tableCapacity"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setAddTableCapacity(e.target.value)}
                  type="number"
                />
                <InputGroup.Text id="basic-addon1">
                  Max Reservation Time (step: 30)
                </InputGroup.Text>
                <Form.Control
                  placeholder={"30"}
                  aria-label="tableDuration"
                  aria-describedby="basic-addon1"
                  value={addTableMaxDuration}
                  onChange={(e) => {
                    setAddTableMaxDuration(e.target.value);
                    setTimeout(() => {
                      setAddTableMaxDuration(
                        +e.target.value < 30
                          ? "30"
                          : +e.target.value - (+e.target.value % 30) + ""
                      );
                    }, 1000);
                  }}
                  type="number"
                  min="30"
                  step="30"
                />
                <InputGroup.Text id="basic-addon1" style={{ padding: "0px" }}>
                  <Button
                    disabled={
                      addTableName === "" ||
                      addTableCapacity === "" ||
                      +addTableMaxDuration % 30 !== 0
                    }
                    variant="success"
                    onClick={(e) =>
                      dispatchFormStateAction({
                        type: "editRestaurantForm/addTable",
                        value: {
                          tableId: nextId++,
                          restaurantId: Number(params?.rid) || 0,
                          tableName: addTableName,
                          tableCapacity: addTableCapacity,
                          tableMaxReservationDuration: +addTableMaxDuration,
                        },
                      })
                    }
                  >
                    Add
                  </Button>
                </InputGroup.Text>
                <InputGroup.Text id="basic-addon1" style={{ padding: "0px" }}>
                  <Button
                    variant="danger"
                    onClick={(e) => {
                      setAddTableName("");
                      setAddTableCapacity("");
                      setAddTableMaxDuration("");
                    }}
                  >
                    Cancel
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </div>

            <div className="form-froup mb-3 dayOff">
              <label style={{ display: "block" }}>Days off</label>
              {formState.daysOff
                ?.filter((dayOff) => !dayOff?.toDelete)
                .map((dayOff) => {
                  return (
                    <Alert variant="warning" key={"dayOff-" + dayOff.dayOffId}>
                      <InputGroup
                        className="mb-3"
                      >
                        <label id="basic-addon1">Date:</label>
                        <DatePicker
                          className="react-date-picker"
                          selected={new Date(dayOff.dayOffDate)}
                          onChange={(date: Date) => {
                            dispatchFormStateAction({
                              type: "editRestaurantForm/editDayOff",
                              value: {
                                dayOffId: dayOff.dayOffId,
                                newDayOff: {
                                  ...dayOff,
                                  dayOffDate: date,
                                },
                              },
                            });
                          }}
                          includeDateIntervals={[
                            {
                              start: subDays(new Date(), 1),
                              end: addDays(new Date(), 30),
                            },
                          ]}
                          excludeDates={formState.daysOff?.map(
                            (dayOff) => new Date(dayOff.dayOffDate)
                          )}
                          placeholderText="Izaberite datum"
                        />
                        <label id="basic-addon1">Razlog:</label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          placeholder={dayOff.reason}
                          aria-label="Day off reason"
                          aria-describedby="basic-addon1"
                          value={dayOff.reason}
                          onChange={(e) =>
                            dispatchFormStateAction({
                              type: "editRestaurantForm/editDayOff",
                              value: {
                                dayOffId: dayOff.dayOffId,
                                newDayOff: {
                                  ...dayOff,
                                  reason: e.target.value,
                                },
                              },
                            })
                          }
                        />

                        <Button
                          value={dayOff.dayOffId}
                          variant="danger"
                          onClick={(e) =>
                            dispatchFormStateAction({
                              type: "editRestaurantForm/removeDayOff",
                              value: +(e.target as HTMLButtonElement).value,
                            })
                          }
                        >
                          Remove
                        </Button>
                      </InputGroup>
                    </Alert>
                  );
                })}

              <Alert variant="warning">
                <InputGroup className="mb-3">
                  <label id="basic-addon1">Date:</label>
                  <DatePicker
                    className="react-date-picker"
                    selected={addDayOffDate}
                    onChange={(date: Date) => {
                      setAddDayOffDate(date);
                    }}
                    includeDateIntervals={[
                      {
                        start: subDays(new Date(), 1),
                        end: addDays(new Date(), 30),
                      },
                    ]}
                    excludeDates={formState.daysOff?.map(
                      (dayOff) => new Date(dayOff.dayOffDate)
                    )}
                    placeholderText="Izaberite datum"
                  />
                  <label id="basic-addon1">Razlog:</label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder={"Day Off reason"}
                    aria-label="Day off reason"
                    aria-describedby="basic-addon1"
                    value={addDayOffReason}
                    onChange={(e) => setAddDayOffReason(e.target.value)}
                  />
                  <div className="add-cancel-buttons">
                    <Button
                      disabled={!addDayOffDate}
                      variant="success"
                      onClick={(e) => {
                        setAddDayOffDate(null);
                        setAddDayOffReason("");
                        dispatchFormStateAction({
                          type: "editRestaurantForm/addDayOff",
                          value: {
                            dayOffId: nextId++,
                            restaurantId: Number(params?.rid),
                            dayOffDate: addDayOffDate as Date,
                            reason: addDayOffReason,
                          },
                        });
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setAddDayOffDate(null);
                        setAddDayOffReason("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </InputGroup>
              </Alert>
            </div>

            <div className="col col-12 col-lg-5">
              <h2 className="h6">Manage photos</h2>

              <ManagerRestaurantPhotos restaurantId={Number(params?.rid)} />
            </div>
            <div className="form-froup my-3">
              <button
                className="btn btn-primary"
                onClick={() => doEditRestaurant()}
                disabled={formState.locationId === 0}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
        <ToastContainer className="p-3" position="bottom-center">
          <Toast
            onClose={() => setToastShow(false)}
            show={toastShow}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>
              <Alert variant={"success"}>Restaurant edited successfully!</Alert>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
}
