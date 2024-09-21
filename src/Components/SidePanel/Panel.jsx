import { useState } from "react";
import Spinner from "../Spinner/spinner";
import Offcanvas from "react-bootstrap/Offcanvas";

const OffCanvasExample = ({
  name,
  headerChildren,
  bodyChildren,
  theme,
  ...props
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "85px",
          left: `calc(100% - ${show ? "328px" : "30px"})`,
          height: "60px",
          width: "30px",
          backgroundColor: theme === "light" ? "#fff" : "#212529",
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
      <Offcanvas
        backdrop={false}
        enforceFocus={false}
        show={show}
        onHide={handleClose}
        {...props}
      >
        <Offcanvas.Header>
          <Offcanvas.Title
            style={{
              width: "100%",
            }}
          >
            {headerChildren}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            scrollbarWidth: "thin",
            borderTop: "1px solid #989898",
          }}
        >
          <Spinner id="root" overlayProps={{ position: "fixed" }} />
          {bodyChildren}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export const Panel = ({
  direction,
  name,
  headerChildren,
  bodyChildren,
  theme,
}) => {
  return (
    <OffCanvasExample
      headerChildren={headerChildren}
      key={name}
      placement={direction}
      bodyChildren={bodyChildren}
      name={name}
      theme={theme}
      style={{
        top: "67px",
        width: "300px",
        backgroundColor: theme === "light" ? "#fff" : "#212529",
        borderLeft: theme === "light" ? "1px solid #a1a1a1" : "1px solid #fff",
      }}
    />
  );
};
