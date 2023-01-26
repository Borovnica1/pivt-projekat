import { useEffect, useReducer, useRef, useState } from "react";
import {
  Alert,
  Button,
  Form,
  InputGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api, apiForm } from "../../../api/api";
import ILocation from "../../../models/ILocation.model";
import {
  IAddressModel,
  IDayOffModel,
  ITableModel,
} from "../../../models/IRestaurant.model";
import "./ManagerRestaurantAdd.sass";

let nextId = 0;

interface IAddRestaurantFormState {
  name: string;
  description: string;
  locationId: number;
  addresses: IAddressModel[];
  daysOff: IDayOffModel[];
  tables: ITableModel[];
}

type TSetName = { type: "addRestaurantForm/setName"; value: string };
type TSetDescription = {
  type: "addRestaurantForm/setDescription";
  value: string;
};
type TSetLocation = {
  type: "addRestaurantForm/setLocation";
  value: number;
};
type TAddAddress = {
  type: "addRestaurantForm/addAddress";
  value: IAddressModel;
};
type TAddDayOff = {
  type: "addRestaurantForm/addDayOff";
  value: IDayOffModel;
};
type TAddTable = {
  type: "addRestaurantForm/addTable";
  value: ITableModel;
};
type TRemoveAddress = {
  type: "addRestaurantForm/removeAddress";
  value: number;
};
type TRemoveDayOff = {
  type: "addRestaurantForm/removeDayOff";
  value: number;
};
type TRemoveTable = {
  type: "addRestaurantForm/removeTable";
  value: number;
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
  | TRemoveTable;

function AddRestaurantFormReducer(
  oldState: IAddRestaurantFormState,
  action: AddRestaurantFormAction
): IAddRestaurantFormState {
  switch (action.type) {
    case "addRestaurantForm/setName": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
        name: action.value,
      };
    }
    case "addRestaurantForm/setDescription": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
        description: action.value,
      };
    }
    case "addRestaurantForm/setLocation": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
        locationId: action.value,
      };
    }
    case "addRestaurantForm/addAddress": {
      return {
        ...oldState,
        addresses: [...oldState.addresses, action.value],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
      };
    }
    case "addRestaurantForm/addDayOff": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff, action.value],
        tables: [...oldState.tables],
      };
    }
    case "addRestaurantForm/addTable": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables, action.value],
      };
    }
    case "addRestaurantForm/removeAddress": {
      return {
        ...oldState,
        addresses: [
          ...oldState.addresses.filter(
            (address) => address.addressId !== action.value
          ),
        ],
        daysOff: [...oldState.daysOff],
        tables: [...oldState.tables],
      };
    }
    case "addRestaurantForm/removeDayOff": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [
          ...oldState.daysOff.filter(
            (dayOff) => dayOff.dayOffId !== action.value
          ),
        ],
        tables: [...oldState.tables],
      };
    }
    case "addRestaurantForm/removeTable": {
      return {
        ...oldState,
        addresses: [...oldState.addresses],
        daysOff: [...oldState.daysOff],
        tables: [
          ...oldState.tables.filter((table) => table.tableId !== action.value),
        ],
      };
    }

    default:
      return oldState;
  }
}

