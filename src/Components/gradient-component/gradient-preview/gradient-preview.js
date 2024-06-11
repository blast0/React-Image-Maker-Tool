import React, { Component } from "react";
import { noop } from "lodash";
import PropTypes from "prop-types";
// CSS
import "./gradient-preview.css";

class GradientPreview extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.canRef = React.createRef();
  }

  render() {
    const { height, value, width } = this.props;
    return (
      <div
        className="GradientPreview"
        style={{
          height,
          width: width ? width : "100%",
          minWidth: "217px",
          display: "flex",
          justifyContent: "center",
          background: value,
          border: "1px solid #bababa",
          borderRadius: "3px",
        }}
      ></div>
    );
  }
}
GradientPreview.defaultProps = {
  canvasId: "canvas",
  height: 280,
  width: 280,
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
  onCanvasInit: noop,
};

GradientPreview.propTypes = {
  canvasId: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  config: PropTypes.object,
};

export default GradientPreview;
