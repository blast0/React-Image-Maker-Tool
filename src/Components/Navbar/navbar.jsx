import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import IconButton from "../Buttons/IconButton";
import { useState } from "react";

function NavbarApp({ themed, themes, onThemeChange }) {
  const [theme, setTheme] = useState(themed);
  console.log(theme);
  return (
    <>
      <Navbar
        style={
          theme === "light"
            ? {
                borderBottom: "1px solid #a1a1a1",
              }
            : {
                borderBottom: "1px solid white",
              }
        }
        bg={theme}
        data-bs-theme={theme}
      >
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#pricing">theme</Nav.Link>
          </Nav>
        </Container>
        <div
          style={{
            margin: "10px",
          }}
          onClick={() => {
            if (theme === "light") {
              setTheme("dark");
              onThemeChange("dark");
            } else {
              setTheme("light");
              onThemeChange("light");
            }
          }}
        >
          <IconButton
            variant={theme === "light" ? "light" : "dark"}
            leftIcon={theme === "light" ? "icon-moon" : "icon-sun"}
          />
        </div>
      </Navbar>
    </>
  );
}

NavbarApp.defaultProps = {
  themed: "light",
  themes: ["light", "dark", "primary"],
};

export default NavbarApp;
