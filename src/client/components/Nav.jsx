import Nav from "react-bootstrap/Nav";
import { useLogoutMutation } from "../reducers/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { useGetCurrentUserQuery } from "../reducers/auth";

function NavB() {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [LogoutMessage, setLogoutMessage] = useState(false);

  // const { data: currentUser } = useGetCurrentUserQuery();

  // console.log("CurrentUser in navbar", currentUser);

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutMessage(true);
      setTimeout(() => {
        setLogoutMessage(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      console.err("Error logging out:", err);
    }
  };

  return (
    <div>
      {LogoutMessage && <div>You have successfully logged out.</div>}
      <Nav defaultActiveKey="/home" as="ul">
        <Nav.Item>
          <Nav.Link as={Link} to="/home">
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/account-settings">
            Account Settings
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default NavB;
