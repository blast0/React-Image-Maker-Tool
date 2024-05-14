import React, { useEffect, useRef } from "react";
import TextInput from "../Components/Input/text-input";
import { useState } from "react";
import { convertGradientToConfig } from "./utilities";
import GradientMakerWithPopup from "./gradient-maker-with-popup";
const GradientMakerWithInput = ({
  label,
  opt,
  tooltip,
  containerStyle,
  containerClass,
  gradientText,
  value,
  description,
  controlStyle,
  onValueChange,
  canChooseGradientType,
  ...restProps
}) => {
  const descriptionRef = useRef(null);
  const [gradient, setGradient] = useState(value);

  useEffect(() => {
    if (description) {
      descriptionRef.current.innerHTML = description;
    }
  }, [description]);

  const containerStyles = {
    width: opt?.fullWidth
      ? "100%"
      : opt?.containerWidth
      ? opt?.containerWidth
      : "",
    ...containerStyle,
  };

  const controlStyles = {
    width: opt?.controlWidth ? opt?.controlWidth : "",
    ...controlStyle,
  };

  console.log("the", restProps?.theme);

  return (
    <>
      <div
        className={`control-wrapper ${containerClass ?? ""}`}
        style={{ ...containerStyles }}
        title={tooltip ? tooltip : label}
      >
        {description ? <p className="Title" ref={descriptionRef}></p> : null}
        <div className="GradientMakerWithInput" style={{ ...controlStyles }}>
          <TextInput
            label={label}
            containerStyle={{ padding: "0" }}
            controlStyle={{ border: "none", textAlign: "center" }}
            value={gradient}
            theme={restProps?.theme}
            onChange={(value) => {
              setGradient(value);
            }}
            title={value}
          />

          <GradientMakerWithPopup
            {...restProps}
            onValueChange={(val) => {
              setGradient(val.gradient);
              onValueChange(val);
            }}
            value={gradient}
            config={convertGradientToConfig(gradient)}
            controlStyle={{
              width: "35px",
              height: "18px",
              marginRight: "4px",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            switchToColor={restProps.switchToColor}
            canChooseGradientType={canChooseGradientType}
          />
        </div>
      </div>
    </>
  );
};
export default GradientMakerWithInput;
