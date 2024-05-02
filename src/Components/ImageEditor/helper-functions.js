import {
  ACTIONS,
  PAGE_CONFIG,
  PAGE_TEMPLATES,
  LINE_PROPS_DEFAULT,
  FONT_PROPS_DEFAULT,
  CANVAS_PAGE_GUTTER,
  // EXTRA_ELEMENT_PROPS,
  SHAPES_PROPS_DEFAULT,
  QUADRATIC_PROPS_DEFAULT,
  SPEECH_BUBBLE_DEFAULT_PROPS,
} from "./constants";

import { inRange, cloneDeep, uniqueId } from "lodash";
import { produce } from "immer";
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import Spinner from "../spinner/manager";
// import crypto from "crypto";
// import { inRange } from "lodash";
var FontFaceObserver = require("fontfaceobserver");

// HANDLE EVENTS ON RIGHT PANEL AND PERFORM ACTIONS ACCORDINGLY
export const handleRightPanelUpdates = (action, data, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  const alignment = data;
  const { pageHeight, pageWidth, loadingImage } = self.state;
  const activeElement = canvasRef.getActiveObject();
  switch (action) {
    case ACTIONS.SHOW_SAVED_TEMPLATES:
      // showSavedTemplates(self);
      break;
    case ACTIONS.SHOW_GLOBAL_TEMPLATES:
      // showGlobalTemplates(self);
      break;
    case ACTIONS.ADD_FROM_LIBRARY:
      // openImageLibrary(self);
      break;
    case ACTIONS.ADD_TEXT:
      addText(self);
      break;
    case ACTIONS.CHANGE_ACTIVE_ELEMENT_PROPS:
      console.log(data);
      self.setState(
        {
          showStyleEditor: true,
          activeElementProps: data,
          selectedElementName: data.name,
          selectedElementId: data.id,
        },
        () => {
          canvasRef.requestRenderAll();
        }
      );
      setActiveObject(data.id, self);
      break;
    case ACTIONS.CHANGE_PAGE_BACKGROUND:
      // changePageBackGround(data, self);
      break;
    case ACTIONS.ELEMENT_NAME:
      handleNameElement(data.target.value, self);
      break;
    case ACTIONS.CHANGE_PAGE_DIMENSIONS:
      dimensionChangeHandler(data.name, data.val, self);
      break;
    case ACTIONS.CLEAR_PAGE:
      // showPageResetWarning(ACTIONS.CLEAR_PAGE, self);
      // self.setState({ showPageResetWarning: true });
      resetPage(self);
      break;
    case ACTIONS.DOWNLOAD_PAGE:
      downloadPage(self);
      break;
    case ACTIONS.DOWNLOAD_SELECTION:
      downloadSelection(self);
      break;
    case ACTIONS.DOWNLOAD_JSON:
      // downloadJSON(self);
      break;
    case ACTIONS.UPLOAD_JSON:
      // uploadTemplateModal(self);
      break;
    case ACTIONS.UPLOAD_IMAGE:
      self.imagetoLibInputRef.current.click();
      break;
    case ACTIONS.UPLOAD_SVG:
      self.svgInputRef.current.click();
      break;
    case ACTIONS.DELETE_SELECTION:
      deleteSelection(self);
      break;
    case ACTIONS.REDO_ACTION:
      canvasRef.redo();
      break;
    case ACTIONS.SAVE_PAGE_TO_LIBRARY:
      // saveToImageLibrary(ACTIONS.SAVE_PAGE_TO_LIBRARY, self);
      break;
    case ACTIONS.SAVE_SELECTION_TO_LIBRARY:
      // saveToImageLibrary(ACTIONS.SAVE_SELECTION_TO_LIBRARY, self);
      break;
    case ACTIONS.UNDO_ACTION:
      undoAction(self);
      break;
    case ACTIONS.UPDATE_ACTIVE_ELEMENT:
      updateActiveElement(data.id, data.name, self);
      break;
    case ACTIONS.ADD_TRIANGLE:
      addTriangle(self);
      break;
    case ACTIONS.ADD_RECTANGLE:
      addRectangle(null, null, self);
      break;
    case ACTIONS.ADD_CIRCLE:
      addCircle(self);
      break;
    case ACTIONS.ADD_LINE:
      addLine(ACTIONS.ADD_LINE, self);
      break;
    case ACTIONS.ADD_DASHED_LINE:
      addLine(ACTIONS.ADD_DASHED_LINE, self);
      break;
    case ACTIONS.ADD_QUADRATIC_CURVE:
      addQuadratic(self);
      break;
    case ACTIONS.ALIGN_ELEMENT_HORIZONTALLTY:
      if (activeElement?.bubbleId) {
        if (!activeElement._objects) {
          return;
        }
      }
      alignElementHorizontally(alignment, canvasRef, pageWidth, activeElement);
      break;
    case ACTIONS.ALIGN_ELEMENT_VERTICALLY:
      if (activeElement?.bubbleId) {
        if (!activeElement._objects) {
          return;
        }
      }
      alignElementVertically(alignment, canvasRef, pageHeight, activeElement);
      break;
    case ACTIONS.ALIGN_WITHIN_GROUP_HORIZONTALLTY:
      alignGroupHorizontally(data, self);
      break;
    case ACTIONS.ADD_SPEECH_BUBBLE:
      // addSpeechBubble(self);
      break;
    case "speech_label":
      // addSpeechLabel(self, true);
      break;
    case ACTIONS.ADD_RANDOM_SHAPE:
      // addRandomShape(self);
      break;
    case ACTIONS.SPACE_WITHIN_GROUP_EVENLY:
      spaceGroupEvenly(data, self);
      break;
    case ACTIONS.RAW_DATA:
      self.jsonRef.current.click();
      break;
    case ACTIONS.IMAGE_DATA:
      self.imagetoCanvasRef.current.click();
      break;
    case ACTIONS.ADD_PATTERN:
      activeElement.URL = data;
      const _activeElementProps = {
        ...self.state.activeElementProps,
        URL: data,
      };
      self.setState({ activeElementProps: _activeElementProps });
      if (!loadingImage) {
        addPattern(data, canvasRef, (newProps) => {
          const _activeElementProps = {
            ...self.state.activeElementProps,
            ...newProps,
          };
          self.setState(
            { activeElementProps: _activeElementProps, loadingImage: false },
            () => {
              canvasRef.requestRenderAll();
            }
          );
        });
      }
      break;
    case ACTIONS.CHANGE_PATTERN_SIZE:
      // handlePatternSize(data.width, data.height, self);
      break;
    case ACTIONS.CHANGE_PATTERN_POSITION:
      // handlePatternPosition(data.left, data.top, data.angle, self);
      break;
    default:
      console.log("unhandled-action", action);
      break;
  }
};

