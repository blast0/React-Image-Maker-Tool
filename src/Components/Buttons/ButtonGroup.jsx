import ButtonGroup from "react-bootstrap/ButtonGroup";
import IconButton from "./IconButton";

const ComboButton = (props) => {
  const { buttons, theme, onBtnClick } = props;
  return (
    <ButtonGroup
      aria-label="Basic example"
      style={{
        width: "100%",
        padding: "10px 0",
      }}
    >
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
  );
};

export default ComboButton;
