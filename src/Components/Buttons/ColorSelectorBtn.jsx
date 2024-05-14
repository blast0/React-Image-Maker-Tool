import Dropdown from "react-bootstrap/Dropdown";
import ColorSelector from "../ColorSelector";
import TextInput from "../Input/text-input";
import { useState } from "react";

const ColorSelectorButton = (props) => {
  const {
    btnText,
    leftIcon,
    rightIcon,
    buttons,
    onDropBtnClick,
    variant,
    value,
    onChange,
    withInput,
    theme,
    label,
  } = props;
  const [color, setColor] = useState(value);
  const [show, setShow] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <>
        {withInput ? (
          <TextInput
            theme={theme}
            style={{
              width: "100%",
              height: "31px",
            }}
            value={color}
            onClick={() => {
              onDropBtnClick();
            }}
            label={label}
            onChange={(value) => {
              setColor(value);
              onChange(value);
            }}
          />
        ) : null}
        <Dropdown
          onClick={() => {
            if (buttons.length === 0) {
              onDropBtnClick();
            }
          }}
          style={{
            border: "1px solid white",
            cursor: "pointer",
            display: "flex",
          }}
          show={show}
          autoClose={true}
          onToggle={(toggle, synEvent) => {
            if (synEvent.source === "rootClose") setShow(!show);
          }}
        >
          <Dropdown.Toggle
            as={"div"}
            variant={variant}
            bsPrefix="color-dd"
            id="dropdown-basic"
            style={{ width: "60px", backgroundColor: color, height: "28px" }}
            onClick={() => {
              setShow(!show);
            }}
          >
            {leftIcon ? <i className={"icon-common " + leftIcon}></i> : null}
            {btnText}
            {rightIcon ? <i className={"icon-common " + rightIcon}></i> : null}
          </Dropdown.Toggle>
          {/* {buttons.length > 0 ? ( */}
          <Dropdown.Menu style={{}}>
            <Dropdown.Item
              href="#/action"
              onClick={() => {
                // onDropBtnClick();
              }}
              key={"dropbtncolor"}
            >
              <ColorSelector
                value={color}
                previewWidth={200}
                onChange={(e) => {
                  console.log(e);
                  onChange(e);
                  setColor(e);
                }}
              />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    </div>
  );
};
ColorSelectorButton.defaultProps = {
  name: "Button",
  buttons: [],
  onBtnClick: () => {},
  onDropBtnClick: () => {},
  variant: "success",
  onChange: () => {},
  withInput: true,
};
export default ColorSelectorButton;
