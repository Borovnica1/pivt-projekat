import { useState, useEffect } from "react";
import { Alert, Badge, Button } from "react-bootstrap";
import { api } from "../../../api/api";
import IManager from "../../../models/IManager.model";

interface IAdminManagerListRowProperties {
  manager: IManager;
  managerIndex: number;
  setManagers: React.Dispatch<React.SetStateAction<IManager[]>>;
}

export default function AdminManagerList() {
  const [managers, setManagers] = useState<IManager[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function AdminManagerListRow(props: IAdminManagerListRowProperties) {
    function changeManagerStatus() {
      api("put", "/api/manager/" + props.manager.managerId, "administrator", {
        isActive: !props.manager.isActive,
      }).then((res) => {
        if (res.status === "error") {
          setErrorMessage(res.data);
        } else {
          const managersWithChangedStatus = managers.map((manager, i) => {
            if (i === props.managerIndex) {
              manager["isActive"] = !props.manager.isActive ? 1 : 0;
              return manager;
            }
            return manager;
          });

          setErrorMessage("");
          props.setManagers(managersWithChangedStatus);
        }
      });
    }

    return (
      <tr>
        <td>{props.manager.managerId}</td>
        <td>
          <div className="input-group">
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.manager.username}
              readOnly={true}
              style={{cursor: "default"}}
            />
          </div>
        </td>
        <td style={{ verticalAlign: "middle", textAlign: "center" }}>
          {props.manager.isActive ? (
            <Badge bg="success">Active</Badge>
          ) : (
            <Badge bg="danger">Not Active</Badge>
          )}
        </td>
        <td>
          {props.manager.isActive ? (
            <Button variant="danger" onClick={(e) => changeManagerStatus()}>
              Deactive
            </Button>
          ) : (
            <Button variant="success" onClick={(e) => changeManagerStatus()}>
              Activate
            </Button>
          )}
        </td>
      </tr>
    );
  }

  const loadManagers = () => {
    api("get", "/api/manager", "administrator")
      .then((apiResponse) => {
        if (apiResponse.status === "ok") {
          return setManagers(apiResponse.data);
        }

        throw { message: "Unknown error while loading managers..." };
      })
      .catch((error) => {
        setErrorMessage(
          error?.message ?? "Unknown error while loading managers..."
        );
      });
  };

  useEffect(() => {
    loadManagers();
  }, []);

  return (
    <div>
      {errorMessage && (
        <Alert key="danger" variant="danger">
          Error: {errorMessage}
        </Alert>
      )}
      <div>
        <table className="table table-bordered table-striped table-hover table-sm mt-3">
          <thead>
            <tr>
              <th className="location-row-id">ID</th>
              <th>Username</th>
              <th>Account Status</th>
              <th className="location-row-options">Options</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager, i) => (
              <AdminManagerListRow
                key={"manager-row-" + manager.managerId}
                manager={manager}
                managerIndex={i}
                setManagers={setManagers}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
