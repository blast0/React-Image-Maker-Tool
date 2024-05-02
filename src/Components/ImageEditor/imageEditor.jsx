import React, { Component } from "react";

// EXTERNAL PACKAGES
// import { withTranslation } from "react-i18next";

// LOCAL COMPONENTS / METHODS
import Page from "./Canvas/canvas";

// CONSTANTS
import { FONT_PROPS_DEFAULT } from "./constants";

// HELPERS
import {
  onSelectSvg,
  onSelectImage,
  handleJsonData,
  // updatePageBreadcrumb,
  // addSavedImageFromLibrary,
  setActiveObject,
  onAddImageFromFile,
  initializeApp,
  handleOutsideClick,
  handleRightPanelUpdates,
  createCanvasElementsDropdownData,
  // resetPage,
} from "./helper-functions";

// STYLE
import "./imageEditor.css";
import "./googlefonts.css";
import Canvastools from "./Canvastools";
import { Panel } from "../panel/Panel";
import ModalApp from "../modal/modal";
import IconButton from "../buttons/ButtonIcon";
// import SpinnerB from "../spinner";

class Designer extends Component {
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
      pageBgColor: "rgba(0,0,0,0)",
      elementsDropDownData: [],
      selectedElementId: null,
      selectedElementName: "",
      isTemplateLoaded: false,
      isCanvasActive: null,
      shouldSave: false,
      fileDimensions: null,
      blob: null,
      modalActive: false,
      loadingImage: false,
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
        <div>
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
                  ontemplateLoaded={(elem) => {
                    this.setState(
                      {
                        isTemplateLoaded: true,
                      },
                      () => {
                        // _canvas.clearHistory();
                        setTimeout(() => {
                          if (elem) {
                            _canvas.setActiveObject(elem);
                            _canvas.renderAll();
                          }
                        }, 100);
                      }
                    );
                  }}
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
                <div // ref={this.imagetoLibInputRef}
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
                    onBtnClick={(e) => {
                      console.log("cliked");
                    }}
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
                <IconButton />
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
              children={
                <>
                  <Canvastools
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
      </div>
    );
  }
}

export default Designer;
