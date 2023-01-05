import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";

export default function AdminLocationAdd() {
  const [locationName, setLocationName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function addNewLocation() {
    api("post", "/api/location", "administrator", {
      location_name: locationName,
    }).then((res) => {
      if (res.status === "error") {
        setErrorMessage(res.data);
      } else {
        navigate("/admin/dashboard/location/list");
      }
    });
  }

  return (
    <>
      {errorMessage && (
        <Alert key="danger" variant="danger">
          {errorMessage}
        </Alert>
      )}
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Location Name</Form.Label>
          <Form.Control
            onChange={(e) => {
              setErrorMessage("");
              setLocationName(e.target.value);
            }}
            type="text"
            placeholder="Enter location name"
            isInvalid={locationName.length < 2 || locationName.length > 30}
          />
          <Form.Control.Feedback type="invalid">
            {locationName.length < 2 && (
              <p>Location name must be longer than 2 characters</p>
            )}
            {locationName.length > 30 && (
              <p>Location name must be shorter than 30 characters</p>
            )}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" onClick={() => addNewLocation()}>
          Add location
        </Button>
      </Form>
    </>
  );
}
