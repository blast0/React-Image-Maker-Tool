import React, { Component } from "react";
import GradientPreview from "./gradient-preview";
import GradientContext from "../gradient-context";
import PropTypes from "prop-types";

class GradientPreviewWithContext extends Component {
  static contextType = GradientContext;

  render() {
    const { height, width, config, value } = this.props;
    return (
      <div className="canvas-parent">
        <GradientPreview
          width={width}
          height={height}
          config={config}
          value={value}
          onCanvasInit={(ref) => {
            this.props.onCanvasInit(ref);
          }}
        />
      </div>
    );
  }
}

GradientPreviewWithContext.defaultProps = {
  height: 100,
  width: 100,
  config: {
    colorStops: [
      {
        color: "rgba(252, 165, 241, 1)",
        offset: 10,
      },
      {
        color: "rgba(181, 255, 255, 1)",
        offset: 70,
      },
    ],
    type: "linear",
    angle: 45,
  },
  value:
    "linear-gradient(45deg, rgba(252, 165, 241, 1) 10%,rgba(181,255,255,1) 70%",
};

GradientPreviewWithContext.proptypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  config: PropTypes.object,
};

export default GradientPreviewWithContext;
