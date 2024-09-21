import Accordion from "react-bootstrap/Accordion";

function AlwaysOpenExample({ header, children, theme }) {
  return (
    <Accordion
      defaultActiveKey={["0"]}
      alwaysOpen
      style={{
        marginBottom: "10px",
      }}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header
          style={{
            width: "270px",
          }}
        >
          {header}
        </Accordion.Header>
        <Accordion.Body
          style={{
            padding: "10px 2px",
            backgroundColor: theme === "dark" ? "rgb(33, 37, 41)" : "#fff",
          }}
        >
          {children}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AlwaysOpenExample;
