import React, { Component } from "react";

// LOCAL COMPONENTS / METHODS
import Page from "./Canvas/canvas";

// CONSTANTS
import {
  ACTIONS,
  ADD_SHAPE_OPTIONS,
  // DELETE_OPTIONS,
  // SAVE_OPTIONS,
  FONT_PROPS_DEFAULT,
} from "./constants";

// HELPERS
import {
  onSelectSvg,
  onSelectImage,
  handleJsonData,
  setActiveObject,
  onAddImageFromFile,
  initializeApp,
  handleOutsideClick,
  handleRightPanelUpdates,
  createCanvasElementsDropdownData,
  // resetPage,
} from "./helper-functions";

// STYLE
import "./index.css";
import "./fontfamilys.css";
import Canvastools from "./Controls/Canvastools";
import { Panel } from "../SidePanel/Panel";
import ModalApp from "../Modal/modal";
import IconButton from "../Buttons/IconButton";
import DropdownButton from "../Buttons/DropdownBtn";
import SaveModalJsx from "./saveModal";

class ImageMaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeElementProps: {
        id: "",
        colors: [],
        ...Object.assign({}, FONT_PROPS_DEFAULT),
      },
      error: {
        height: false,
        width: false,
      },
      defaultFileType: "jpeg",
      showDownloadBtn: true,
      pageHeight: 0,
      pageWidth: 0,
      showStyleEditor: false,
      pages: [],
      canvases: {},
      activePageID: null,
      pageBgColor: "rgba(0,0,0,0.5)",
      elementsDropDownData: [],
      selectedElementId: null,
      selectedElementName: "",
      isTemplateLoaded: false,
      isCanvasActive: true,
      shouldSave: false,
      fileDimensions: null,
      blob: null,
      modalActive: false,
      loadingImage: false,
      elemWidth: null,
      elemHeight: null,
    };
    this.patternSourceCanvas = null;
    this.designer = React.createRef();
    this.jsonRef = React.createRef();
    this.imagetoLibInputRef = React.createRef();
    this.imagetoCanvasRef = React.createRef();
    this.svgInputRef = React.createRef();
    this.queryParams = {};
  }

  componentDidMount() {
    // Adding EventListener to handle outside click.
    this.designer.current.addEventListener("click", (e) =>
      handleOutsideClick(e, this)
    );
    initializeApp(this);
  }

  componentWillUnmount() {
    this.designer.current.removeEventListener("click", (e) =>
      handleOutsideClick(e, this)
    );
  }

  render() {
    const {
      // blob,
      error,
      pageWidth,
      pageHeight,
      // shouldSave,
      // thumbnailUrl,
      // fileDimensions,
      // defaultFileType,
      // showDownloadBtn,
      showStyleEditor,
      selectedElementName,
      elementsDropDownData,
      pageBgColor,
      modalActive,
      activePageID,
      isCanvasActive,
      isTemplateLoaded,
      selectedElementId,
      activeElementProps,
      pages,
      elemWidth,
      elemHeight,
    } = this.state;
    const _canvas = Object.values(this.state.canvases)[0];
    return (
      <div
        className="designer"
        ref={this.designer}
        style={
          this.props.theme === "light"
            ? {
                display: "flex",
                flexDirection: "column",
              }
            : {
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#212529",
              }
        }
      >
        {pages.map((page) => {
          return (
            <div key={`page-div-${page.id}`}>
              <Page
                theme={this.props.theme}
                isCanvasActive={isCanvasActive && !modalActive}
                selectedElementId={selectedElementId}
                key={`page-${page.id}`}
                activePageID={activePageID}
                _canvas={_canvas}
                config={page}
                activeElementProps={activeElementProps}
                isTemplateLoaded={isTemplateLoaded}
                onCanvasActive={(isActive) => {
                  if (modalActive) {
                    this.setState({
                      isCanvasActive: false,
                    });
                  } else {
                    this.setState({
                      isCanvasActive: isActive,
                    });
                  }
                }}
                ontemplateLoaded={(elem) => {
                  this.setState(
                    {
                      isTemplateLoaded: true,
                    },
                    () => {
                      // _canvas.clearHistory();
                      // if (elem) {
                      //   _canvas.setActiveObject(elem);
                      //   _canvas.renderAll();
                      // }
                    }
                  );
                }}
                onCanvasPostInit={(id, canvas) => {
                  this.setState({
                    canvases: {
                      ...this.state.canvases,
                      [id]: canvas,
                    },
                  });
                }}
                pageBgColor={pageBgColor}
                onElementsRendered={() => {
                  createCanvasElementsDropdownData(this);
                }}
                onElementDeleteRequested={(action) =>
                  handleRightPanelUpdates(action, null, this)
                }
                onElemSelect={(showStyleEditor, activeElementProps) => {
                  this.setState({
                    showStyleEditor,
                    activeElementProps,
                    selectedElementName: activeElementProps.name,
                    selectedElementId: activeElementProps.id,
                  });
                  setActiveObject(activeElementProps.id, _canvas);
                }}
                setSelectedName={(name) => {
                  _canvas.getActiveObject().name = name;
                  this.setState({
                    selectedElementName: name,
                  });
                }}
              />
              <div
                className="hidden-file"
                children={{}}
                type="file"
                accept="image/svg"
                onChange={(e) => {
                  onSelectImage(e, this);
                }}
                onClick={(e) => {
                  onSelectImage(e, this);
                }}
              >
                <ModalApp
                  leftIcon={"icon-laptop"}
                  onBtnClick={(e) => {}}
                  children={
                    <>
                      <div className="delete-modal modal-body">
                        <p className="text-center">
                          All item(s) in self page will be deleted.
                        </p>
                      </div>
                      <div className="modal-footer align-center"></div>
                    </>
                  }
                />
              </div>
            </div>
          );
        })}
        <div>
          <input
            ref={this.imagetoLibInputRef}
            className="hidden-file"
            type="file"
            accept="image/svg"
            onChange={(e) => {
              onSelectImage(e, this);
            }}
            onClick={(e) => {
              onSelectImage(e, this);
            }}
          />
          <input
            ref={this.imagetoCanvasRef}
            className="hidden-file"
            style={{ border: "2px solid black" }}
            type="file"
            accept="image/svg"
            onChange={(e) => {
              onAddImageFromFile(e, this, pageHeight, pageWidth);
            }}
            onClick={(e) => {
              onAddImageFromFile(e, this, pageHeight, pageWidth);
            }}
          />
          <input
            ref={this.svgInputRef}
            className="hidden-file"
            type="file"
            accept="image/svg"
            onChange={(e) => onSelectSvg(e, this)}
          />
          <Panel
            theme={this.props.theme}
            direction="end"
            name="Tools"
            headerChildren={
              <>
                <div
                  className="outlined-buttons btn-fixed-right-panel"
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "5px",
                  }}
                >
                  <DropdownButton
                    leftIcon={"icon-add"}
                    variant="light"
                    btnText={""}
                    buttons={ADD_SHAPE_OPTIONS}
                    onDropBtnClick={(option) => {
                      handleRightPanelUpdates(option.value, {}, this);
                    }}
                  />
                  <IconButton
                    leftIcon="icon-undo"
                    btnText={""}
                    btnClick={() => {
                      handleRightPanelUpdates(ACTIONS.UNDO_ACTION, {}, this);
                    }}
                  />
                  <IconButton
                    leftIcon="icon-redo"
                    btnText={""}
                    btnClick={() => {
                      handleRightPanelUpdates(ACTIONS.REDO_ACTION, {}, this);
                    }}
                  />
                  <ModalApp
                    leftIcon="icon-save-new"
                    theme={this.props.theme}
                    onBtnClick={(e) => {
                      handleRightPanelUpdates(ACTIONS.DOWNLOAD_PAGE, {}, this);
                    }}
                    children={
                      <>
                        <SaveModalJsx
                          self={this}
                          thumbnailUrl={null}
                          canvas={_canvas}
                          theme={this.props.theme}
                          defaultFileName={"canvas"}
                          defaultFileType={"jpg"}
                          imageWidth={pageWidth}
                          ratio={pageWidth / pageHeight}
                        />
                      </>
                    }
                    footerChildren={<></>}
                  />
                  <ModalApp
                    leftIcon="icon-delete"
                    onBtnClick={(e) => {
                      handleRightPanelUpdates(ACTIONS.CLEAR_PAGE, {}, this);
                    }}
                    children={<>All item(s) in your page will be deleted.</>}
                  />
                </div>
              </>
            }
            bodyChildren={
              <>
                <Canvastools
                  onCanvasActive={(isActive) => {
                    if (modalActive) {
                      this.setState({
                        isCanvasActive: false,
                      });
                    } else {
                      this.setState({
                        isCanvasActive: isActive,
                      });
                    }
                  }}
                  theme={this.props.theme}
                  canvas={_canvas}
                  elementsDropDownData={elementsDropDownData}
                  error={error}
                  pageWidth={pageWidth}
                  pageHeight={pageHeight}
                  pageBgColor={pageBgColor}
                  showStyleEditor={showStyleEditor}
                  selectedElementName={selectedElementName}
                  activeElementProps={activeElementProps}
                  elemWidth={elemWidth}
                  elemHeight={elemHeight}
                  onChange={(action, data) =>
                    handleRightPanelUpdates(action, data, this)
                  }
                  handleJsonData={(e) => handleJsonData(e, this)}
                  jsonRef={this.jsonRef}
                  siteColorsSettings={this.props.siteColorsSettings}
                />
              </>
            }
          />
        </div>
      </div>
    );
  }
}

export default ImageMaker;
