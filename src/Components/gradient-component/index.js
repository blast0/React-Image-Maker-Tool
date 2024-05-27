import React, { Component } from "react";
import GradientContext from "./gradient-context";
import { noop } from "lodash";
import PropTypes from "prop-types";
import ColorSelectorButton from "../Buttons/ColorSelectorBtn";

class GradientMaker extends Component {
  static contextType = GradientContext;
  constructor(props) {
    super(props);
    this.state = {
      switchToColor: props.config.colorStops.length < 2 ? true : false,
    };
  }

  render() {
    const {
      config,
      // previewHeight,
      // previewWidth,
      onGradientChange,
      opt,
      label,
      containerClass,
      containerStyle,
      controlStyle,
      // canChooseGradientType,
      isGradientAllowed,
      value,
      theme,
    } = this.props;
    const containerStyles = {
      width: opt?.fullWidth
        ? "100%"
        : opt?.containerWidth
        ? opt?.containerWidth
        : "100%",
      ...containerStyle,
    };

    const controlStyles = {
      width: opt?.controlWidth ? opt?.controlWidth : "100%",
      ...controlStyle,
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "column",
    };
    return (
      <div
        className={`control-wrapper GradientMaker canvas-parent ${
          containerClass ?? ""
        }`}
        style={{ ...containerStyles }}
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
        <div style={{ ...controlStyles }}>
          <ColorSelectorButton
            // theme={theme}
            onGradientChange={onGradientChange}
            onChange={(color) => {
              onGradientChange({
                config: {
                  colorStops: [
                    {
                      color,
                      offset: 10,
                    },
                  ],
                  type: "linear",
                  angle: 45,
                },
                gradient: color,
              });
            }}
            value={value}
            gradient={value}
            config={config}
            isGradientAllowed={isGradientAllowed}
          />
        </div>
      </div>
    );
  }
}

GradientMaker.defaultProps = {
  previewHeight: 120,
  previewWidth: 200,
  onGradientChange: noop,
  opt: {},
  containerStyle: {},
  controlStyle: {},
  canChooseGradientType: true,
  isGradientAllowed: true,
  showSiteColorBtn: false,
};

GradientMaker.propTypes = {
  previewHeight: PropTypes.number,
  previewWidth: PropTypes.number,
  onGradientChange: PropTypes.func,
  opt: PropTypes.object,
  containerStyle: PropTypes.object,
  controlStyle: PropTypes.object,
  canChooseGradientType: PropTypes.bool,
};

export default GradientMaker;
