import React, { Component } from "react";
class ColorBox extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="ColorBox"
        style={{
          background: this.props.color,
          width: "20px",
          height: "20px",
          borderRadius: "2px",
          cursor: "pointer",
        }}
      ></div>
    );
  }
}

export default ColorBox;
