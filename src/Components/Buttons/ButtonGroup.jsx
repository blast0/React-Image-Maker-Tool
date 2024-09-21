import ButtonGroup from "react-bootstrap/ButtonGroup";
import IconButton from "./IconButton";

const ComboButton = (props) => {
  const { buttons, theme, onBtnClick, label, width } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: width ? width : "100%",
      }}
    >
      {label ? (
        <label
          style={
            theme !== "light"
              ? {
                  color: "#fff",
                }
              : {}
          }
          className="InputLabel"
        >
          {label}
        </label>
      ) : null}
      <ButtonGroup aria-label="Basic example">
        {buttons.map((button, index) => {
          return (
            <IconButton
              title={button.title}
              theme={theme}
              key={"btn" + index}
              leftIcon={button.leftIcon}
              btnText={button.btnText}
              rightIcon={button.rightIcon}
              variant="light"
              btnClick={() => {
                onBtnClick(button);
              }}
            />
          );
        })}
      </ButtonGroup>
    </div>
  );
};

export default ComboButton;
