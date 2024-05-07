import React, { Component } from "react";
import { fabric } from "fabric";
import TextInput, { NumericInput } from "../../Input/text-input";
// CONSTANTS
import {
  ACTIONS,
  // OPEN_OPTIONS,
  // ADD_SHAPE_OPTIONS,
  // SAVE_OPTIONS,
  // DELETE_OPTIONS,
} from "../constants";
import DropdownButton from "../../Buttons/DropdownBtn";
// import ModalApp from "../modal/modal";
// import IconButton from "../buttons/ButtonIcon";
// COMPONENTS
import ActiveElementControls from "./activeControls";

class Canvastools extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleJsonData = this.props.handleJsonData.bind(this);
  }

  deleteHandler(option) {
    if (option === "clear-page") {
      this.props.onChange(ACTIONS.CLEAR_PAGE);
    } else if (option === "selected-item") {
      this.props.onChange(ACTIONS.DELETE_SELECTION);
    }
  }

  createConfiguratorData() {
    const { pageHeight, pageWidth, canvas, pageBgColor } = this.props;
    const activeElem = canvas?.getActiveObject();
    let data = {
      width: {
        label: "Canvas Width",
        type: "number",
        value: pageWidth,
        containerClass: "sm",
      },
      height: {
        label: "Canvas Height",
        type: "number",
        value: pageHeight,
        containerClass: "sm",
      },
      background: {
        label: "Canvas Background:",
        opt: {
          showInput: true,
          controlWidth: "100%",
        },
        type: "color",
        showInPopup: true,
        value: pageBgColor,
        containerClass: "sm",
      },
    };
    let label = "Object";
    if (activeElem?.type === "rect") label = "Rectangle";
    else if (activeElem?.type === "triangle") label = "Triangle";
    else if (activeElem?.type === "line") label = "Line";
    else if (activeElem?.type === "circle") label = "Circle";
    if (activeElem?.patternActive) label = "Img Container";
    let types = ["rect", "triangle", "line", "Image"];
    if (activeElem && activeElem?.customType === "SpeechBubble") {
      const textBoxWidth = {
        Speechwidth: {
          label: "Object Width",
          type: "number",
          value: parseInt(
            activeElem._objects[1].lastWidth +
              2 * activeElem._objects[1].polyPadding
          ),
          containerClass: "sm",
        },
      };
      data = {
        ...data,
        ...textBoxWidth,
      };
    }
    if (activeElem && types.includes(activeElem?.type)) {
      const extraControls = {
        Owidth: {
          label: label + " Width",
          type: "number",
          value: parseInt(activeElem.width),
          containerClass: "sm",
        },
        Oheight: {
          label: label + " Height",
          type: "number",
          value: parseInt(activeElem.height),
          containerClass: "sm",
        },
      };
      data = {
        ...data,
        ...extraControls,
      };
    }
    if (activeElem) {
      const extraControls = {
        left: {
          label: label + " Left",
          type: "number",
          value: parseInt(activeElem.left),
          containerClass: "sm",
        },
        top: {
          label: label + " Top",
          type: "number",
          value: parseInt(activeElem.top),
          containerClass: "sm",
        },
      };
      data = {
        ...data,
        ...extraControls,
      };
    }
    return data;
  }

  updateDimension(data) {
    let keys = Object.keys(data);
    const { pageHeight, pageWidth, canvas, onChange } = this.props;
    const activeElem = canvas.getActiveObject();
    keys.forEach((key) => {
      if (key === "width") {
        if (data[key]["value"] !== pageWidth) {
          onChange(ACTIONS.CHANGE_PAGE_DIMENSIONS, {
            name: "width",
            val: parseInt(data[key]["value"]),
          });
        }
      } else if (key === "height") {
        if (data[key]["value"] !== pageHeight) {
          onChange(ACTIONS.CHANGE_PAGE_DIMENSIONS, {
            name: "height",
            val: parseInt(data[key]["value"]),
          });
        }
      } else if (key === "Owidth") {
        if (data[key]["value"] !== activeElem.width && data[key]["value"] > 0) {
          activeElem.set({
            width: parseInt(data[key]["value"]),
          });
          canvas.renderAll();
        }
      } else if (key === "Oheight") {
        if (data[key]["value"] !== activeElem.width && data[key]["value"] > 0) {
          activeElem.set({
            height: parseInt(data[key]["value"]),
          });
          canvas.renderAll();
        }
      } else if (key === "left") {
        activeElem.set("left", parseInt(data[key]["value"]));
        canvas.renderAll();
      } else if (key === "top") {
        activeElem.set("top", parseInt(data[key]["value"]));
        canvas.renderAll();
      } else if (key === "background") {
        onChange(ACTIONS.CHANGE_PAGE_BACKGROUND, data[key]["value"]);
      } else if (key === "Speechwidth") {
        canvas.offHistory();
        const elem = canvas.getActiveObject();
        const textBox = elem?._objects?.[1];
        const newWidth = data[key]["value"] - 2 * textBox.polyPadding;
        const widthDiff = newWidth - textBox.width;
        textBox.lastWidth = data[key]["value"] - 2 * textBox.polyPadding;
        if (newWidth > 19) {
          elem.toActiveSelection();
          canvas.setActiveObject(textBox);
          textBox.width = newWidth;
          const lastHeight = textBox.height;
          canvas.renderAll();
          const heightDiff = textBox.height - lastHeight;
          this.handlePolygonResizeOnTextBoxSizeChange(
            textBox,
            canvas,
            widthDiff,
            heightDiff
          );
          this.handleSpeechPolyRegroup(canvas, elem.isLabel, elem.arrow);
        }
        canvas.onHistory();
      }
    });
  }

  handlePolygonResizeOnTextBoxSizeChange(
    target,
    _canvas,
    widthDiff,
    heightDiff
  ) {
    const SpeechText = target;
    const SpeechPoly = _canvas.getObjects().find((item) => {
      return (
        item?.name === "SpeechPoly" && item.bubbleId === SpeechText.bubbleId
      );
    });
    SpeechPoly.points.forEach((point, index) => {
      if (index > 3 && index < 9) {
        SpeechPoly.points[index].x += widthDiff;
      }
      if (index > 0 && index < 4) {
        SpeechPoly.points[index].x += widthDiff / 2;
      }
      if (index > 8 && index < 12) {
        SpeechPoly.points[index].x += widthDiff / 2;
      }
      if (index > 7 && index < 13) {
        SpeechPoly.points[index].y += heightDiff;
      }
    });
    SpeechPoly.set({
      width: SpeechPoly.width + widthDiff,
      height: SpeechPoly.height + heightDiff,
      pathOffset: new fabric.Point(
        SpeechPoly.pathOffset.x + widthDiff / 2,
        SpeechPoly.pathOffset.y + heightDiff / 2
      ),
    }).setCoords();
  }

  handleSpeechPolyRegroup(_canvas, isLabel, arrow) {
    const SpeechPoly = _canvas.getObjects().find((item) => {
      return item.name === "SpeechPoly";
    });
    if (!SpeechPoly) return;
    const SpeechText = _canvas.getObjects().find((item) => {
      return (
        item.name === "Speechtext" && item.bubbleId === SpeechPoly.bubbleId
      );
    });
    const SpeechBubble = new fabric.Group([SpeechPoly, SpeechText], {
      customType: "SpeechBubble",
      name: SpeechPoly.bubbleName,
      bubbleId: SpeechPoly.bubbleId,
      subTargetCheck: true,
      polyColor: SpeechPoly.fill,
      polyBorderColor: SpeechPoly.stroke,
      textBgColor: SpeechText.backgroundColor,
      textColor: SpeechText.fill,
      strokeSize: SpeechPoly.strokeWidth,
      isLabel,
      arrow,
    });
    _canvas.offHistory();
    _canvas.remove(SpeechPoly);
    _canvas.remove(SpeechText);
    _canvas.add(SpeechBubble);
    _canvas.setActiveObject(SpeechBubble);
    SpeechBubble.setCoords();
    _canvas.onHistory();
  }

  render() {
    const {
      activeElementProps,
      showStyleEditor,
      onChange,
      elementIds,
      canvas,
      selectedElementName,
      elementsDropDownData,
      jsonRef,
      // siteColorsSettings,
      pageWidth,
      pageHeight,
      theme,
    } = this.props;
    console.log(theme);
    const activeElementType = canvas?.getActiveObject()?.type;
    const activeElem = canvas.getActiveObject();
    return (
      <div className="DesignerConfigPanel">
        <input
          ref={jsonRef}
          className="hidden-file"
          type="file"
          accept="image/svg"
          onChange={this.handleJsonData}
        />{" "}
        <input
          ref={jsonRef}
          className="hidden-file"
          type="file"
          accept="image/svg"
          onChange={this.handleJsonData}
        />
        <div className="page-dimensions mt-10">
          <div className="page-dimensions-control">
            <NumericInput
              theme={theme}
              value={pageWidth}
              containerClass="cls number sm"
              label="Canvas Width"
              onChange={(val) => {
                if (val < 1920)
                  onChange(ACTIONS.CHANGE_PAGE_DIMENSIONS, {
                    name: "width",
                    val: Number(val),
                  });
                else {
                  onChange(ACTIONS.CHANGE_PAGE_DIMENSIONS, {
                    name: "width",
                    val: 1920,
                  });
                }
              }}
            />
            <NumericInput
              theme={theme}
              // key={`elem-${configKey}`}
              // configKey={configKey}
              value={pageHeight}
              // containerStyle={item?.containerStyle}
              // controlStyle={item?.controlStyle}
              containerClass={"cls number sm"}
              // tooltip={item.tooltip}
              // opt={item?.opt}
              label="Canvas Height"
              onChange={(val) => {
                if (val < 1080)
                  onChange(ACTIONS.CHANGE_PAGE_DIMENSIONS, {
                    name: "height",
                    val: Number(val),
                  });
                else {
                  onChange(ACTIONS.CHANGE_PAGE_DIMENSIONS, {
                    name: "height",
                    val: 1080,
                  });
                }
              }}
            />
            <NumericInput
              theme={theme}
              value={parseInt(activeElem?.width)}
              containerClass={"cls number "}
              label={"Item Width"}
              onChange={(val) => {
                activeElem.set({
                  width: Number(val),
                });
                canvas.renderAll();
              }}
            />
            <NumericInput
              theme={theme}
              value={parseInt(activeElem?.height)}
              containerClass={"cls number "}
              label={"Item Height"}
              onChange={(val) => {
                activeElem.set({
                  height: Number(val),
                });
                canvas.renderAll();
              }}
            />
          </div>
        </div>
        <div className="element-selector">
          <DropdownButton
            leftIcon={true}
            btnText={"Selected: " + selectedElementName}
            variant="light"
            buttons={elementsDropDownData}
            onDropBtnClick={(option) => {
              const selected = elementsDropDownData.find(
                (el) => el.value === option.value
              );
              onChange(ACTIONS.UPDATE_ACTIVE_ELEMENT, {
                id: selected?.value,
                name: selected?.name,
              });
            }}
          />
        </div>
        {activeElementType !== "activeSelection" &&
        activeElementType !== "polygon" &&
        activeElementType !== "textbox" ? (
          <div
            className="elementName"
            style={{
              width: "100%",
            }}
          >
            {/* <label>Element Name:</label>
            <input
              style={{
                width: "100%",
                height: "31px",
              }}
              placeholder="Element Name"
              value={selectedElementName ? selectedElementName : ""}
              onChange={(el) => {
                const elem = canvas.getActiveObject();
                if (elem) {
                  elem.customName = true;
                  elem.changeName = el.target.value;
                  onChange(ACTIONS.ELEMENT_NAME, el);
                }
              }}
            /> */}
            <TextInput
              theme={theme}
              style={{
                width: "100%",
                height: "31px",
              }}
              value={selectedElementName ? selectedElementName : ""}
              label="Element Name:"
              onChange={(el) => {
                const elem = canvas.getActiveObject();
                if (elem) {
                  elem.customName = true;
                  elem.changeName = el.target.value;
                  onChange(ACTIONS.ELEMENT_NAME, el);
                }
              }}
            />
          </div>
        ) : null}
        {showStyleEditor ? (
          <ActiveElementControls
            theme={theme}
            canvas={canvas}
            elementIds={elementIds}
            activeElementProps={activeElementProps}
            selectedElementName={selectedElementName}
            elementsDropDownData={elementsDropDownData}
            onActiveElementPropsChange={(props) => {
              onChange(ACTIONS.CHANGE_ACTIVE_ELEMENT_PROPS, props);
            }}
            onChange={(action, data) => {
              onChange(action, data);
            }}
          />
        ) : null}
      </div>
    );
  }
}

Canvastools.defaultProps = {
  elementsDropDownData: [],
};

export default Canvastools;