export const initializeApp = async (self) => {
  // if query param contains a template, load it on page init
  // self.queryParams = queryString.parse(self.props.location.search, {
  //   parseBooleans: true,
  //   parseNumbers: true,
  // });
  // const tmplCode = self.queryParams.template;
  // if template is not defined in query parameter, use default template
  const tmpl = PAGE_TEMPLATES[1];

  // get svg image properties from query params
  const svgURL = self.queryParams.url;
  const svgSizes = {
    height: self.queryParams.SVGHeight,
    width: self.queryParams.SVGwidth,
  };
  // if template found
  if (tmpl) {
    // if svg url is defined in URL query param, determine page size from incoming SVG size
    if (svgURL) {
      const templatePageSize = {
        width: tmpl?.pageStyles?.width,
        height: tmpl?.pageStyles?.height,
      };
      // determine page height and width
      const [pageWidth, pageHeight] = determinePageSize(
        svgSizes,
        templatePageSize
      );
      // override template props
      tmpl.pageStyles.width = pageWidth;
      tmpl.pageStyles.height = pageHeight;
    }
    // finally add the page
    await addPage(tmpl, self);
    // if (svgURL) {
    //   addSVGToPage(svgURL, svgSizes.height, svgSizes.width, self);
    // }
    // generate canvas element names dropdown data
    createCanvasElementsDropdownData(self);
  }
  setActiveObject(self.state.selectedElementId, self);
};

// SET AN OBJECT TO ACTIVE BY PASSING THE OBJECT ID
export const setActiveObject = (id, _canvas) => {
  if (!id) return;
  if (!_canvas) return;
  // const _canvas = Object.values(self.state.canvases)[0];
  _canvas.getObjects().forEach(function (item) {
    if (item.id === id) {
      _canvas.setActiveObject(item);
      _canvas.renderAll();
    }
  });
};

export const handleOutsideClick = (event, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  if (event.target.className === "designer slim-scroll") {
    canvasRef.discardActiveObject().renderAll();
    self.setState({
      showStyleEditor: false,
      selectedElementName: "Please select",
      selectedElementId: null,
    });
  }
};

export const determinePageSize = (svgSizes, canvasSizes) => {
  try {
    const { height: canvasHeight, width: canvasWidth } = canvasSizes;
    const { height: svgHeight, width: svgWidth } = svgSizes;
    // remove unit and get numeric part
    const canvasHeightNum = parseInt(canvasHeight);
    const canvasWidthNum = parseInt(canvasWidth);

    const pageHeight =
      svgHeight < Number(canvasHeightNum)
        ? svgHeight + CANVAS_PAGE_GUTTER
        : Number(canvasHeightNum);
    const pageWidth =
      svgWidth < Number(canvasWidthNum)
        ? svgWidth + CANVAS_PAGE_GUTTER
        : Number(canvasWidthNum);

    return [pageHeight, pageWidth];
  } catch (error) {
    console.log(error);
    // if there's some problem calculating page size, return canvasSizes
    return canvasSizes;
  }
};

export const addPage = (template, self) => {
  const newTemplate = cloneDeep(template);
  newTemplate.elements.forEach((elem) => {
    if (elem.type === "i-text") {
      elem.name = elem.value;
    }
  });
  const promise = new Promise((resolve, reject) => {
    const newPage = produce(PAGE_CONFIG, (draftState) => {
      /**
       * if template is passed, it has highest priority, height,width will be determined from it
       */
      draftState.id = getNewID();
      draftState.style = {
        ...newTemplate?.pageStyles,
      };
      // copy tempate elements to page elements
      draftState.elements = newTemplate.elements;
      let preselected = null;
      draftState.elements.forEach((item) => {
        if (item.preselected === true) {
          preselected = true;
        }
      });
      if (preselected === null) {
        // draftState.elements[0].sendtoback = true;
        // draftState.elements[0].preselected = true;
      }
    });
    // add a new page and make it active
    self.setState(
      {
        // to add page
        pages: [newPage],
        activePageID: newPage.id,
        // update control values for right panel
        pageWidth: newPage.style.width,
        pageHeight: newPage.style.height,
      },
      () => {
        resolve();
      }
    );
  });
  return promise;
};

// update elements names and ids for selection
export const createCanvasElementsDropdownData = (self) => {
  const canvas = Object.values(self.state.canvases)[0];
  const canvasElementNames = getCanvasElementNames(canvas);
  self.setState({
    elementsDropDownData: canvasElementNames,
  });
};

export const getCanvasElementNames = (canvas) => {
  if (!canvas) return [];

  let data = [];
  const elements = canvas?.getObjects().filter((i) => {
    return i.name !== "Speechtext";
  });
  if (elements?.length) {
    data = elements.map((elem) => {
      if (elem.type === "i-text") {
        if (elem.customName === true) {
          return {
            btnText: elem.changeName === "" ? elem.text : elem.changeName,
            value: elem.id,
          };
        } else {
          return {
            btnText: elem.text.length > 20 ? elem.text.slice(0, 20) : elem.name,
            value: elem.id,
          };
        }
      } else {
        if (elem?.id) {
          return {
            btnText: elem.name,
            value: elem.id,
          };
        } else {
          return {
            btnText: elem.name,
            value: elem.bubbleId,
          };
        }
      }
    });
    return data;
  } else {
    return [];
  }
};

