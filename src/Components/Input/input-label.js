import React from "react";

function InputLabel(props) {
  const { containerClass, containerStyle, opt, text, ...restProps } = props;

  const containerStyles = {
    width: opt?.containerWidth ? opt?.containerWidth : null,
    ...containerStyle,
  };

  return (
    <div
      className={`control-wrapper ${containerClass ?? ""}`}
      style={{ ...containerStyles }}
    >
      <div className="InputLabel">
        <label {...restProps}>{text}</label>
      </div>
    </div>
  );
}

export default InputLabel;
