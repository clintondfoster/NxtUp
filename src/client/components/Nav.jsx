import Nav from "react-bootstrap/Nav";
import { useLogoutMutation } from "../reducers/auth";
import Results from "../pages/Results";

function NavB() {

  const homeClick = () => {
    navigate("/home");
  };

  const [logout] = useLogoutMutation();
  


  return (
    <Nav defaultActiveKey="/home" as="ul">
      <Nav.Item >
        <Nav.Link href="/home">Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="#">Your Group</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={logout}>Logout</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default NavB;
