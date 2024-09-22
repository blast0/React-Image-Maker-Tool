import React, { useState, useCallback } from "react";
import RangeSlider from "../range-slider";
import TextInput from "../Input/text-input";
import ComboButton from "../Buttons/ButtonGroup";

const SaveModalJsx = ({
  defaultFileName,
  fileTypeOptions,
  defaultFileType,
  onBtnClick,
  showDownloadBtn,
  thumbnailUrl,
  imageWidth,
  ratio,
  canvas,
  theme,
}) => {
  const [fileName, set_fileName] = useState(defaultFileName);
  const [chosenFileType, set_chosenFileType] = useState(defaultFileType);
  const [ImageWidth, set_ImageWidth] = useState(imageWidth);
  const [ImageHeight, set_ImageHeight] = useState(parseInt(imageWidth / ratio));
  const [jpegQuality, set_jpegQuality] = useState(0.9);

  const isDownloadDisabled = useCallback(() => {
    if (
      chosenFileType === "svg" ||
      chosenFileType === "png" ||
      chosenFileType === "jpeg" ||
      chosenFileType === "webp"
    )
      return false;
    else return true;
  }, [chosenFileType]);

  const isSaveDisabled = useCallback(() => {
    if (fileTypeOptions.includes(chosenFileType)) return false;
    else return true;
  }, [chosenFileType, fileTypeOptions]);

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
          <div
            style={{
              height: "120px",
              width: "200px",
              backgroundImage: `url(${canvas.toDataURL()})`,
              backgroundSize: "contain",
              backgroundPosition: "50%",
              backgroundRepeat: "no-repeat",
              border: "1px solid #eee",
            }}
          ></div>
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
                value: "jpg",
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
        {chosenFileType === "jpeg" ? (
          <RangeSlider
            label={"JPEG quality:"}
            min={0}
            max={1}
            step={0.1}
            value={jpegQuality}
            updateRangeSliderValue={async (e) => {
              set_jpegQuality(e.target.value);
            }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <TextInput
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
          <TextInput
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
        </div>
      </div>
      {/* <div className="modal-footer align-center">
        <ContainedButton
          disabled={isSaveDisabled()}
          btnText="Save to Library"
          btnContainerClass="mr-10"
          onBtnClick={(e) => {
            onBtnClick(
              "save",
              fileName,
              chosenFileType,
              1,
              ImageWidth,
              ImageHeight
            );
          }}
        />
        {showDownloadBtn ? (
          <ContainedButton
            disabled={isDownloadDisabled()}
            btnText="Download"
            btnContainerClass="mr-10"
            onBtnClick={(e) => {
              onBtnClick(
                "download",
                fileName,
                chosenFileType,
                jpegQuality,
                ImageWidth,
                ImageHeight
              );
            }}
          />
        ) : null}
        <OutlinedButton
          btnText="Cancel"
          onBtnClick={() => {
            onBtnClick("cancel");
          }}
        />
      </div> */}
    </>
  );
};

export default SaveModalJsx;
