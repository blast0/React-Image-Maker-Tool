import React, { useContext } from "react";
import PropTypes from "prop-types";
import { RadioButtonContext } from "../radio-button-group";

const RadioButton = (props) => {
  // excluding `name` from passed props
  const { name, inline, ...restProps } = props;
  const parentProps = useContext(RadioButtonContext);
  return (
    <label
      id="radio-button"
      className={`form-radio ${parentProps?.inline ? "form-inline" : null}`}
    >
      <input type="radio" name={parentProps?.groupId} {...restProps} />
      <i className="form-icon"></i>
      {props.label}
    </label>
  );
};

RadioButton.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inline: PropTypes.bool,
};

RadioButton.defaultProps = {
  inline: false,
};

export default RadioButton;
