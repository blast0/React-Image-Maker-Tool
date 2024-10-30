import React, { useState } from "react";
import RangeSlider from "../range-slider";
import TextInput, { NumericInput } from "../Input/text-input";
import ComboButton from "../Buttons/ButtonGroup";
import RadioButton from "../radio-button";
import IconButton from "../Buttons/IconButton";
import { handleRightPanelUpdates } from "./helper-functions";
import { ACTIONS } from "./constants";

const SaveModalJsx = ({
  defaultFileName,
  defaultFileType,
  onBtnClick,
  imageWidth,
  ratio,
  canvas,
  theme,
  self,
}) => {
  const [fileName, set_fileName] = useState(defaultFileName);
  const [chosenFileType, set_chosenFileType] = useState(defaultFileType);
  const [ImageWidth, set_ImageWidth] = useState(imageWidth);
  const [ImageHeight, set_ImageHeight] = useState(parseInt(imageWidth / ratio));
  const [jpegQuality, set_jpegQuality] = useState(0.9);
  const [selection, setSelection] = useState("page");

  return (
    <>
      <div className="SaveDownloadModal modal-body">
        <TextInput
          theme={theme}
          autoFocus={true}
          value={fileName}
          onChange={(value) => {
            set_fileName(value);
          }}
          label="File Name:"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          <span
            className="fileName"
            style={{
              color: theme !== "dark" ? "black" : "white",
            }}
          >
            {fileName}.{chosenFileType}
          </span>
          <div style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                height: "120px",
                width: "200px",
                backgroundImage: `url(${
                  selection === "page"
                    ? canvas.toDataURL()
                    : canvas.getActiveObject().toDataURL()
                })`,
                backgroundColor: "#fff",
                backgroundSize: "contain",
                backgroundPosition: "50%",
                backgroundRepeat: "no-repeat",
                border: "1px solid #eee",
              }}
            ></div>
            <RadioButton
              theme={theme}
              value={"page"}
              label={" Full Page"}
              checked={selection === "page"}
              onChange={(e) => {
                setSelection("page");
              }}
            />
            <RadioButton
              theme={theme}
              value={"selected"}
              label={"Selected Element"}
              checked={selection === "selected"}
              onChange={(e) => {
                setSelection("selected");
              }}
            />
          </div>
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <ComboButton
              theme={theme}
              label="FileType: "
              buttons={[
                {
                  btnText: "PNG",
                  value: "png",
                },
                {
                  btnText: "JPEG",
                  value: "jpeg",
                },
                {
                  btnText: "WEBP",
                  value: "webp",
                },
                {
                  btnText: "SVG",
                  value: "svg",
                },
              ]}
              onBtnClick={(btn) => {
                set_chosenFileType(btn.value);
              }}
            />
          </div>
        </div>
        {chosenFileType === "jpeg" ? (
          <div
            style={{
              marginTop: "10px",
            }}
          >
            <RangeSlider
              theme={theme}
              label={"Image Quality:"}
              min={0}
              max={1}
              step={0.1}
              value={jpegQuality}
              updateRangeSliderValue={async (e) => {
                set_jpegQuality(e.target.value);
              }}
            />
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <NumericInput
            theme={theme}
            autoFocus={true}
            type="number"
            value={ImageWidth}
            onChange={(value) => {
              set_ImageWidth(parseInt(value));
              set_ImageHeight(parseInt(value / ratio));
            }}
            label="Width:"
          />
          <NumericInput
            theme={theme}
            autoFocus={true}
            type="number"
            value={ImageHeight}
            onChange={(value) => {
              set_ImageWidth(parseInt(value * ratio));
              set_ImageHeight(parseInt(value));
            }}
            label="Height:"
          />
          <IconButton
            btnClick={() => {
              handleRightPanelUpdates(
                ACTIONS.DOWNLOAD_PAGE,
                {
                  fileName,
                  chosenFileType,
                  ImageWidth,
                  ImageHeight,
                  jpegQuality,
                  selection,
                },
                self
              );
            }}
            btnText={"Download "}
            rightIcon={"icon-download"}
            variant="light"
          />
          <IconButton
            // btnClick={handleShow}
            btnText={"Save To Library "}
            rightIcon={"icon-save"}
            variant="light"
          />
        </div>
      </div>
    </>
  );
};

export default SaveModalJsx;
