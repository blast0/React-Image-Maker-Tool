import React from "react";
import PropTypes from "prop-types";

const RadioButtonContext = React.createContext(null);

const RadioButtonGroup = (props) => {
  return (
    <div className="form-group">
      <div className="form-label text-strong label-fix">{props.groupLabel}</div>
      <RadioButtonContext.Provider
        value={{ groupId: props.groupId, inline: props.inline }}
      >
        <div>{props.children}</div>
      </RadioButtonContext.Provider>
    </div>
  );
};

RadioButtonGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  groubLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inline: PropTypes.bool,
};

RadioButtonGroup.defaultProps = {
  inline: false,
};

export default RadioButtonGroup;
export { RadioButtonContext };
