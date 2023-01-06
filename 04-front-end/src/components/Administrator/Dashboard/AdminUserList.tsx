import { useState, useEffect } from "react";
import { Alert, Badge, Button } from "react-bootstrap";
import { api } from "../../../api/api";
import IUser from "../../../models/IUser.model";

interface IAdminUserListRowProperties {
  user: IUser;
  userIndex: number;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}

export default function AdminUserList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function AdminUserListRow(props: IAdminUserListRowProperties) {
    function changeUserStatus() {
      api("put", "/api/user/" + props.user.userId, "administrator", {
        isActive: !props.user.isActive,
      }).then((res) => {
        if (res.status === "error") {
          setErrorMessage(res.data);
        } else {
          const usersWithChangedStatus = users.map((user, i) => {
            if (i === props.userIndex) {
              user["isActive"] = !props.user.isActive ? 1 : 0;
              return user;
            }
            return user;
          });

          setErrorMessage("");
          props.setUsers(usersWithChangedStatus);
        }
      });
    }

    return (
      <tr>
        <td>{props.user.userId}</td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.user.email}
              readOnly={true}
              style={{ cursor: "default" }}
            />
          </div>
        </td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.user.forename}
              readOnly={true}
              style={{ cursor: "default" }}
            />
          </div>
        </td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.user.surname}
              readOnly={true}
              style={{ cursor: "default" }}
            />
          </div>
        </td>
        <td style={{ verticalAlign: "middle", textAlign: "center" }}>
          {props.user.isActive ? (
            <Badge bg="success">Active</Badge>
          ) : (
            <Badge bg="danger">Not Active</Badge>
          )}
        </td>
        <td>
          {props.user.isActive ? (
            <Button variant="danger" onClick={(e) => changeUserStatus()}>
              Deactive
            </Button>
          ) : (
            <Button variant="success" onClick={(e) => changeUserStatus()}>
              Activate
            </Button>
          )}
        </td>
      </tr>
    );
  }

  const loadUsers = () => {
    api("get", "/api/user", "administrator")
      .then((apiResponse) => {
        if (apiResponse.status === "ok") {
          return setUsers(apiResponse.data);
        }

        throw { message: "Unknown error while loading users..." };
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading users..."
        );
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      {errorMessage && (
        <Alert key="danger" variant="danger">
          Error: {errorMessage}
        </Alert>
      )}
      <div>
        <h3>Users:</h3>
        <table className="table table-bordered table-striped table-hover table-sm mt-3">
          <thead>
            <tr>
              <th className="location-row-id">ID</th>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Account Status</th>
              <th className="location-row-options">Options</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <AdminUserListRow
                key={"user-row-" + user.userId}
                user={user}
                userIndex={i}
                setUsers={setUsers}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
