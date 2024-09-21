import React, { Component } from "react";
// CONSTANTS
import { ACTIONS } from "../constants";
// COMPONENTS
import TextInput, { NumericInput } from "../../Input/text-input";
import DropdownButton from "../../Buttons/DropdownBtn";
import ColorSelectorButton from "../../Buttons/ColorSelectorBtn";
import ActiveElementControls from "./activeControls";
import { getObjectTypeIcon } from "../helper-functions";

class Canvastools extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleJsonData = this.props.handleJsonData.bind(this);
  }

  render() {
    const { canvas } = this.props;
    const activeElementType = canvas?.getActiveObject()?.type;
    const activeElement = canvas.getActiveObject();

    return <div></div>;
  }
}

Canvastools.defaultProps = {
  elementsDropDownData: [],
};

export default Canvastools;
