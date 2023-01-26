import {
  Alert,
  Button,
  Modal,
  Table,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { IReservationProps } from "./ManagerReservationsPage";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import styled from "styled-components";
import { api } from "../../../api/api";
import { AnyARecord } from "dns";

const MyPaginate = styled(ReactPaginate).attrs({
  // You can redefine classes here, if you want.
  activeClassName: "active", // default to "selected"
})`
  width: fit-content;
  margin: auto;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style-type: none;
  padding: 0 5rem;
  flex-wrap: wrap;
  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    border: gray 1px solid;
    cursor: pointer;
    margin: 0px 5px;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #0366d6;
    border-color: transparent;
    color: white;
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;
interface IManagerReservationsListProps {
  filter: string;
  reservations: any[];
  itemsPerPage: any;
  setReservations: React.Dispatch<React.SetStateAction<any[]>>;
  setKey: React.Dispatch<React.SetStateAction<string>>;
}

function ManagerReservationList(props: IManagerReservationsListProps) {
  const [show, setShow] = useState(false);
  const [toastShow, setToastShow] = useState(false);

  const [reservationToConfirm, setReservationToConfirm] =
    useState<IReservationProps>();

  const handleClose = () => setShow(false);
  const handleShow = (reservation: IReservationProps) => {
    setReservationToConfirm(reservation);
    setShow(true);
  };
  const confirmReservation = () => {
    api(
      "put",
      "/api/restaurant/" +
        reservationToConfirm?.restaurantId +
        "/table/" +
        reservationToConfirm?.tableId +
        "/reservation/" +
        reservationToConfirm?.reservationId,
      "manager",
      {
        status: "confirmed",
      }
    ).then((res) => {
      if (res.status === "ok") {
        setToastShow(true);
        setTimeout(() => {
          props.setKey("confirmed");
          props.setReservations((reservations) =>
            reservations.map((reservation) =>
              reservation?.reservationId === reservationToConfirm?.reservationId
                ? { ...reservation, status: "confirmed" }
                : reservation
            )
          );
        }, 1000);
      }
    });
    setShow(false);
  };

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  console.log("sta je ovo props.reservations?: ", props.reservations);
  
  const propsReservationsFiltered = props.reservations.filter((reservation) => {
    switch (props.filter) {
      case "all":
        return true;
      case "pending":
        return reservation.status === "pending";
      case "confirmed":
        return reservation.status === "confirmed";
      default:
        return true;
    }
  });
  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + props.itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = propsReservationsFiltered.slice(itemOffset, endOffset);
  console.log("currentItems 34324234", currentItems);
  const pageCount = Math.ceil(
    propsReservationsFiltered.length / props.itemsPerPage
  );
  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * props.itemsPerPage) % propsReservationsFiltered.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const currentPage = Math.round(itemOffset / props.itemsPerPage);

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Reservation Date</th>
            <th>Reservation Duration</th>
            <th>Status</th>
            <th>Restaurant</th>
            <th>Table</th>
            {props.filter === "pending" && <th>Edit Status</th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((reservation) => {
            const reservationDate = new Date(reservation.reservationDate);
            return (
              <tr key={"reservation-" + reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.firstName}</td>
                <td>{reservation.lastName}</td>
                <td>{reservation.phoneNumber}</td>
                <td>{reservation.email}</td>
                <td>
                  {reservationDate.getFullYear() +
                    "-" +
                    ("0" + (reservationDate.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + reservationDate.getDate()).slice(-2) +
                    " " +
                    ("0" + reservationDate.getHours()).slice(-2) +
                    ":" +
                    ("0" + reservationDate.getMinutes()).slice(-2)}
                </td>
                <td>{reservation.reservationDuration + " min"}</td>
                <td>
                  <Alert
                    className="py-1 text-center"
                    variant={
                      reservation.status === "confirmed" ? "success" : "warning"
                    }
                  >
                    {reservation.status}
                  </Alert>
                </td>
                <td>{reservation.restaurantName}</td>
                <td>{reservation.tableName}</td>
                {props.filter === "pending" && (
                  <td>
                    <Button onClick={() => handleShow(reservation)}>
                      Confirm reservation
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <MyPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to confirm this reservation?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmReservation}>
            Yes, confirm!
          </Button>
        </Modal.Footer>
      </Modal>
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
              Reservation confirmed successfully!
            </Alert>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ManagerReservationList;
