import React, { Component } from "react";
import { fabric } from "fabric";
import { noop } from "lodash";
import { NumericInput } from "../../Input/text-input";
import RangeSlider from "../../range-slider/index";
import ImageContainer from "../../ImageContainer/image-container";
// import
// {
//   ConfiguratorCore,
//   GradientContainer,
//   BorderRadius,
//   BoxShadowContainer,
// }
// "@attosol/react-ui-kit";
import {
  ACTIONS,
  RESET_ACTIVE_ELEM_PROPS,
  ALIGNMENT_OPTIONS,
  SPACE_EVENLY_OPTIONS,
  //   ArrowDirection,
  FONT_STYLES,
  TEXT_ALIGNMENT,
  FLIP_OPTIONS,
} from "../constants";
import {
  //   createNewPoly,
  //   getNewID,
  handlePatternFit,
  scaleElementTofitCanvas,
} from "../helper-functions";
import DropdownButton from "../../Buttons/DropdownBtn";
import {
  //   handleSelectedTool,
  //   handleSvgElem,
  getFrontDropdownData,
  //   getArrowHeadData,
  updateActiveElement,
  handlePatternSize,
  handlePatternPosition,
  //   handleShadow,
  //   handleRectBorderRadius,
  //   updateStyle,
  //   createConfiguratorData,
  makeGradient,
  setArrowHead,
  setfontfamily,
  handleFontStyle,
  //   setBubbleFontFamily,
} from "./activeElementHandlers";
import ComboButton from "../../Buttons/ButtonGroup";
import ColorSelectorButton from "../../Buttons/ColorSelectorBtn";
import GradientContainer from "../../gradient-container";
// CSS

class ActiveElementControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColorIndex: null,
      textBackgroundColor: "",
      error: {
        height: false,
        width: false,
      },
      objectHeight: 100,
      objectWidth: 100,
      patternAngle: props.canvas?.getActiveObject()?.patternAngle,
    };
    // refs
    this.colorBoxRef = React.createContext(null);
    // fn binds
  }

  render() {
    const {
      canvas,
      onChange,
      //   siteColorsSettings,
      activeElementProps,
      elementsDropDownData,
      theme,
    } = this.props;
    const activeElement = canvas.getActiveObject();

    // const ReplaceSpeechPolygon = (
    //   newPoints,
    //   newPolyLeft,
    //   newPolyTop,
    //   SpeechPoly,
    //   SpeechText,
    //   arrow,
    //   isLabel
    // ) => {
    //   const polyColor = activeElement.polyColor;
    //   const polyBorderColor = activeElement.polyBorderColor;
    //   let newPoly = new fabric.Polygon(newPoints, {
    //     left: newPolyLeft,
    //     top: newPolyTop,
    //     fill: polyColor,
    //     strokeWidth: SpeechPoly.strokeWidth,
    //     strokeLineJoin: SpeechPoly.strokeLineJoin,
    //     stroke: polyBorderColor,
    //     scaleX: 1,
    //     scaleY: 1,
    //     name: "SpeechPoly",
    //     customType: "SpeechPoly",
    //     polyPadding: SpeechPoly.polyPadding,
    //     objectCaching: false,
    //     bubbleId: SpeechPoly.bubbleId,
    //     hasBorders: false,
    //     bubbleName: SpeechPoly.name,
    //     dirty: false,
    //     arrow,
    //     id: getNewID(),
    //   });

    //   const SpeechBubble = new fabric.Group([newPoly, SpeechText], {
    //     customType: "SpeechBubble",
    //     name: SpeechPoly.bubbleName,
    //     bubbleId: SpeechPoly.bubbleId,
    //     subTargetCheck: true,
    //     polyColor: SpeechPoly.fill,
    //     polyBorderColor: SpeechPoly.stroke,
    //     textBgColor: SpeechText?.backgroundColor,
    //     textColor: SpeechText?.fill,
    //     strokeSize: SpeechPoly?.strokeWidth,
    //     arrow,
    //     isLabel,
    //   });
    //   canvas.remove(SpeechPoly);
    //   canvas.remove(SpeechText);
    //   canvas.add(SpeechBubble);
    //   canvas.setActiveObject(SpeechBubble);
    //   canvas.renderAll();
    //   canvas.onHistory();
    // };

    // const handleSpeechArrowChange = (value) => {
    //   const SpeechText = activeElement._objects?.[1];
    //   const SpeechPoly = activeElement._objects?.[0];
    //   const isLabel = activeElement.isLabel;
    //   const strokeWidth = activeElement.strokeWidth;
    //   canvas.offHistory();
    //   activeElement.toActiveSelection();
    //   canvas.setActiveObject(SpeechPoly);
    //   let result = createNewPoly(strokeWidth, SpeechText, value);
    //   let newPoints = result.newPoints;
    //   let newPolyTop = result.newPolyTop - 2;
    //   let newPolyLeft = result.newPolyLeft - 2;
    //   canvas.renderAll();
    //   ReplaceSpeechPolygon(
    //     newPoints,
    //     newPolyLeft,
    //     newPolyTop,
    //     SpeechPoly,
    //     SpeechText,
    //     value,
    //     isLabel
    //   );
    // };

    const patternImgController = (
      <ImageContainer
        theme={theme}
        label={"Fill Image"}
        value={!activeElementProps?.URL ? "" : activeElement?.URL}
        onChange={(url) => {
          onChange(ACTIONS.ADD_PATTERN, url);
        }}
        containerClass="cls image "
        opt={{
          mimeTypeExclusions: ["image/svg+xml"],
        }}
      />
    );

    const boxShadow = (
      //   <BoxShadowContainer
      //     showPreview={false}
      //     label={"Box Shadow"}
      //     value={
      //       activeElement?.boxShadow
      //         ? activeElement?.boxShadow
      //         : "#606060 0px 0px 5px"
      //     }
      //     tooltip={"Box Shadow"}
      //     showInPopup={false}
      //     opt={{ controlWidth: "100%", showInput: true }}
      //     containerClass={"box-shadow"}
      //     showCopyClipboard={false}
      //     showSpread={false}
      //     showTypeButton={false}
      //     onChange={(e) => {
      //       handleShadow(e, this, fabric);
      //     }}
      //   />
      <></>
    );

    const rectBorderRadius = (
      //   <BorderRadius
      //     onChange={(x, y, lock) => {
      //       if (lock !== activeElementProps?.BorderLock) {
      //         activeElement.BorderLock = lock;
      //       }
      //       handleRectBorderRadius(x, y, this);
      //     }}
      //     lock={activeElementProps?.BorderLock}
      //     showLockBtn={true}
      //     showInputBoxes={true}
      //     defaultValues={[
      //       {
      //         label: "BorderX",
      //         min: 0,
      //         max: Math.min(
      //           activeElementProps?.width,
      //           activeElementProps?.height
      //         ),
      //         value: activeElementProps?.rx,
      //       },
      //       {
      //         label: "BorderY",
      //         min: 0,
      //         max: Math.min(
      //           activeElementProps?.width,
      //           activeElementProps?.height
      //         ),
      //         value: activeElementProps?.ry,
      //       },
      //     ]}
      //   />
      <></>
    );

    const activeFontFamily = (
      <div className="font-family-control">
        <DropdownButton
          leftIcon={true}
          btnText={"Font Family: " + activeElement?.fontFamily}
          variant="light"
          buttons={getFrontDropdownData()}
          onDropBtnClick={(option) => {
            setfontfamily(option.value, this);
          }}
          btnHeight={"28px"}
        />
      </div>
    );

    const imageFit = (
      <div className="image-fit-control">
        <DropdownButton
          leftIcon={true}
          btnText={
            "Image Fit: " + activeElementProps?.patternActive
              ? activeElementProps.patternFit
              : activeElement?.imageFit
          }
          variant="light"
          buttons={[
            {
              btnText: activeElementProps?.patternActive
                ? "Contain: Show full image"
                : "Show full Image",
              value: activeElementProps?.patternActive
                ? "Contain: Show full image"
                : "Show full Image",
            },
            {
              btnText: activeElementProps?.patternActive
                ? "Cover: Fit image"
                : "Fit Image to boundary",
              value: activeElementProps?.patternActive
                ? "Cover: Fit image"
                : "Fit Image to boundary",
            },
          ]}
          onDropBtnClick={(option) => {
            if (activeElement.patternActive) {
              const newProps = handlePatternFit(
                option.value,
                canvas,
                activeElement
              );
              updateActiveElement(newProps, this);
            } else {
              scaleElementTofitCanvas(
                option.value,
                canvas.height,
                canvas.width,
                activeElement
              );
              updateActiveElement({ imageFit: option.value }, this);
              canvas.renderAll();
            }
          }}
          btnHeight={"28px"}
        />
      </div>
    );

    const activeArrowHead = (
      <DropdownButton
        leftIcon={true}
        btnText={"Arrow Head: " + activeElement?.fontFamily}
        variant="light"
        buttons={getFrontDropdownData()}
        onDropBtnClick={(option) => {
          //   setfontfamily(option.value, this);
          setArrowHead(option.value, this);
        }}
        btnHeight={"28px"}
      />
    );

    const activeBgColor = (
      <ColorSelectorButton
        theme={theme}
        label={
          activeElement instanceof fabric.IText
            ? "Text Background:"
            : "Background Color:"
        }
        onChange={(color) => {
          updateActiveElement({ backgroundColor: color }, this);
        }}
        value={activeElement?.backgroundColor}
      />
    );

    const SpeechBubbleControls = (
      <div className="bubble-controls">
        {/* {activeElement instanceof fabric.Group ? (
          <>
            <ColorContainer
              opt={{
                showInput: true,
                containerWidth: "calc(50% - 5px)",
                controlWidth: "100%",
              }}
              label="Fill Color:"
              showInPopup={true}
              color={activeElementProps?.polyColor}
              onChange={(color) => {
                activeElement._objects[0].set({
                  fill: color,
                });
                activeElement.polyColor = color;
                activeElement._objects[1].set({
                  backgroundColor: color,
                });
                activeElement.textBgColor = color;
                canvas.renderAll();
                updateActiveElement(
                  { polyColor: color, textBgColor: color },
                  this
                );
              }}
            />
            <ColorContainer
              opt={{
                showInput: true,
                containerWidth: "calc(50% - 5px)",
                controlWidth: "100%",
              }}
              label="Border Color:"
              showInPopup={true}
              color={activeElementProps?.polyBorderColor}
              onChange={(color) => {
                activeElement._objects[0].set({
                  stroke: color,
                });
                activeElement.polyBorderColor = color;
                canvas.renderAll();
                updateActiveElement({ polyBorderColor: color }, this);
              }}
            />
            <ColorContainer
              opt={{
                showInput: true,
                containerWidth: "calc(50% - 5px)",
                controlWidth: "100%",
              }}
              label="Text Color:"
              showInPopup={true}
              color={activeElementProps?.textColor}
              onChange={(color) => {
                activeElement._objects[1].set({
                  fill: color,
                });
                activeElement.textColor = color;
                canvas.renderAll();
                updateActiveElement({ textColor: color }, this);
              }}
            />
            <TextInput
              type={"number"}
              label={"Border Size:"}
              value={activeElementProps.strokeSize}
              opt={{
                containerWidth: "calc(50% - 5px)",
              }}
              onChange={(val) => {
                if (parseInt(val) >= 0) {
                  activeElement._objects[0].set({
                    strokeWidth: parseInt(val),
                  });
                  canvas.offHistory();
                  const objects = activeElement._objects;
                  objects[0].top +=
                    parseInt(activeElement.strokeSize - val) / 2;
                  objects[0].left +=
                    parseInt(activeElement.strokeSize - val) / 2;
                  const group = new fabric.Group(objects, {
                    name: activeElement.name,
                    bubbleId: activeElement.bubbleId,
                    subTargetCheck: true,
                    hasControls: false,
                    customType: "SpeechBubble",
                    left: activeElement.left,
                    top: activeElement.top,
                    polyColor: activeElement.fill,
                    polyBorderColor: activeElement.polyBorderColor,
                    textBgColor: activeElement.textBgColor,
                    textColor: activeElement.textColor,
                    strokeSize: val,
                  });
                  canvas.remove(activeElement);
                  canvas.add(group);
                  canvas.setActiveObject(group);
                  canvas.renderAll();
                  canvas.onHistory();
                  updateActiveElement({ strokeSize: val }, this);
                }
              }}
            />
            <div className="speech-arrow-dropdown half">
              <SimpleDropdown
                maxHeight="252px"
                maxWidth="147px"
                opt={{
                  fullWidth: true,
                  controlWidth: "100%",
                }}
                label={"Arrow:"}
                placeHolder={activeElement?.arrow}
                value={activeElement?.arrow}
                options={ArrowDirection}
                floatingLabel={true}
                onChange={(value) => {
                  handleSpeechArrowChange(value);
                }}
              />
            </div>
            <TextInput
              type={"number"}
              label={"Text Padding:"}
              min={0}
              opt={{
                containerWidth: "calc(50% - 5px)",
              }}
              value={activeElement._objects[1].polyPadding}
              onChange={(e) => {
                if (e >= 0) {
                  const SpeechText = activeElement._objects?.[1];
                  const SpeechPoly = activeElement._objects?.[0];
                  const arrow = activeElement?.arrow;
                  const isLabel = activeElement.isLabel;
                  const strokeWidth = activeElement.strokeWidth;
                  canvas.offHistory();
                  activeElement.toActiveSelection();
                  canvas.setActiveObject(SpeechPoly);
                  SpeechText.polyPadding = e;
                  SpeechPoly.polyPadding = e;
                  let result = createNewPoly(strokeWidth, SpeechText, arrow);
                  let newPoints = result.newPoints;
                  let newPolyTop = result.newPolyTop - 2;
                  let newPolyLeft = result.newPolyLeft - 2;
                  canvas.renderAll();
                  ReplaceSpeechPolygon(
                    newPoints,
                    newPolyLeft,
                    newPolyTop,
                    SpeechPoly,
                    SpeechText,
                    arrow,
                    isLabel
                  );
                }
              }}
            />
            <>
              <ComboButton
                theme={theme}
                label="Text Alignment:"
                btnArray={[
                  {
                    title: "Align Left",
                    icon: "icon-align-object-left",
                    bId: "left",
                  },
                  {
                    title: "Align Center",
                    icon: "icon-align-object-center",
                    bId: "center",
                  },
                  {
                    title: "Align Right",
                    icon: "icon-align-object-right",
                    bId: "right",
                  },
                ]}
                btnGroupStyle={{
                  width: "100%",
                }}
                onBtnClick={(btn) => {
                  activeElement._objects[1].set({
                    textAlign: btn.bId,
                  });
                  canvas.renderAll();
                }}
                btnContainerClass={"designer-group-button"}
              ></ComboButton>
            </>
            <SimpleDropdown
              maxHeight="252px"
              maxWidth="297px"
              opt={{
                fullWidth: true,
                controlWidth: "100%",
              }}
              label={"Font Family:"}
              placeHolder={activeElement?._objects[1]?.fontFamily}
              value={activeElement?._objects[1]?.fontFamily}
              options={getFrontDropdownData().sort()}
              floatingLabel={true}
              onChange={(value) => {
                setBubbleFontFamily(value, activeElement, canvas);
              }}
            />
          </>
        ) : null} */}
      </div>
    );

    const activePattern = (
      <>
        <div
          className="pattern-controls"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            margin: "10px 0",
          }}
        >
          <NumericInput
            theme={theme}
            value={
              parseInt(activeElementProps?.patternWidth)
                ? parseInt(activeElementProps?.patternWidth)
                : ""
            }
            containerClass={"cls number "}
            label={"Image Width:"}
            onChange={(val) => {
              handlePatternSize(parseInt(val, 10), null, this);
            }}
          />

          <NumericInput
            theme={theme}
            label={"Image Height:"}
            containerClass={"cls number "}
            value={
              parseInt(activeElementProps?.patternHeight)
                ? parseInt(activeElementProps?.patternHeight)
                : ""
            }
            onChange={(val) => {
              handlePatternSize(null, parseInt(val, 10), this);
            }}
          />
          <NumericInput
            theme={theme}
            label={"Image Left:"}
            containerClass={"cls number "}
            value={activeElementProps?.patternLeft}
            onChange={(val) =>
              handlePatternPosition(parseInt(val), null, null, this)
            }
          />
          <NumericInput
            theme={theme}
            label={"Image Top:"}
            containerClass={"cls number "}
            value={activeElementProps?.patternTop}
            onChange={(top) =>
              handlePatternPosition(null, parseInt(top), null, this)
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={360}
          step={1}
          label="Angle:"
          unitText={"°"}
          value={this.state.patternAngle}
          updateRangeSliderValue={(e) => {
            this.setState({ patternAngle: parseInt(e.target.value) });
            handlePatternPosition(null, null, parseInt(e.target.value), this);
          }}
        />
      </>
    );

    const activeElementColor = (
      // <ColorSelectorButton
      //   theme={theme}
      //   label="Fill Color"
      //   onChange={(color) => {
      //     activeElement.set("fill", color);
      //     activeElement.ElementColor = color;
      //     updateActiveElement({ colors: [color] }, this);
      //     canvas.renderAll();
      //   }}
      //   value={activeElementProps?.colors[0]}
      // />
      <GradientContainer
        theme={theme}
        canChooseGradientType={true}
        value={
          activeElement?.fillGradient
            ? activeElement?.fillGradient
            : activeElementProps?.colors[0]
        }
        previewWidth={200}
        switchToColor={activeElement?.fillGradient ? false : true}
        showInPopup={false}
        label={
          activeElement instanceof fabric.IText ? "Text Color:" : "Fill Color:"
        }
        isGradientAllowed={true}
        opt={{ showInput: true }}
        containerClass={"gradient "}
        onValueChange={(gradientText, configKey, rawConfig) => {
          let grad = makeGradient(
            rawConfig,
            gradientText,
            activeElement?.height,
            activeElement?.width,
            this
          );
          if (rawConfig.colorStops.length < 2) {
            updateActiveElement({ colors: [grad] }, this);
            activeElement.set("fill", grad);
          } else {
            activeElement.set("fill", new fabric.Gradient(grad));
          }
          activeElement.ElementColor = activeElementProps?.colors[0];
          canvas.renderAll();
        }}
      />
    );

    const activeArrowColor = (
      <ColorSelectorButton
        theme={theme}
        label="Arrow Color:"
        value={activeElement?.fill}
        onChange={(color) => {
          activeElement._objects.forEach((el) => {
            if (el instanceof fabric.Triangle) {
              el.set("fill", color);
            }
            el.set("stroke", color);
          });
          canvas.renderAll();
          updateActiveElement({ fill: color }, this);
        }}
      />
    );

    const activeBorderColor = (
      <ColorSelectorButton
        theme={theme}
        label={
          activeElement instanceof fabric.IText
            ? "Text Border:"
            : activeElement instanceof fabric.Line
            ? "Line Color:"
            : "Border Color:"
        }
        onChange={(color) => {
          activeElement.set("stroke", color);
          updateActiveElement({ stroke: color }, this);
        }}
        value={activeElement?.stroke}
      />
    );

    const groupArrowColor = (
      <div className="svg-colors-group">
        <ColorSelectorButton
          theme={theme}
          label={"Arrow Line:"}
          onChange={(color) => {
            activeElement.item(0).set("stroke", color);
            updateActiveElement({ stroke: color }, this);
          }}
          value={activeElementProps?.stroke}
        />
        <ColorSelectorButton
          theme={theme}
          label={
            activeElement?._objects?.length === 3
              ? "Right Arrow Head:"
              : "Arrow Head"
          }
          onChange={(color) => {
            activeElement.item(1).set("fill", color);
            let newColors = activeElementProps.colors;
            newColors[1] = color;
            updateActiveElement({ colors: newColors }, this);
          }}
          value={activeElementProps.colors?.[1]}
        />

        {activeElement?._objects?.length === 3 && (
          <ColorSelectorButton
            theme={theme}
            label={"Left Arrow Head:"}
            onChange={(color) => {
              activeElement.item(2).set("fill", color);
              let newColors = activeElementProps.colors;
              newColors[2] = color;
              updateActiveElement({ colors: newColors }, this);
            }}
            value={activeElementProps.colors?.[2]}
          />
        )}
      </div>
    );

    const activeBorderThickness = (
      <>
        <NumericInput
          theme={theme}
          value={activeElementProps?.strokeWidth}
          type={"number"}
          label={"Border Thickness"}
          opt={{
            containerWidth: "calc(50% - 5px)",
          }}
          containerClass={"cls number "}
          onChange={(val) => {
            if (val >= 0) {
              updateActiveElement(
                {
                  strokeWidth: Number(val),
                },
                this
              );
            }
          }}
        />
      </>
    );

    const activeRadius = (
      <>
        <NumericInput
          value={activeElementProps?.radius}
          containerClass={"cls number "}
          label={"Radius:"}
          onChange={(val) => {
            updateActiveElement(
              {
                radius: Number(val) < 0 ? 0 : Number(val),
              },
              this
            );
            canvas.renderAll();
          }}
        />
      </>
    );

    const objectColors = (
      <div className="object-colors mt-10">
        {/* <div>
          {activeElement && activeElement instanceof fabric.IText
            ? "Text Color"
            : "Detected Color(s)"}
        </div>
        <div className="svg-colors-group">
          <ConfiguratorCore
            containerClass="Qr-Configurator"
            data={createConfiguratorData(this)}
            onResponse={(data) => {
              updateStyle(data, this);
            }}
          />
        </div> */}
      </div>
    );

    const AlignElement = (
      <div className="element-alignment">
        <ComboButton
          theme={theme}
          label="Alignment: "
          buttons={ALIGNMENT_OPTIONS}
          onBtnClick={(btn) => {
            if (["left", "center", "right"].includes(btn.value))
              onChange(ACTIONS.ALIGN_ELEMENT_HORIZONTALLTY, btn.value);
            else {
              onChange(ACTIONS.ALIGN_ELEMENT_VERTICALLY, btn.value);
            }
          }}
          // btnContainerClass={"designer-group-button"}
        ></ComboButton>
      </div>
    );

    const SpaceElementsEvenly = activeElement instanceof
      fabric.ActiveSelection && (
      <div className="space-evenly">
        <ComboButton
          theme={theme}
          label="Space Objects Evenly"
          buttons={SPACE_EVENLY_OPTIONS}
          onBtnClick={(btn) => {
            onChange(ACTIONS.SPACE_WITHIN_GROUP_EVENLY, btn.bId);
          }}
          btnContainerClass={"designer-group-button"}
        ></ComboButton>
      </div>
    );

    const TextStyles = (
      <div className="Text-Styles">
        <ComboButton
          theme={theme}
          label={"Text Style:"}
          buttons={FONT_STYLES}
          onBtnClick={(btn) => {
            handleFontStyle(btn, activeElement, canvas);
          }}
          btnContainerClass={"designer-group-button"}
        ></ComboButton>
      </div>
    );

    const FlipElement = (
      <div className="Flip-Controls">
        <ComboButton
          theme={theme}
          label={"Flip Element:"}
          buttons={FLIP_OPTIONS}
          onBtnClick={(button) => {
            if (button.value === "x")
              activeElement.set("flipX", !activeElement.flipX);
            else activeElement.set("flipY", !activeElement.flipY);
            canvas.renderAll();
          }}
        />
      </div>
    );

    const AlignText = (
      <div className="Text-Alignment">
        <ComboButton
          theme={theme}
          buttons={TEXT_ALIGNMENT}
          onBtnClick={(button) => {
            activeElement.set({
              textAlign: button.value,
            });
            canvas.renderAll();
          }}
        />
      </div>
    );

    const AlignWithinElement =
      activeElement instanceof fabric.ActiveSelection ? (
        <div className="align-within-Group-Vertically">
          <ComboButton
            theme={theme}
            label="Object Horizontal Alignment"
            buttons={ALIGNMENT_OPTIONS}
            onBtnClick={(button) => {
              onChange(ACTIONS.ALIGN_WITHIN_GROUP_HORIZONTALLTY, button.value);
            }}
          />
        </div>
      ) : null;

    const TextControls =
      activeElement?.type === "text" || activeElement?.type === "i-text" ? (
        <div className="font-controls">
          {activeFontFamily}
          {TextStyles}
          {AlignText}
          {!activeElement?.patternActive ? activeElementColor : null}
          {activeBgColor}
          {activeBorderColor}
          {activeBorderThickness}
          {!activeElement?.patternActive ? boxShadow : null}
          {FlipElement}
          {patternImgController}
          {/* 
          DUE TO CHROME BUG NOT RENDERING PATTERN ON FONTS, 
          WORK AROUND TO JUST RENDER THE IMAGE AS A REPEATING PATTERN
          WITHOUT CONTROLS FOR RESIZE OR OFFSET OF THE GIVEN PATTERN
          FOR MORE DETAILS VISIT: https://github.com/fabricjs/fabric.js/issues/9414
          
          {activeElement?.patternActive ? activePattern : null}
          {activeElementProps?.patternActive ? imageFit : null} 
          */}
        </div>
      ) : null;

    const CircleControls =
      activeElement?.type === "circle" ? (
        <div className="cirlce-controls">
          {!activeElement?.patternActive ? activeElementColor : null}
          {activeBgColor}
          {activeBorderColor}
          {activeRadius}
          {activeBorderThickness}
          {FlipElement}
          {!activeElement?.patternActive ? boxShadow : null}
          {patternImgController}
          {activeElement?.patternActive ? activePattern : null}
          {activeElementProps?.patternActive ? imageFit : null}
        </div>
      ) : null;

    const RectangleControls =
      activeElement?.type === "rect" ? (
        <div
          className="rect-controls"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {rectBorderRadius}
          {activeBorderColor}
          {activeBorderThickness}
          {!activeElement?.patternActive ? boxShadow : null}
          {!activeElement?.patternActive ? activeElementColor : null}
          {patternImgController}
          {activeElementProps?.patternActive ? activePattern : null}
          {FlipElement}
          {activeElementProps?.patternActive ? imageFit : null}
        </div>
      ) : null;

    const TriangleControls =
      activeElement?.type === "triangle" ? (
        <div className="triangle-controls">
          {activeBgColor}
          {activeBorderThickness}
          {activeBorderColor}
          {FlipElement}
          {!activeElement?.patternActive ? boxShadow : null}
          {activeElement?.patternActive ? activePattern : activeElementColor}
          {patternImgController}
          {activeElement?.patternActive ? activePattern : null}
          {activeElementProps?.patternActive ? imageFit : null}
        </div>
      ) : null;

    const LineControls =
      activeElement && activeElement instanceof fabric.Line ? (
        <div className="line-controls">
          {activeArrowHead}
          {activeBorderThickness}
          {activeBorderColor}
        </div>
      ) : null;

    const QuadraticArrowControls =
      activeElement && activeElement?.customType === "Quadratic" ? (
        <div className="quad-controls">{activeArrowColor}</div>
      ) : null;

    const ArrowControls =
      activeElement && activeElement?.customType === "arrow" ? (
        <div>{groupArrowColor}</div>
      ) : null;

    const SvgControls =
      activeElement?.type === "group" && !activeElement?.customType ? (
        <>
          {FlipElement}
          {imageFit}
          {objectColors}
        </>
      ) : null;

    const AnnotationControls = activeElement?.bubbleId
      ? SpeechBubbleControls
      : null;

    return (
      <div
        className="ActiveElementControls"
        style={{
          width: "100%",
          gap: "10px",
          paddingBottom: "100px",
        }}
      >
        {elementsDropDownData.length > 0 ? (
          <>
            {AlignElement}
            {AlignWithinElement}
            {SpaceElementsEvenly}
          </>
        ) : null}
        {SvgControls}
        {TextControls}
        {LineControls}
        {ArrowControls}
        {CircleControls}
        {TriangleControls}
        {RectangleControls}
        {AnnotationControls}
        {/* {RandomBlobControls} */}
        {QuadraticArrowControls}
      </div>
    );
  }
}

ActiveElementControls.defaultProps = {
  canvasCore: null,
  activeElementProps: Object.assign({}, RESET_ACTIVE_ELEM_PROPS),
  onActiveElementPropsChange: noop,
  onChange: noop,
};

export default ActiveElementControls;
