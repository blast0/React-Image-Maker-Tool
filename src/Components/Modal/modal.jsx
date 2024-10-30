import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import IconButton from "../Buttons/IconButton";

function ModalApp(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { children, onBtnClick, leftIcon, theme, footerChildren } = props;
  return (
    <>
      <IconButton btnClick={handleShow} leftIcon={leftIcon} variant={theme} />
      <Modal onHide={handleClose} show={show} backdrop="static" keyboard={true}>
        <Modal.Header
          style={{
            backgroundColor: theme === "dark" ? "black" : "white",
          }}
        >
          <Modal.Title
            style={{
              color: theme !== "dark" ? "black" : "white",
            }}
          >
            Save Canvas
          </Modal.Title>
          <IconButton
            btnClick={handleClose}
            leftIcon={"icon-close"}
            variant="light"
          />
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: theme === "dark" ? "black" : "white",
          }}
        >
          {children}
        </Modal.Body>
        {footerChildren ? (
          footerChildren
        ) : (
          <Modal.Footer
            style={{
              backgroundColor: theme === "dark" ? "black" : "white",
            }}
          >
            <>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  onBtnClick();
                  setShow(false);
                }}
                variant="primary"
              >
                ok
              </Button>
            </>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

Modal.defaultProps = {
  variant: "light",
};

export default ModalApp;