export default function ManagerRestaurantAdd() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [file, setFile] = useState<File>();
  const locationRef = useRef<HTMLSelectElement>(null);
  const [addStreetAndNumber, setAddStreetAndNumber] = useState<string>("");
  const [addPhoneNumber, setAddPhoneNumber] = useState<string>("");
  const [addTableName, setAddTableName] = useState<string>("");
  const [addTableCapacity, setAddTableCapacity] = useState<string>("");
  const [addTableMaxDuration, setAddTableMaxDuration] = useState<string>("");
  const [toastShow, setToastShow] = useState<boolean>(false);

  const navigate = useNavigate();

  const [formState, dispatchFormStateAction] = useReducer(
    AddRestaurantFormReducer,
    {
      name: "",
      description: "",
      locationId: 0,
      addresses: [],
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

  const doAddRestaurant = () => {
    api(
      "post",
      "/api/location/" + formState.locationId + "/restaurant",
      "manager",
      {
        name: formState.name,
        description: formState.description,
      }
    )
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not add this Restaurant! Reason: " + res?.data
          );
        }
        return res.data.restaurantId;
      })
      .then(async (restaurantId) => {
        Promise.all([
          ...formState.addresses.map((address) =>
            api(
              "post",
              "/api/restaurant/" + restaurantId + "/address",
              "manager",
              {
                streetAndNumber: address.streetAndNumber,
                phoneNumber: "+" + address.phoneNumber,
              }
            )
          ),
          ...formState.tables.map((table) =>
            api(
              "post",
              "/api/restaurant/" + restaurantId + "/table",
              "manager",
              {
                tableName: table.tableName,
                tableCapacity: +table.tableCapacity,
                tableMaxReservationDuration: +table.tableMaxReservationDuration,
              }
            )
          ),
        ]);
        return restaurantId;
      })
      .then((restaurantId) => {
        if (!file) {
          throw new Error("No item photo selected!");
        }

        return {
          file,
          restaurantId,
        };
      })
      .then(({ file, restaurantId }) => {
        var bodyFormData = new FormData();
        bodyFormData.append("image", file);
        return apiForm(
          "post",
          "/api/restaurant/" + restaurantId + "/photo",
          "manager",
          bodyFormData
        );
      })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error("Could not upload restaurant photo" + res.data);
        }
        return res.data;
      })
      .then((res) => {
        setToastShow(true);
        setTimeout(() => {
          navigate("/manager/dashboard/restaurant/list", {
            replace: true,
          });
        }, 3000);
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
  };

  useEffect(() => {
    loadLocations();
  }, []);

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <div className="card-title">
            <h1 className="h5">Add a new Restaurant</h1>
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
                      type: "addRestaurantForm/setName",
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
                      type: "addRestaurantForm/setDescription",
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
                    type: "addRestaurantForm/setLocation",
                    value: Number(locationRef?.current?.value),
                  })
                }
                required
              >
                <option>Lokacije</option>
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
              {formState.addresses?.map((address) => {
                return (
                  <InputGroup
                    className="mb-3"
                    key={"address" + address.addressId}
                  >
                    <InputGroup.Text id="basic-addon1">
                      Street and number
                    </InputGroup.Text>
                    <Form.Control
                      readOnly
                      placeholder={address.streetAndNumber}
                      aria-label="Street and number"
                      aria-describedby="basic-addon1"
                    />
                    <InputGroup.Text id="basic-addon1">
                      Phone Number
                    </InputGroup.Text>
                    <Form.Control
                      readOnly
                      placeholder={address.phoneNumber}
                      aria-label="Phone Number"
                      aria-describedby="basic-addon1"
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
                            type: "addRestaurantForm/removeAddress",
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
                        type: "addRestaurantForm/addAddress",
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

            <div className="form-froup mb-3">
              <label>Tables</label>
              {formState.tables?.map((table) => {
                return (
                  <InputGroup className="mb-3" key={"table" + table.tableId}>
                    <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                    <Form.Control
                      readOnly
                      placeholder={table.tableName}
                      aria-label="tableName"
                      aria-describedby="basic-addon1"
                    />
                    <InputGroup.Text id="basic-addon1">
                      Capacity
                    </InputGroup.Text>
                    <Form.Control
                      readOnly
                      placeholder={table.tableCapacity}
                      aria-label="tableCapacity"
                      aria-describedby="basic-addon1"
                    />
                    <InputGroup.Text id="basic-addon1">
                      Max Reservation Time
                    </InputGroup.Text>
                    <Form.Control
                      readOnly
                      placeholder={table.tableMaxReservationDuration + ""}
                      aria-label="tableDuration"
                      aria-describedby="basic-addon1"
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
                            type: "addRestaurantForm/removeTable",
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
                        type: "addRestaurantForm/addTable",
                        value: {
                          tableId: nextId++,
                          restaurantId: nextId++,
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

            <div className="form-froup mb-3">
              <label>Restaurant image</label>
              <div className="input-group">
                <input
                  type="file"
                  accept=".jpg,.png"
                  className="from-control form-control-sm"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            <div className="form-froup mb-3">
              <button
                className="btn btn-primary"
                onClick={() => doAddRestaurant()}
                disabled={formState.locationId === 0}
              >
                Add restaurant
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
              <Alert variant={"success"}>
                Restaurant created successfully!
              </Alert>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
}
