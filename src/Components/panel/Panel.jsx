import { useState } from "react";
// import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const OffCanvasExample = ({ name, children, theme, ...props }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "85px",
          left: `calc(100% - ${show ? "428px" : "30px"})`,
          height: "60px",
          width: "30px",
          // backgroundColor: "#fff",
          // backgroundColor: theme === "light" ? "#fff" : "#212529",
          color: theme !== "light" ? "#fff" : "#212529",
          border: "1px solid #989898",
          borderRadius: "5px 0 0 5px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center ",
          transition: `left 150ms ease-in`,
        }}
        onClick={() => setShow(!show)}
      >
        <i className={`icon-common ${show ? "icon-right" : "icon-left"}`}></i>
      </div>
      <Offcanvas backdrop={false} show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header>
          <Offcanvas.Title>{children}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export const Panel = ({ direction, name, children, theme }) => {
  return (
    <OffCanvasExample
      children={children}
      key={name}
      placement={direction}
      name={name}
      theme={theme}
      style={{
        top: "75px",
        backgroundColor: theme === "light" ? "#fff" : "#212529",
        borderLeft: theme === "light" ? "1px solid #a1a1a1" : "1px solid #fff",
      }}
    />
  );
};
