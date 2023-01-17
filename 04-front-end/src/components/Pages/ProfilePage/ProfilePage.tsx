import { useEffect, useState } from "react";
import { Alert, Button, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";
import AuthStore, { AuthStoreReducer } from "../../../stores/AuthStore";

export default function ContactPage() {
  // maybe reduces instead of use states
  const [userForename, setUserForename] = useState<string>("");
  const [userSurname, setUserSurname] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState<string>("");
  const [toastShow, setToastShow] = useState<boolean>(false);

  const navigate = useNavigate();

  const editUser = () => {
    api("put", "/api/user/" + AuthStore.getState().id, "user", {
      password: userPassword ? userPassword : undefined,
      forename: userForename,
      surname: userSurname,
    }).then((res) => {
      if (res.status === "ok") {
        setToastShow(true);
        AuthStore.dispatch({
          type: "update",
          key: "identity",
          value: userForename + " " + userSurname,
        });
        setTimeout(() => {
          navigate("/locations");
        }, 1000);
      }
    });
  };

  // maybe useLayoutEffect instead???
  useEffect(() => {
    api("get", "/api/user/" + AuthStore.getState().id, "user")
      .then((res) => res.data)
      .then((userData: IUser) => {
        console.log("user dataaaaa", userData, AuthStore.getState().id);
        setUserForename(userData.forename);
        setUserSurname(userData.surname);
      });
  }, []);

  return (
    <div className="m-2">
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setUserPasswordConfirm(e.target.value)}
            isInvalid={userPassword !== userPasswordConfirm}
            required={userPassword !== ""}
          />
          <Form.Control.Feedback type="invalid">
            Please make sure passwords match.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>First name</Form.Label>
          <Form.Control
            type="text"
            defaultValue={userForename}
            onChange={(e) => setUserForename(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            type="text"
            defaultValue={userSurname}
            onChange={(e) => setUserSurname(e.target.value)}
          />
        </Form.Group>
        <Button variant="info" onClick={() => editUser()}>
          Edit profile
        </Button>
      </Form>
      <ToastContainer position="bottom-center" className="mb-3">
        <Toast
          onClose={() => setToastShow(false)}
          show={toastShow}
          delay={30000000}
          autohide
        >
          <Alert variant="success" className="me-auto d-inline-block">
            <Toast.Header>Profile edited successfully!</Toast.Header>
          </Alert>
        </Toast>
      </ToastContainer>
    </div>
  );
}
