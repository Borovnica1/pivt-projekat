import { useState } from "react";
import { Link } from "react-router-dom";
import AuthStore from "../../stores/AuthStore";
import MenuAdministrator from "./MenuAdministrator";
import MenuManager from "./MenuManager";
import MenuUser from "./MenuUser";
import MenuVisitor from "./MenuVisitor";

export default function Menu() {
  const [role, setRole] = useState<
    "visitor" | "user" | "manager" | "administrator"
  >(AuthStore.getState().role);

  AuthStore.subscribe(() => {
    setRole(AuthStore.getState().role);
  });

  return (
    <div style={{ marginBottom: "10px" }}>
      {role === "visitor" && <MenuVisitor />}
      {role === "user" && <MenuUser />}
      {role === "manager" && <MenuManager />}
      {role === "administrator" && <MenuAdministrator />}
    </div>
  );
}
