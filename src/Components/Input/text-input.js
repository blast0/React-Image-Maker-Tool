import React, { useRef, memo, forwardRef, useEffect } from "react";
import { noop, isEqual } from "lodash";
import { mergeRefs, copyToClipboard } from "../ImageEditor/helper-functions";

const TextInput = forwardRef((props, ref) => {
  const {
    label,
    tooltip,
    errMsg,
    suffix,
    containerClass,
    containerStyle,
    controlStyle,
    opt,
    showCopyButton,
    isValid,
    description,
    configKey,
    onChange,
    theme,
    ...inputOnlyProps
  } = props;
  const textInputRef = useRef(null);
  const descriptionRef = useRef(null);

  const containerStyles = {
    width: opt?.fullWidth
      ? "100%"
      : opt?.containerWidth
      ? opt?.containerWidth
      : "",
    ...containerStyle,
  };

  const controlStyles = {
    width: opt?.controlWidth ? opt?.controlWidth : "100%",
    border: isValid === false ? "1px solid #a51c1c" : "",
    borderLeft: isValid === false ? "10px solid #a51c1c" : "",
    ...controlStyle,
  };

  useEffect(() => {
    if (description) {
      descriptionRef.current.innerHTML = description;
    }
  }, [description]);
  console.log(theme, props);
  return (
    <div
      className={`control-wrapper ${containerClass ?? ""}`}
      style={{ ...containerStyles }}
      title={tooltip ? tooltip : label}
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
      {description ? <p className="Title" ref={descriptionRef}></p> : null}
      <div className="TextInput">
        <input
          ref={mergeRefs(textInputRef, ref)}
          style={{
            ...controlStyles,
          }}
          onChange={(e) => onChange(e.target.value, configKey)}
          {...inputOnlyProps}
          placeholder={opt?.placeholder}
        />
        {suffix ? <span className="ml-1 p-absolute">{suffix}</span> : null}
        {showCopyButton ? (
          <button
            className="text-copy-button"
            onClick={() => {
              copyToClipboard(textInputRef.current.value);
            }}
          >
            <i className="icon-copy"></i>
          </button>
        ) : null}
      </div>
      {isValid === false ? (
        <div style={{ width: "100%", color: "#a51c1c" }}>
          {errMsg ? errMsg : "This " + label + " is  Invalid"}
        </div>
      ) : null}
    </div>
  );
});

const makeNumeric = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return <WrappedComponent type="number" {...this.props} />;
    }
  };
};

const NumericInput = memo(makeNumeric(TextInput), isEqual);

NumericInput.defaultProps = {
  suffix: "",
  value: "",
  isValid: true,
  description: "",
  onChange: noop,
};

export default memo(TextInput, isEqual);
export { NumericInput };
