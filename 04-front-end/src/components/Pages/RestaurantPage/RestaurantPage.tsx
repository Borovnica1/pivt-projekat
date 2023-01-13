import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../api/api";
import IRestaurant, { ITableModel } from "../../../models/IRestaurant.model";
import * as path from "path-browserify";
import myConfig from "../../../config";
import "./RestaurantPage.sass";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";

export function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<IRestaurant>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tableChosen, setTableChosen] = useState<ITableModel>();
  const [selectedReservationDate, setSelectedReservationDate] = useState<Date>(
    new Date()
  );

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (table: ITableModel) => {
    setTableChosen(table);
    setShow(true);
  };
  const dateChanged = async (date: Date) => {
    const dateForSql =
      date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    const tableReservations = await api(
      "get",
      "/api/table/" + tableChosen?.tableId + "/reservation/" + dateForSql,
      "user"
    );
    console.log(
      "izabran datum je: ",
      date,
      date.getDate(),
      "asssss sql",
      dateForSql
    );
    setSelectedReservationDate(date);
  };

  const params = useParams();

  useEffect(() => {
    setLoading(true);

    api("get", "/api/restaurant/" + params.rid, "user")
      .then((res) => {
        if (res.status === "ok") {
          setRestaurant(res.data);
        } else {
          setError(res.data);
        }
      })
      .catch((res) => {
        setError(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const photoFilePaths: string[] | undefined = restaurant?.photos?.map(
    (photo) => {
      return photo?.filePath;
    }
  );
  if (photoFilePaths) {
    photoFilePaths.forEach((photoFilePath) => {
      console.log(
        "photoFilePath::: ",
        "/assets/" +
          path.dirname(photoFilePath) +
          "/small-" +
          path.basename(photoFilePath)
      );
    });
  }

  return (
    <div style={{ marginBottom: "50px" }}>
      {loading && <p>Loading...</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      <>
        <h2>{restaurant?.name}</h2>
        <Carousel style={{ height: "500px" }}>
          {restaurant?.photos?.map((photo) => (
            <Carousel.Item style={{ width: "100%", height: "100%" }}>
              <img
                className="d-block w-100"
                src={
                  myConfig.apiBaseUrl +
                  "/assets/" +
                  path.dirname(photo.filePath) +
                  "/medium-" +
                  path.basename(photo.filePath)
                }
                alt={photo.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <p>{restaurant?.description || "No description..."}</p>
        {restaurant?.addresses?.map((address) => {
          return <h5>{address.streetAndNumber}</h5>;
        })}
        <h5>Radno vreme restorana:</h5>
        <ul>
          {restaurant?.workingHours?.map((workingHoursDay) => {
            return (
              <div
                key={
                  "workinghours-" +
                  restaurant?.restaurantId +
                  "-" +
                  workingHoursDay.workingHoursId
                }
              >
                {!workingHoursDay.open ? (
                  workingHoursDay.day + ": CLOSED! "
                ) : (
                  <span className="d-inline-block">
                    {workingHoursDay.day +
                      ": " +
                      workingHoursDay.openingHours +
                      "-" +
                      workingHoursDay.closingHours}
                  </span>
                )}
                <br />
              </div>
            );
          })}
        </ul>
        <h4>Datumi kada restoran ne radi:</h4>
        <ul>
          {restaurant?.daysOff?.length
            ? restaurant?.daysOff?.map((dayOff) => {
                const newDate = new Date(dayOff.dayOffDate);
                return (
                  <Alert key={"dayoff-" + dayOff.dayOffId} variant="warning">
                    {newDate.getMonth() +
                      1 +
                      "/" +
                      newDate.getDate() +
                      "/" +
                      newDate.getFullYear() +
                      " Razlog: " +
                      dayOff.reason}
                  </Alert>
                );
              })
            : "Nema datuma kada restoran ne radi!"}
        </ul>
        <Container>
          <Row xs={1} sm={2} md={3} lg={4} xxl={6}>
            {restaurant?.tables?.map((table) => (
              <Col style={{ padding: "10px" }}>
                <h3>{table.tableName}</h3>
                <h5>{"Broj mesta: " + table.tableCapacity}</h5>
                <h5>
                  {"Max vreme rezervacije: " +
                    table.tableMaxReservationDuratio +
                    "min"}
                </h5>
                <Button variant="primary" onClick={() => handleShow(table)}>
                  Slobodni termini
                </Button>
              </Col>
            ))}
          </Row>
        </Container>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Rezervacija stola: {tableChosen?.tableName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ marginBottom: "10px" }}>
              <h5>1. Odaberite datum:</h5>
              <DatePicker
                selected={selectedReservationDate}
                onChange={(date: Date) => dateChanged(date)}
                includeDateIntervals={[
                  {
                    start: subDays(new Date(), 1),
                    end: addDays(new Date(), 30),
                  },
                ]}
                excludeDates={restaurant?.daysOff?.map(
                  (dayOff) => new Date(dayOff.dayOffDate)
                )}
                placeholderText="This only includes dates with reservations available from today and next 30 days"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Rezervisi sto
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}