//add text element to canvas
export const addText = (self) => {
  const { pages, activePageID } = self.state;
  if (!activePageID) return;
  let count = countElementTypes("i-text", self);
  const svgElementSchema = {
    ...Object.assign({}, FONT_PROPS_DEFAULT),
    id: getNewID(),
    value: "Text",
    type: "i-text",
    name: "Text" + count,
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(svgElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const addRectangle = (height, width, self) => {
  const { pages, activePageID, pageHeight, pageWidth } = self.state;
  if (!activePageID) return;
  let count = countElementTypes("rect", self);
  const rectangleElementSchema = {
    id: getNewID(),
    type: "rect",
    name: "Rectangle " + count,
    height: height ? height : pageHeight / 3,
    width: width ? width : pageWidth / 3,
    selectable: true,
    ...Object.assign({}, SHAPES_PROPS_DEFAULT),
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(rectangleElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const addPattern = async (url, canvasRef, cb) => {
  const activeObject = canvasRef.getActiveObject();

  if (url === "") {
    activeObject.URL = "";
    activeObject.patternActive = false;
    const _newProps = {
      URL: "",
      patternActive: false,
    };
    cb(_newProps);
  } else if (activeObject.type === "i-text") {
    /*DUE TO CHROME BUG NOT RENDERING PATTERN ON FONTS, 
       WORK AROUND TO JUST RENDER THE IMAGE AS A REPEATING PATTERN
       WITHOUT CONTROLS FOR RESIZE OR OFFSET OF THE GIVEN PATTERN
       FOR MORE DETAILS VISIT: https://github.com/fabricjs/fabric.js/issues/9414
       */
    loadPattern(url, canvasRef, cb);
  } else {
    Spinner.showSpinner();
    var img = new Image();
    img.onload = function () {
      fabric.Image.fromURL(
        url,
        async (img) => {
          let patternSourceCanvas = new fabric.StaticCanvas();
          patternSourceCanvas.add(img);
          let patternHeight = activeObject.height;
          let ratio = img.height / patternHeight;
          let patternWidth = img.width / ratio;
          let patternLeft = 0;
          let patternTop = 0;
          const pattern = new fabric.Pattern({
            source: patternSourceCanvas.getElement(),
            repeat: "no-repeat",
            offsetX: patternLeft,
            offsetY: patternTop,
          });
          activeObject.set({
            fill: pattern,
            objectCaching: false,
            centeredRotation: true,
            patternSourceCanvas,
          });
          activeObject.patternLeft = patternLeft;
          activeObject.patternTop = patternTop;
          activeObject.patternWidth = patternWidth;
          activeObject.patternHeight = patternHeight;
          activeObject.patternAngle = 0;
          activeObject.patternActive = true;
          activeObject.patternFit = "Cover: Fit image";
          const newProps = CheckPattern(
            "Cover: Fit image",
            canvasRef,
            activeObject
          );
          cb(newProps, img);
        },
        { crossOrigin: "Anonymous" }
      );
      canvasRef.renderAll();
      Spinner.hideSpinner();
    };
    img.onerror = function () {
      console.log("img loading failed");
      Spinner.hideSpinner();
      activeObject.patternActive = false;
      const _activeElementProps = {
        patternActive: false,
      };
      cb(_activeElementProps);
    };
    img.src = url;
  }
};

export const getNewID = () => {
  return uniqueId();
};

function loadPattern(url, canvas, cb) {
  const activeObject = canvas.getActiveObject();
  if (url === "") {
    activeObject.URL = "";
    activeObject.patternActive = false;
    activeObject.set({
      fill: activeObject.fillColor,
    });
    const _newProps = {
      URL: "",
      patternActive: false,
    };
    cb(_newProps);
  } else {
    Spinner.showSpinner();
    const smallUrl = url.replace("original", "200x200");
    var img = new Image();
    img.onload = function () {
      fabric.util.loadImage(smallUrl, (img) => {
        const pattern = new fabric.Pattern({
          source: img,
          repeat: "repeat",
          offsetX: 0,
          offsetY: 0,
        });
        activeObject.fillColor = activeObject.fill;
        activeObject.set({
          fill: pattern,
          patternActive: true,
        });
        activeObject.patternActive = true;
        const _newProps = {
          URL: url,
          patternActive: true,
        };
        cb(_newProps);
        canvas.renderAll();
        Spinner.hideSpinner();
      });
    };
    img.onerror = function () {
      console.log("img loading failed");
      Spinner.hideSpinner();
      activeObject.patternActive = false;
      const _activeElementProps = {
        patternActive: false,
      };
      cb(_activeElementProps);
    };
    img.src = smallUrl;
  }
}

export const CheckPattern = (value, _canvas, activeElement) => {
  if (!activeElement.patternSourceCanvas._objects?.[0]) {
    addPattern(activeElement.URL, _canvas, (props, img) => {
      let newProps = handlePatternFit(value, _canvas, activeElement, img);
      return newProps;
    });
  } else {
    let newProps = handlePatternFit(value, _canvas, activeElement);
    return newProps;
  }
};

export const handlePatternFit = (value, _canvas, activeElement, image) => {
  let img = activeElement?.patternSourceCanvas?._objects?.[0];
  if (image) {
    img = image;
  }
  if (!img) {
    CheckPattern(value, _canvas, activeElement);
  } else {
    img.rotate(0);
    let imgHeight = img.height;
    let imgWidth = img.width;
    let patternHeight = activeElement.patternHeight;
    let ratio = img.height / patternHeight;
    let patternWidth = img.width / ratio;
    let patternLeft = 0;
    let patternTop = 0;
    const scaleX = activeElement.width / imgWidth;
    const scaleY = activeElement.height / imgHeight;
    if (value === "Cover: Fit image") {
      if (scaleX > scaleY) {
        //wider when scaled
        patternHeight = imgHeight * scaleX;
        patternWidth = imgWidth * scaleX;
        patternTop = parseInt((activeElement.height - patternHeight) / 2);
      } else {
        //taller when scaled
        patternHeight = activeElement.height;
        patternWidth = imgWidth * scaleY;
        patternLeft = parseInt((activeElement.width - patternWidth) / 2);
      }
    } else {
      if (scaleX < scaleY) {
        //wider when scaled
        patternHeight = imgHeight * scaleX;
        patternWidth = imgWidth * scaleX;
        patternTop = parseInt((activeElement.height - patternHeight) / 2);
      } else {
        //taller when scaled
        patternHeight = activeElement.height;
        patternWidth = imgWidth * scaleY;
        patternLeft = parseInt((activeElement.width - patternWidth) / 2);
      }
    }
    img.scaleToWidth(patternWidth);
    img.scaleToHeight(patternHeight);
    activeElement.patternSourceCanvas.setDimensions({
      width: patternWidth,
      height: patternHeight,
    });
    activeElement.patternWidth = patternWidth;
    activeElement.patternHeight = patternHeight;
    activeElement.fill.offsetX = patternLeft;
    activeElement.fill.offsetY = patternTop;
    activeElement.patternLeft = patternLeft;
    activeElement.patternFit = value;
    activeElement.patternTop = patternTop;
    const newProps = {
      patternLeft,
      patternTop,
      patternWidth,
      patternHeight,
      patternFit: value,
      patternActive: true,
    };
    img.rotate(activeElement.patternAngle);
    return newProps;
  }
};

//return count of existing elements of given type
export const countElementTypes = (type, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  let count = 1;
  canvasRef.getObjects().forEach((item) => {
    if (item.type === type) {
      count++;
    }
  });
  return count;
};

/**
 * round a number upto given decimal point
 * https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places
 */
export const roundToDecimal = (num, decimalPoint = 2) => {
  try {
    return Number(
      Math.round(parseFloat(num + "e" + decimalPoint)) + "e-" + decimalPoint
    );
  } catch (error) {
    console.log("error", error);
  }
};

export const scaleElementTofitCanvas = (
  imageFit,
  canvasHeight,
  canvasWidth,
  elem
) => {
  const xscale = canvasWidth / elem.width;
  const yscale = canvasHeight / elem.height;
  if (canvasWidth < elem.width || canvasHeight < elem.height) {
    if (imageFit === "Show full Image" || imageFit === "Show full Svg") {
      if (xscale > yscale) {
        elem.scaleX = elem.scaleY = yscale;
        const scaledleft = canvasWidth - elem.width * yscale;
        elem.left = scaledleft / 2;
        elem.top = 0;
      } else {
        elem.scaleX = elem.scaleY = xscale;
        const scaledtop = canvasHeight - elem.height * xscale;
        elem.top = scaledtop / 2;
        elem.left = 0;
      }
      elem.imageFit = imageFit;
    } else if (
      imageFit === "Fit Image to boundary" ||
      imageFit === "Fit Svg to boundary"
    ) {
      if (xscale < yscale) {
        const scaledleft = canvasWidth - elem.width * yscale;
        elem.left = scaledleft / 2;
        elem.scaleX = elem.scaleY = yscale;
        elem.top = 0;
      } else {
        const scaledtop = canvasHeight - elem.height * xscale;
        elem.top = scaledtop / 2;
        elem.scaleX = elem.scaleY = xscale;
        elem.left = 0;
      }
      elem.imageFit = imageFit;
    }
  } else {
    const left = (canvasWidth - elem.width) / 2;
    elem.left = left;
    const top = (canvasHeight - elem.height) / 2;
    elem.top = top;
  }
};

export const alignElementToCenter = (
  parentCanvasRef,
  pageWidth,
  pageHeight
) => {
  alignElementHorizontally("center", parentCanvasRef, pageWidth);
  alignElementVertically("center", parentCanvasRef, pageHeight);
};

export const alignElementHorizontally = (
  alignment,
  parentCanvasRef,
  pageWidth
) => {
  const element = parentCanvasRef.getActiveObject();
  if (!element) return;
  element.alignHorizontally = alignment;
  // find the leftmost bounding vertex of the element
  let leftmost = getLeftmostCoord(element);
  // find the rightmost bounding vertex of the element
  let rightmost = getRightmostCoord(element);
  // width of element taking rotation into account
  const objectWidth = rightmost - leftmost;
  if (alignment === "left") {
    if (leftmost !== 0) {
      element.left -= leftmost;
      element.setCoords();
      // parentCanvasRef._historySaveAction();
    }
  } else if (alignment === "center") {
    // leftmostcoord such that the element falls in center
    const leftmostCoordForCenter = pageWidth / 2 - objectWidth / 2;
    if (leftmost !== leftmostCoordForCenter) {
      element.left += leftmostCoordForCenter - leftmost;
      element.setCoords();
      // parentCanvasRef._historySaveAction();
    }
  } else if (alignment === "right") {
    if (rightmost !== pageWidth) {
      element.left += pageWidth - rightmost;
      element.setCoords();
      // parentCanvasRef._historySaveAction();
    }
  }
  parentCanvasRef.renderAll();
};

export const alignElementVertically = (
  alignment,
  parentCanvasRef,
  pageHeight
) => {
  const element = parentCanvasRef.getActiveObject();
  if (!element) return;
  // Set the vertical alignment property of the active element
  element.alignVertically = alignment;
  if (!element) return;
  element.alignHorizontally = alignment;
  // find the topmost bounding vertey of the element
  let topmost = getTopmostCoord(element);
  // find the bottommost bounding vertex of the element
  let bottommost = getBottommostCoord(element);
  // height of element taking rotation into account
  const objectHeight = bottommost - topmost;
  if (alignment === "top") {
    if (topmost !== 0) {
      element.top -= topmost;
      element.setCoords();
      // parentCanvasRef._historySaveAction();
    }
  } else if (alignment === "center") {
    // topmostcoord such that the element falls in center
    const topCoordForCenter = (pageHeight - objectHeight) / 2;
    // topmost distance from center coord
    const distance = topCoordForCenter - topmost;
    if (topmost !== topCoordForCenter) {
      element.top += distance;
      element.setCoords();
      // parentCanvasRef._historySaveAction();
    }
  } else if (alignment === "bottom") {
    if (bottommost !== pageHeight) {
      element.top += pageHeight - topmost - objectHeight;
      element.setCoords();
      // parentCanvasRef._historySaveAction();
    }
  }
  parentCanvasRef.renderAll();
};

export const getNextSpeechLabelSchema = (canvasRef) => {
  let count = 1;
  canvasRef.getObjects().forEach((item) => {
    if (item?.customType === "SpeechBubble") {
      if (item.isLabel) {
        count++;
      }
    }
  });
  let schema = {
    id: getNewID(),
    type: "speech_bubble",
    name: "Speech Label " + count,
    left: 100,
    top: 50,
    width: 25,
    textPadding: 0,
    selectable: true,
    arrowWidth: 14,
    strokeWidth: 4,
    borderColor: "#fcfcfc",
    text: String(count),
    isLabel: true,
    textBgColor: "#fcfcfc",
    textColor: "#303030",
    arrow: "Bottom",
    polyColor: "#fcfcfc",
  };
  canvasRef.getObjects().forEach((item) => {
    if (item?.customType === "SpeechBubble" && item.isLabel) {
      const textbox = item._objects.find((item) => {
        return item.customType === "Speechtext";
      });
      const poly = item._objects.find((item) => {
        return item.customType === "SpeechPoly";
      });
      schema.width = textbox.width;
      schema.textPadding = textbox.polyPadding;
      schema.borderColor = poly.stroke;
      schema.textBgColor = textbox.backgroundColor;
      schema.polyColor = poly.fill;
      schema.textColor = textbox.fill;
      schema.arrow = item.arrow;
      schema.fontFamily = textbox.fontFamily;
    }
  });
  const bubbleElementSchema = {
    ...schema,
    ...Object.assign({}, SPEECH_BUBBLE_DEFAULT_PROPS),
  };
  return bubbleElementSchema;
};

export const getLeftmostCoord = (elem) => {
  return Math.min(
    elem.aCoords.bl.x,
    elem.aCoords.br.x,
    elem.aCoords.tl.x,
    elem.aCoords.tr.x
  );
};

export const getRightmostCoord = (elem) => {
  return Math.max(
    elem.aCoords.bl.x,
    elem.aCoords.br.x,
    elem.aCoords.tl.x,
    elem.aCoords.tr.x
  );
};

export const getTopmostCoord = (elem) => {
  return Math.min(
    elem.aCoords.bl.y,
    elem.aCoords.br.y,
    elem.aCoords.tl.y,
    elem.aCoords.tr.y
  );
};

export const getBottommostCoord = (elem) => {
  return Math.max(
    elem.aCoords.bl.y,
    elem.aCoords.br.y,
    elem.aCoords.tl.y,
    elem.aCoords.tr.y
  );
};

// TODO: is duplicate of fetchFont
export const loadGoogleFont = (fontName) => {
  return new Promise(async (resolve, reject) => {
    try {
      var myfont = new FontFaceObserver(fontName);
      const res = await myfont.load();
      resolve(res);
    } catch (err) {
      console.log("font loading failed ", err);
      reject(err);
    }
  });
};

// UPLOAD IMAGE/SVG TO CANVAS PAGE
export const onSelectImage = (e, self) => {
  if (e.target.files && e.target.files.length > 0) {
    const reader = new FileReader();
    let fType = e.target.files[0].type.split("/")[1];
    let img = new Image();
    reader.addEventListener("load", () => {
      // TODO: handle svg and image separately
      if (
        reader.result.includes("data:image") &&
        !reader.result.includes("svg+xml")
      ) {
        img.src = reader.result;
        img.onload = function () {
          var myselectionblob = dataURLtoBlob(reader.result);
          self.setState({
            shouldSave: true,
            thumbnailUrl: reader.result,
            defaultFileType: fType,
            showDownloadBtn: false,
            fileDimensions: {
              height: img.height,
              width: img.width,
            },
            blob: myselectionblob,
          });
        };
      }
    });
    reader.readAsDataURL(e.target.files[0]);
  }
  //clear filereader to detect same file again if not changed on mutliple attempts
  e.target.value = "";
};

export const onAddImageFromFile = (e, self, pageHeight, pageWidth) => {
  if (e.target.files && e.target.files.length > 0) {
    const reader = new FileReader();
    // let fType = e.target.files[0].type.split("/")[1];
    let img = new Image();
    reader.addEventListener("load", () => {
      // TODO: handle svg and image separately
      if (
        reader.result.includes("data:image") &&
        !reader.result.includes("svg+xml")
      ) {
        img.src = reader.result;
        img.onload = function () {
          resetPage(self);
          const imgRatio = img.width / img.height;
          if (img.width > pageWidth || img.height > pageHeight) {
            if (imgRatio > 1) {
              //wider image
              if (img.width > 1280) {
                if (1280 / imgRatio > 768) {
                  dimensionChangeHandler(
                    "width",
                    parseInt(768 * imgRatio),
                    self
                  );
                  dimensionChangeHandler("height", 768, self);
                } else {
                  dimensionChangeHandler("width", 1280, self);
                  dimensionChangeHandler(
                    "height",
                    parseInt(1280 / imgRatio),
                    self
                  );
                }
              } else if (img.width > pageWidth) {
                dimensionChangeHandler("width", img.width, self);
                dimensionChangeHandler(
                  "height",
                  parseInt(img.width / imgRatio),
                  self
                );
              }
            } else {
              //longer image
              if (img.height > 768) {
                dimensionChangeHandler("width", parseInt(768 * imgRatio), self);
                dimensionChangeHandler("height", 768, self);
              } else if (img.height > pageHeight) {
                dimensionChangeHandler(
                  "width",
                  parseInt(img.height * imgRatio),
                  self
                );
                dimensionChangeHandler("height", img.height, self);
              }
            }
          } else {
            dimensionChangeHandler("width", img.width, self);
            dimensionChangeHandler("height", img.height, self);
          }
          addImage(reader.result, self);
        };
      }
    });
    reader.readAsDataURL(e.target.files[0]);
  }
  //clear filereader to detect same file again if not changed on mutliple attempts
  e.target.value = "";
};

export const onSelectSvg = (e, self) => {
  if (e.target.files && e.target.files.length > 0) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      // TODO: handle svg and image separately
      if (reader.result.includes("svg+xml"))
        addSVGToPage(reader.result, "300px", "300px", self);
    });
    reader.readAsDataURL(e.target.files[0]);
  }
  //clear filereader to detect same file again if not changed on mutliple attempts
  e.target.value = "";
};

export const handleJsonData = (event, self) => {
  const { toast } = self.props;
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  // Use FileReader to read the contents of the uploaded file.
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      // Parse the JSON data and store it in the state.
      let jsonData = JSON.parse(reader.result);
      const prevHash = jsonData.hash;
      delete jsonData.hash;
      const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(jsonData))
        .digest("hex");
      if (prevHash === hash || !prevHash) {
        // Soon, you won't be able to upload a file unless it has a hash value
        // Disabling existing hash since there are many templates that has to be uploaded
        // if (prevHash === hash) {
        applyJsonToCanvas(jsonData, self);
      } else {
        toast.error("Error", "Hash matching failed");
        Spinner.hideSpinner();
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      Spinner.hideSpinner();
    } finally {
      Spinner.hideSpinner();
    }
  };
  // Read the file as text.
  reader.readAsText(file);
};

export const dataURLtoBlob = (dataurl) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// RESET PAGE TO EMPTY PAGE
export const resetPage = (self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  canvasRef.clear();
  canvasRef.backgroundColor = "#ffffff";
  canvasRef.renderAll();
  self.setState({
    activeElementProps: {
      id: "",
      colors: [],
      ...Object.assign({}, FONT_PROPS_DEFAULT),
    },
    error: {
      height: false,
      width: false,
    },
    showStyleEditor: false,
    pageBgColor: "#ffffff",
    elementsDropDownData: [],
    selectedElementName: "No Element(s)",
  });
};

// PAGE DIMENSIONS HANDLER
export const dimensionChangeHandler = (key, value, self) => {
  if (key === "height") {
    if (inRange(value, 0, 2001)) {
      self.setState(
        {
          pageHeight: value,
          error: {
            height: false,
          },
        },
        () => {
          resizePage(self);
        }
      );
    } else {
      self.props.toast.error("Error", "Please provide appropriate height");
      self.setState({
        error: {
          height: true,
        },
      });
    }
  }
  if (key === "width") {
    if (inRange(value, 0, 2001)) {
      self.setState(
        {
          pageWidth: value,
          error: {
            width: false,
          },
        },
        () => {
          resizePage(self);
        }
      );
    } else {
      self.props.toast.error("Error", "Please provide appropriate width");
      self.setState({
        error: {
          width: true,
        },
      });
    }
  }
};

// ADD IMAGE TO CANVAS HANDLER
export const addImage = (url, self) => {
  const { pages, activePageID } = self.state;
  if (!activePageID) return;
  let count = countElementTypes("Image", self);
  const imgElementSchema = {
    id: getNewID(),
    type: "Image",
    name: "Image " + count,
    left: 0,
    top: 0,
    preselected: true,
    sendtoback: false,
    url,
    imageFit: "Show full Image", //contain= Show full Image, cover=Fit Image to boundary
    BorderX: 5,
    BorderY: 5,
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(imgElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const addSVGToPage = (svgURL, SVGHeight, SVGWidth, self) => {
  // svg will be added on active page
  const { activePageID, pages, pageHeight, pageWidth } = self.state;
  if (!activePageID) return;
  let zoomX = getSVGSize(SVGWidth, pageWidth, pageHeight);
  let zoomY = getSVGSize(SVGHeight, pageWidth, pageHeight);
  let zoom = zoomX > zoomY ? zoomY : zoomX;
  let count = countElementTypes("Svg", self);
  const svgElementSchema = {
    id: getNewID(),
    type: "Svg",
    url: svgURL,
    center: true,
    scaleX: zoom,
    scaleY: zoom,
    name: "Svg " + count,
    imageFit: "Show full Svg", //contain= Show full Svg, cover=Fit Svg to boundary
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(svgElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const applyJsonToCanvas = async (jsonData, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  canvasRef.clear();
  self.setState({
    showStyleEditor: false,
    selectedElementName: "No Element(s)",
  });
  const textObjects = jsonData.objects.filter((item) => {
    return item.type === "i-text";
  });
  for (const obj of textObjects) {
    await loadGoogleFont(obj?.fontFamily);
  }
  if (jsonData?.hasOwnProperty("background")) {
    self.setState({ pageBgColor: jsonData?.background });
  }
  if (jsonData?.hasOwnProperty("height")) {
    dimensionChangeHandler("height", jsonData?.height, self);
  }
  if (jsonData?.hasOwnProperty("width")) {
    dimensionChangeHandler("width", jsonData?.width, self);
  }
  canvasRef.loadFromJSON(jsonData, () => {
    canvasRef.renderAll.bind(canvasRef);
    canvasRef.getObjects().forEach((obj, index) => {
      obj.id = index + 1;
    });
    Spinner.hideSpinner();
  });
};

// UPDATE PAGE DIMENSIONS
export const resizePage = (self) => {
  const { pages, pageHeight, pageWidth } = self.state;
  const page = pages[0];
  const newPage = {
    ...page,
    style: {
      ...page.style,
      height: pageHeight,
      width: pageWidth,
    },
  };
  self.setState({
    // to add page
    pages: [newPage],
    activePageID: newPage.id,
  });
};

export const getSVGSize = (SVGsize, canvasPageWidth, canvasPageHeight) => {
  // taking out 0th index value and converting into Number for compare
  const canvasOriginalWidth = Number(canvasPageWidth);
  const canvasOriginalHeight = Number(canvasPageHeight);
  let SVGSize;
  if (SVGsize) {
    if (SVGsize > (canvasOriginalWidth || canvasOriginalHeight)) {
      // setting the scale value in ratio of 0 to 1
      SVGSize = 0.5;
    } else {
      SVGSize = 1;
    }
    return SVGSize;
  }
  // returning 1 if SVGsize undefine so that we can add svg by add SVG button
  return 1;
};

export const updateActiveElement = (id, name, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  if (canvasRef.getActiveObject()?.customName === true) {
    self.setState({
      selectedElementId: id,
      selectedElementName: canvasRef.getActiveObject().changeName,
    });
  } else {
    self.setState({
      selectedElementId: id,
      selectedElementName: name,
    });
  }
  const elem = canvasRef.getObjects().find((i) => {
    return i.id === id;
  });
  if (elem) {
    canvasRef.setActiveObject(elem);
  } else {
    const bubble = canvasRef.getObjects().find((i) => {
      return i.bubbleId === id && i.customType === "SpeechBubble";
    });
    if (bubble !== undefined) {
      canvasRef.setActiveObject(bubble);
    }
  }
  canvasRef.requestRenderAll();
};

export const getTopPoints = (llimit, rlimit, Height, Width) => {
  let newPoints = [];
  newPoints.push({ x: llimit, y: 30 }); //0
  newPoints.push({
    x: llimit + Width / 2 - 8,
    y: 30,
  }); //1
  newPoints.push({
    x: Width / 2,
    y: 0,
  }); //2
  newPoints.push({
    x: llimit + 8 + Width / 2,
    y: 30,
  }); //3
  newPoints.push({ x: rlimit, y: 30 }); //4
  newPoints.push({ x: rlimit, y: Height / 2 - 8 + 30 }); //5
  newPoints.push({ x: rlimit, y: Height / 2 + 30 }); //6
  newPoints.push({ x: rlimit, y: Height / 2 + 8 + 30 }); //7
  newPoints.push({ x: rlimit, y: Height + 30 }); //8
  newPoints.push({
    x: llimit + 8 + Width / 2,
    y: Height + 30,
  }); //9
  newPoints.push({ x: Width / 2, y: Height + 30 }); //10
  newPoints.push({
    x: llimit - 8 + Width / 2,
    y: Height + 30,
  }); //11
  newPoints.push({ x: llimit, y: Height + 30 }); //12
  newPoints.push({ x: llimit, y: Height / 2 + 8 + 30 }); //13
  newPoints.push({ x: 0, y: Height / 2 + 30 }); //14
  newPoints.push({ x: llimit, y: Height / 2 - 8 + 30 });
  return newPoints;
};

export const getBotomPoints = (llimit, rlimit, Height, Width) => {
  let newPoints = [];
  newPoints.push({ x: llimit, y: 0 }); //0
  newPoints.push({
    x: llimit + Width / 2 - 8,
    y: 0,
  }); //1
  newPoints.push({
    x: Width / 2,
    y: 0,
  }); //2
  newPoints.push({
    x: llimit + 8 + Width / 2,
    y: 0,
  }); //3
  newPoints.push({ x: rlimit, y: 0 }); //4
  newPoints.push({ x: rlimit, y: Height / 2 - 8 }); //5
  newPoints.push({ x: rlimit, y: Height / 2 }); //6
  newPoints.push({ x: rlimit, y: Height / 2 + 8 }); //7
  newPoints.push({ x: rlimit, y: Height }); //8
  newPoints.push({
    x: llimit + 4 + Width / 2,
    y: Height,
  }); //9
  newPoints.push({ x: Width / 2, y: Height + 30 }); //10
  newPoints.push({
    x: llimit - 4 + Width / 2,
    y: Height,
  }); //11
  newPoints.push({ x: llimit, y: Height }); //12
  newPoints.push({ x: llimit, y: Height / 2 + 8 }); //13
  newPoints.push({ x: 0, y: Height / 2 }); //14
  newPoints.push({ x: llimit, y: Height / 2 - 8 });
  return newPoints;
};

export const getRightPoints = (llimit, rlimit, Height, Width) => {
  let newPoints = [];
  newPoints.push({ x: llimit, y: 0 }); //0
  newPoints.push({
    x: llimit + Width / 2 - 8,
    y: 0,
  }); //1
  newPoints.push({
    x: Width / 2,
    y: 0,
  }); //2
  newPoints.push({
    x: llimit + 8 + Width / 2,
    y: 0,
  }); //3
  newPoints.push({ x: rlimit - 30, y: 0 }); //4
  newPoints.push({ x: rlimit - 30, y: Height / 2 - 8 }); //5
  newPoints.push({ x: rlimit, y: Height / 2 }); //6
  newPoints.push({ x: rlimit - 30, y: Height / 2 + 8 }); //7
  newPoints.push({ x: rlimit - 30, y: Height }); //8
  newPoints.push({ x: llimit + 8 + Width / 2, y: Height }); //9
  newPoints.push({ x: Width / 2, y: Height }); //10
  newPoints.push({ x: llimit - 8 + Width / 2, y: Height }); //11
  newPoints.push({ x: llimit, y: Height }); //12
  newPoints.push({ x: llimit, y: Height / 2 + 8 }); //13
  newPoints.push({ x: 0, y: Height / 2 }); //14
  newPoints.push({ x: llimit, y: Height / 2 - 8 }); //15
  return newPoints;
};

export const getLeftPoints = (llimit, rlimit, Height, Width) => {
  let newPoints = [];
  newPoints.push({ x: llimit, y: 0 }); //0
  newPoints.push({
    x: Width / 2 - 8 + 30,
    y: 0,
  }); //1
  newPoints.push({
    x: Width / 2 + 30,
    y: 0,
  }); //2
  newPoints.push({
    x: Width / 2 + 8 + 30,
    y: 0,
  }); //3
  newPoints.push({ x: rlimit, y: 0 }); //4
  newPoints.push({ x: rlimit, y: Height / 2 - 8 }); //5
  newPoints.push({ x: rlimit, y: Height / 2 }); //6
  newPoints.push({ x: rlimit, y: Height / 2 + 8 }); //7
  newPoints.push({ x: rlimit, y: Height }); //8
  newPoints.push({ x: Width / 2 + 8 + 30, y: Height }); //9
  newPoints.push({ x: Width / 2 + 30, y: Height }); //10
  newPoints.push({ x: Width / 2 - 8 + 30, y: Height }); //11
  newPoints.push({ x: llimit, y: Height }); //12
  newPoints.push({ x: llimit, y: Height / 2 + 8 }); //13
  newPoints.push({ x: 0, y: Height / 2 }); //14
  newPoints.push({ x: llimit, y: Height / 2 - 8 }); //15
  return newPoints;
};

export const createNewPoly = (strokeWidth, textbox, arrow) => {
  let newPoints = [];
  const Width = textbox.width + 2 * textbox.polyPadding;
  const Height = textbox.getBoundingRect().height + 2 * textbox.polyPadding + 3;
  let newPolyLeft =
    textbox.getBoundingRect().left - textbox.polyPadding - strokeWidth / 2;
  let newPolyTop =
    textbox.getBoundingRect().top - 2 - textbox.polyPadding - strokeWidth / 2;
  let llimit = 0;
  let rlimit = Width;
  switch (arrow) {
    case "Left":
      llimit = 30;
      rlimit = Width + 30;
      newPoints = getLeftPoints(llimit, rlimit, Height, Width);
      newPolyLeft = newPolyLeft - 30;
      break;
    case "Right":
      rlimit = Width + 30;
      newPoints = getRightPoints(llimit, rlimit, Height, Width);
      break;
    case "Top":
      newPoints = getTopPoints(llimit, rlimit, Height, Width);
      newPolyTop -= 30;
      break;
    case "Bottom":
      newPoints = getBotomPoints(llimit, rlimit, Height, Width);
      break;
    default:
      console.log("unknown value", arrow);
      break;
  }
  return { newPoints, newPolyLeft, newPolyTop };
};

export const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return (inst) => {
    for (const ref of filteredRefs) {
      if (typeof ref === "function") {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

export const tooltipClass = (tooltipDirection) => {
  switch (tooltipDirection) {
    case "right":
      return "tooltip tooltip-right";
    case "left":
      return "tooltip tooltip-left";
    case "bottom":
      return "tooltip tooltip-bottom";
    case "top":
      return "tooltip";
    case "top-left":
      return "tooltip tooltip-top-left";
    case "bottom-left":
      return "tooltip tooltip-bottom-left";
    case "bottom-right":
      return "tooltip tooltip-bottom-right";
    default:
      return "tooltip";
  }
};

export const downloadPage = (self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  const fileSVGData = canvasRef.toDataURL();
  saveAs(fileSVGData, "canvas.png");
};

export const handleNameElement = (val, self) => {
  const _canvas = Object.values(self.state.canvases)[0];
  if (_canvas.getActiveObject()?.customName === true) {
    _canvas.getActiveObject().name =
      _canvas.getActiveObject().changeName !== ""
        ? _canvas.getActiveObject().changeName
        : _canvas.getActiveObject()?.text;
  }
  if (_canvas.getActiveObject())
    _canvas.getActiveObject().name = val
      ? val
      : _canvas.getActiveObject()?.text;
  if (_canvas.getActiveObject()?.customName === true) {
    self.setState({
      selectedElementName: _canvas?.getActiveObject()?.changeName,
    });
  } else {
    self.setState({
      selectedElementName: val,
    });
  }
};

export const deleteSelection = (self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  const activeObjects = canvasRef.getActiveObjects();
  canvasRef.remove(...activeObjects);
  canvasRef.discardActiveObject();
  self.setState({ selectedElementName: "No Element(s) Selected" });
};

export const undoAction = (self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  canvasRef.undo(() => {
    canvasRef.getObjects().forEach((item) => {
      if (item.id === self.state.selectedElementId) {
        if (item.url) {
          self.setState(
            {
              showStyleEditor: true,
              selectedElementName: item.name,
              selectedElementId: item.id,
              activeElementProps: {
                ...self.state.activeElementProps,
                URL: item.url,
                colors: [],
              },
            },
            () => {
              canvasRef.setActiveObject(item);
            }
          );
        }
        self.setState({
          showStyleEditor: true,
          selectedElementName: item.name,
          selectedElementId: item.id,
        });
      }
    });
  });
};

// DOWNLOAD SELECTED OBJECTS/ITEMS
export const downloadSelection = (self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  const selected = cloneDeep(canvasRef.getActiveObject());
  if (selected) {
    const fileSVGData2 = selected.toDataURL();
    var myblob = dataURLtoBlob(fileSVGData2);
    saveAs(myblob, "object.png");
  } else {
    downloadPage(self);
  }
};

export const addTriangle = (self) => {
  const { pages, activePageID } = self.state;
  if (!activePageID) return;
  let count = countElementTypes("triangle", self);
  const triangleElementSchema = {
    id: getNewID(),
    type: "triangle",
    name: "Triangle " + count,
    selectable: true,
    ...Object.assign({}, SHAPES_PROPS_DEFAULT),
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(triangleElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const addCircle = (self) => {
  const { pages, activePageID } = self.state;
  if (!activePageID) return;
  let count = countElementTypes("circle", self);
  const circleElementSchema = {
    id: getNewID(),
    type: "circle",
    name: "Circle " + count,
    radius: 50,
    selectable: true,
    ...Object.assign({}, SHAPES_PROPS_DEFAULT),
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(circleElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const addLine = (type, self) => {
  const { pages, activePageID } = self.state;
  if (!activePageID) return;
  let count = countElementTypes("line", self);
  const lineElementSchema = {
    id: getNewID(),
    padding: 10,
    type: "line",
    name: "Line " + count,
    points: [50, 100, 200, 100],
    strokeDashArray: type === ACTIONS.ADD_DASHED_LINE ? [5, 5] : [],
    selectable: true,
    ...Object.assign({}, LINE_PROPS_DEFAULT),
  };
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(lineElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const getQuadraticSchema = (canvasRef) => {
  let count = 1;
  canvasRef.getObjects().forEach((item) => {
    if (item?.customType === "Quadratic") {
      count++;
    }
  });
  return {
    id: getNewID(),
    type: "Quadratic",
    name: "Quadratic " + count,
    ...Object.assign({}, QUADRATIC_PROPS_DEFAULT),
  };
};

export const addQuadratic = (self) => {
  const { pages, activePageID } = self.state;
  const canvasRef = Object.values(self.state.canvases)[0];
  const quadraticElementSchema = getQuadraticSchema(canvasRef);
  const _pagesNext = produce(pages, (draftState) => {
    const activePage = draftState.find((p) => p.id === activePageID);
    activePage.elements.push(quadraticElementSchema);
  });
  self.setState({ pages: _pagesNext });
};

export const alignGroupHorizontally = (alignment, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  //active selection container
  const activeElem = canvasRef.getActiveObject();
  if (!activeElem) return;
  //all objects in selection
  const objects = activeElem.getObjects();
  //active selection left coord
  const containerLeft = parseInt(activeElem.left);
  //active selection right coord
  const containerRight = parseInt(activeElem.left + activeElem.width);
  //active selection width
  const containerWidth = activeElem.width;
  let needChange = false;
  if (alignment === "left") {
    canvasRef.discardActiveObject();
    objects.forEach((obj) => {
      let leftmost = getLeftmostCoord(obj);
      //check if change is needed(update if difference is greater than 1 pixel)
      if (leftmost - containerLeft >= 1 || leftmost - containerLeft <= -1) {
        needChange = true;
      }
    });
    createSelectionFromObject(objects, self);
    if (needChange) {
      canvasRef.discardActiveObject();
      objects.forEach((obj) => {
        //left coord for rotated/scaled/transformed object
        let leftmost = getLeftmostCoord(obj);
        obj.left = containerLeft + (obj.left - leftmost);
      });
      canvasRef._historySaveAction();
      createSelectionFromObject(objects, self);
    }
  } else if (alignment === "center") {
    let centerCoord = null;
    canvasRef.discardActiveObject();
    objects.forEach((obj) => {
      //left coord for rotated/scaled/transformed object
      let leftmost = getLeftmostCoord(obj);
      //right coord for rotated/scaled/transformed object
      let rightmost = getRightmostCoord(obj);
      //effective width for rotated/scaled/transformed object
      let objectWidth = rightmost - leftmost;
      centerCoord =
        containerWidth / 2 -
        objectWidth / 2 +
        containerLeft +
        (obj.left - leftmost);
      if (obj.left - centerCoord >= 1 || obj.left - centerCoord <= 1)
        needChange = true;
    });
    createSelectionFromObject(objects, self);
    if (needChange) {
      canvasRef.discardActiveObject();
      objects.forEach((obj) => {
        //left coord for rotated/scaled/transformed object
        let leftmost = getLeftmostCoord(obj);
        //right coord for rotated/scaled/transformed object
        let rightmost = getRightmostCoord(obj);
        //effective width for rotated/scaled/transformed object
        let objectWidth = rightmost - leftmost;
        obj.left =
          containerWidth / 2 -
          objectWidth / 2 +
          containerLeft +
          (obj.left - leftmost);
      });
      canvasRef._historySaveAction();
      createSelectionFromObject(objects, self);
    }
  } else if (alignment === "right") {
    canvasRef.discardActiveObject();
    objects.forEach((obj) => {
      //right coord for rotated/scaled/transformed object
      let rightmost = getRightmostCoord(obj);
      if (rightmost - containerRight >= 1 || rightmost - containerRight <= -1)
        needChange = true;
    });
    createSelectionFromObject(objects, self);
    if (needChange) {
      canvasRef.discardActiveObject();
      objects.forEach((obj) => {
        //right coord for rotated/scaled/transformed object
        let rightmost = getRightmostCoord(obj);
        obj.left = containerRight + (obj.left - rightmost);
      });
      canvasRef._historySaveAction();
      createSelectionFromObject(objects, self);
    }
  }
  canvasRef.requestRenderAll();
};

export const createSelectionFromObject = (objects, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];
  var selection = new fabric.ActiveSelection(objects, {
    canvas: canvasRef,
  });
  canvasRef.setActiveObject(selection);
};

// Function to evenly space selected objects in a given alignment (horizontal/vertical).
export const spaceGroupEvenly = (alignment, self) => {
  const canvasRef = Object.values(self.state.canvases)[0];

  // Get the currently selected objects on the canvas.
  const selectedObjects = canvasRef.getActiveObjects();

  // If there are fewer than or equal to 2 selected objects, return without any changes.
  if (selectedObjects.length <= 2) return;

  // Get the bounding rectangle of the selected objects.
  const selectedObject = canvasRef.getActiveObject();
  const bounding = selectedObject.getBoundingRect();

  if (alignment === "horizontal") {
    handleHorizontalSpace(selectedObjects, bounding);
  } else {
    handleVerticalSpace(selectedObjects, bounding);
  }
  canvasRef.renderAll();
};

// Function to handle horizontal spacing of selected objects.
export const handleHorizontalSpace = (activeObjects, bounding) => {
  // Sort selected objects based on their left coordinate in ascending order (from left to right).
  const sortedObjects = activeObjects.sort((a, b) => {
    return a.left - b.left;
  });

  // Calculate the total width of all transformed objects.
  let totalTransformedWidth = 0;
  activeObjects.forEach((obj) => {
    const boundingRect = obj.getBoundingRect(true);
    totalTransformedWidth += boundingRect.width;
  });

  // Calculate the total gap between objects and the number of gaps.
  const totalGap = bounding.width - totalTransformedWidth;
  const gapCount = activeObjects.length - 1;
  const gap = totalGap / gapCount;

  // Apply spacing to the objects.
  for (let i = 1; i <= gapCount; i++) {
    const prevObject = sortedObjects[i - 1].getBoundingRect(true);
    sortedObjects[i].left = prevObject.left + prevObject.width + gap;
    sortedObjects[i].setCoords();
  }
};

// Function to handle vertical spacing of selected objects.
export const handleVerticalSpace = (activeObjects, bounding) => {
  // Sort selected objects based on their top coordinate in ascending order (from top to bottom).
  const sortedObjects = activeObjects.sort((a, b) => {
    return a.top - b.top;
  });
  // Calculate the total height of all transformed objects.
  let totalTransformedHeight = 0;
  activeObjects.forEach((obj) => {
    const boundingRect = obj.getBoundingRect(true);
    totalTransformedHeight += boundingRect.height;
  });

  // Calculate the total gap between objects and the number of gaps.
  const totalGap = bounding.height - totalTransformedHeight;
  const gapCount = activeObjects.length - 1;
  const gap = totalGap / gapCount;

  // Apply spacing to the objects.
  for (let i = 1; i <= gapCount; i++) {
    const prevObject = sortedObjects[i - 1].getBoundingRect(true);
    sortedObjects[i].top = prevObject.top + prevObject.height + gap;
    sortedObjects[i].setCoords();
  }
};

export const uploadTemplateModal = async (self) => {
  // const modalConfig = Object.assign(MODAL_INTERFACE);
  let fileName = "";
  const { asset } = self.props;
  const parentNodeId = asset.reservedNodes.coverImages;
  let allNames = [];
  let imgNodes = [];
  let JsonNodes = [];
  const canvasRef = Object.values(self.state.canvases)[0];
  const fileSVGData = canvasRef.toDataURL({
    format: "jpeg",
    quality: 0.8,
  });
  try {
    // const reqConfig = cloneDeep(REQ_CONFIG);
    // reqConfig.cacheInvalidate = true;
    const files = await self.props.getFiles(
      asset._id,
      { parentNodeId }
      // reqConfig
    );
    const imageNodes = files.nodes.filter((image) => {
      return image.meta.document.mimetype === "image/jpeg";
    });
    const JsonFiles = files.nodes.filter((json) => {
      return json.meta.document.mimetype === "application/json";
    });
    JsonFiles.forEach((JsonNode) => {
      JsonNodes.push(JsonNode);
    });
    imageNodes.forEach((imageNode) => {
      imgNodes.push(imageNode);
      allNames.push(imageNode.name.replace(".jpeg", ""));
    });
  } catch (error) {
    console.log(error);
  } finally {
    // modalConfig.resData = "";
    // modalConfig.title = ["Cover Image name", "center"];
    // modalConfig.btns = [];
    // modalConfig.config = ["500px"];
    // modalConfig.withJsx = (
    //   <>
    //     <SaveTemplateModal
    //       JsonNodes={JsonNodes}
    //       imgNodes={imgNodes}
    //       allNames={allNames}
    //       fileName={fileName}
    //       currImgDataUrl={fileSVGData}
    //       onFileNameChange={(name) => {
    //         fileName = name;
    //       }}
    //       onCancel={() => {
    //         Modal.hide();
    //         self.setState({ modalActive: false });
    //       }}
    //       onSave={() => {
    //         uploadTemplate(fileName, Modal, self);
    //       }}
    //       onOverWrite={(imageNode, JsonNode) => {
    //         //call patch api instead of post api for image and json
    //         updateTemplate(imageNode, JsonNode, self);
    //         Modal.hide();
    //       }}
    //     />
    //   </>
    // );
    // Modal.show(modalConfig, true);
    self.setState({ modalActive: true });
  }
};

export const copyToClipboard = (val) => {
  const selBox = document.createElement("textarea");
  selBox.style.position = "fixed";
  selBox.style.left = "0";
  selBox.style.top = "0";
  selBox.style.opacity = "0";
  selBox.innerText = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand("copy");
  document.body.removeChild(selBox);
};
