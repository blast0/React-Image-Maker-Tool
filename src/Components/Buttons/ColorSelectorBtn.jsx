import Dropdown from "react-bootstrap/Dropdown";
import { SketchPicker } from "react-color";
import TextInput from "../Input/text-input";
import { useState } from "react";
import { GradientProvider } from "../gradient-component/gradient-context";
import GradientPreview from "../gradient-component/gradient-preview/gradient-preview";
import GradientControls from "../gradient-component/gradient-controls/gradient-controls";

const ColorSelectorButton = (props) => {
  const {
    // name = "Button",
    // onBtnClick = () => {},
    buttons = [],
    onDropBtnClick = () => {},
    variant = "success",
    onChange = () => {},
    withInput = true,
    colorBoxWidth = "60px",
    colorBoxHeight = "27px",
    isGradientAllowed = false,
    onGradientChange = () => {},
    btnText,
    leftIcon,
    rightIcon,
    value,
    theme,
    label,
    config,
  } = props;

  const [color, setColor] = useState(value);
  const [gradient, setGradient] = useState("");
  const [gradientConfig, setGradientConfig] = useState(config);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("color");

  return (
    <div>
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
              onChange={(value) => {
                setColor(value);
                onChange(value, null);
              }}
            />
          ) : null}
          <Dropdown
            flip={true}
            onClick={() => {
              if (buttons.length === 0) {
                onDropBtnClick();
              }
            }}
            style={{
              border: theme === "light" ? "1px solid black" : "1px solid white",
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
              style={{
                width: colorBoxWidth,
                backgroundColor: color,
                height: colorBoxHeight,
              }}
              onClick={() => {
                setShow(!show);
              }}
            >
              {leftIcon ? <i className={"icon-common " + leftIcon}></i> : null}
              {btnText}
              {rightIcon ? (
                <i className={"icon-common " + rightIcon}></i>
              ) : null}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item key={"dropbtncolor"}> */}
              {type === "color" ? (
                <SketchPicker
                  onChange={(e) => {
                    const rgba =
                      "rgba(" +
                      e.rgb.r +
                      "," +
                      e.rgb.g +
                      "," +
                      e.rgb.b +
                      "," +
                      e.rgb.a +
                      ")";
                    setColor(rgba);
                    onChange(rgba, e);
                  }}
                  color={color}
                  width="230px"
                />
              ) : (
                <GradientProvider>
                  <GradientPreview
                    width={230}
                    height={150}
                    config={config}
                    value={gradient}
                  />
                  <div
                    className="controls-small slim-scroll"
                    style={{
                      marginBottom: "0 10px",
                    }}
                  >
                    <GradientControls
                      config={gradientConfig}
                      canChooseGradientType={true}
                      onControlValueChange={(value) => {
                        setGradient(value.gradient);
                        setGradientConfig(value.config);
                        onGradientChange({
                          config: value.config,
                          gradient: value.gradient,
                        });
                      }}
                    />
                  </div>
                </GradientProvider>
              )}
              {/* </Dropdown.Item> */}
              {isGradientAllowed ? (
                <Dropdown.Item
                  onClick={() => {
                    if (type === "color") setType("gradient");
                    else setType("color");
                  }}
                  key={"SwitchType"}
                >
                  {type === "color" ? "Use Gradient" : "Use Color"}
                </Dropdown.Item>
              ) : null}
            </Dropdown.Menu>
          </Dropdown>
        </>
      </div>
    </div>
  );
};

export default ColorSelectorButton;
