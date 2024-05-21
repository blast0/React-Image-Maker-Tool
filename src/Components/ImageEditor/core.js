import { fabric } from "fabric";
import { cloneDeep } from "lodash";
import {
  scaleElementTofitCanvas,
  addPattern,
  getNewID,
  loadGoogleFont,
} from "./helper-functions";
import { INITIAL_PATH, svg } from "./constants";
import Spinner from "../Spinner/manager";

class CanvasCore {
  constructor() {
    // ref to fabric canvas element
    this.__canvas = null;
  }

  createCanvas(cid, cProps) {
    // Make a New Canvas
    this.__canvas = new fabric.Canvas(`canvas-${cid}`, {
      // Indicates whether objects should remain in current stack position when selected.
      // When false objects are brought to top and rendered as part of the selection group
      preserveObjectStacking: true,
      ...cProps,
    });
    return this.__canvas;
  }

  async _init(config) {
    const { canvasId, backgroundImage, ...canvasProps } = config;
    const _canvasProps = {
      ...canvasProps,
    };
    // finally create the canvas
    const _canvas = this.createCanvas(canvasId, _canvasProps);
    const _original_initHiddenTextarea =
      fabric.IText.prototype.initHiddenTextarea;
    fabric.util.object.extend(
      fabric.IText.prototype,
      /** @lends fabric.IText.prototype */ {
        //fix for : IText not editable when canvas is in a fullscreen element on chrome
        // https://github.com/fabricjs/fabric.js/issues/5126
        initHiddenTextarea: function () {
          _original_initHiddenTextarea.call(this);
          this.canvas.wrapperEl.appendChild(this.hiddenTextarea);
        },
      }
    );
    return _canvas;
  }

  getRef() {
    return this.__canvas;
  }

  getJSON() {
    return JSON.stringify(this.__canvas);
  }

  async addText(text, options) {
    fabric.charWidthsCache = {};
    if (!this.__canvas) return;
    const textElement = new fabric.IText(text, {
      ...options,
      isEditable: true,
      id: getNewID(),
    });
    if (!options?.fontFamily) return textElement;

    // try to load google font
    try {
      Spinner.showSpinner();
      await loadGoogleFont(options?.fontFamily);
    } catch (error) {
      console.log("error loading google font ", error);
      this.__canvas.add(textElement);
      Spinner.hideSpinner();
      if (options.preselected) {
        textElement.preselected = options.preselected;
      }
      return textElement;
    } finally {
      this.__canvas.add(textElement);
      Spinner.hideSpinner();
      if (options.preselected) {
        textElement.preselected = options.preselected;
      }
      return textElement;
    }
  }

  addTriangle(options) {
    if (!this.__canvas) return;
    const triangleElement = new fabric.Triangle({
      ...options,
      id: getNewID(),
    });
    this.__canvas.add(triangleElement);
    return triangleElement;
  }

  removeElement(element) {
    this.__canvas.remove(element);
  }

  addCircle(options) {
    if (!this.__canvas) return;
    const circleElement = new fabric.Circle({
      ...options,
      id: getNewID(),
    });
    this.__canvas.add(circleElement);
    return circleElement;
  }

  addLine(options) {
    if (!this.__canvas) return;
    const lineElement = new fabric.Line(options.points, {
      ...options,
      id: getNewID(),
    });
    this.__canvas.add(lineElement);
    return lineElement;
  }

  addImgFromURL(url, options) {
    return new Promise((resolve, reject) => {
      if (!this.__canvas) return;
      const { cover, ...restOptions } = options;
      let canvas = this.__canvas;
      let img = new Image();
      let imageFit = options?.imageFit;
      img.crossOrigin = "anonymous";
      img.src = url;
      Spinner.showSpinner();
      img.onload = function () {
        Spinner.hideSpinner();
        let image = new fabric.Image(img, {
          ...restOptions,
          id: options?.id ? options.id : getNewID(),
          crossOrigin: "anonymous",
          URL: url,
          isUrlValid: true,
        });
        if (imageFit) {
          scaleElementTofitCanvas(imageFit, canvas.height, canvas.width, image);
        }
        canvas.add(image);
        if (restOptions.sendtoback) {
          image.sendToBack();
        }
        if (options.preselected) {
          image.preselected = options.preselected;
        }
        resolve(image);
      };
    });
  }

  addImgAsPatternFromURL(url, options, cb) {
    return new Promise((resolve, reject) => {
      if (!this.__canvas) return;
      const { cover, ...restOptions } = options;
      let canvas = this.__canvas;
      let containerElem = null;
      if (restOptions?.containerType === "circle") {
        containerElem = new fabric.Circle({
          radius: restOptions?.height / 2,
          name: restOptions?.name,
          id: getNewID(),
          BorderLock: true,
          fill: "rgba(0 0 0 0)",
          left: (canvas.width - restOptions?.width) / 2,
          top: (canvas.height - restOptions?.height) / 2,
          stroke: "#000",
          strokeWidth: 0,
          URL: url,
        });
      } else if (restOptions?.containerType === "triangle") {
        containerElem = new fabric.Triangle({
          height: restOptions?.height,
          width: restOptions?.width,
          name: restOptions?.name,
          id: getNewID(),
          BorderLock: true,
          fill: "rgba(0 0 0 0)",
          backgroundColor: "rgba(255,255,255,0)",
          left: (canvas.width - restOptions?.width) / 2,
          top: (canvas.height - restOptions?.height) / 2,
          stroke: "#000",
          strokeWidth: 0,
          URL: url,
        });
      } else {
        containerElem = new fabric.Rect({
          height: restOptions?.height,
          width: restOptions?.width,
          name: restOptions?.name,
          rx: 0,
          ry: 0,
          id: getNewID(),
          BorderLock: true,
          fill: "rgba(0 0 0 0)",
          left: 0,
          top: 0,
          stroke: "#000",
          strokeWidth: 0,
          URL: url,
        });
      }
      canvas.add(containerElem);
      canvas.setActiveObject(containerElem);
      if (restOptions.sendtoback) {
        containerElem.sendToBack();
      }
      addPattern(url, canvas, (newProps) => {
        canvas.requestRenderAll();
        if (options.preselected) {
          containerElem.preselected = options.preselected;
        }
        resolve(containerElem);
      });
    });
  }

  addRect(options, position) {
    if (!this.__canvas) return;
    const _rect = new fabric.Rect({
      ...options,
      id: getNewID(),
    });
    if (position) {
      _rect.top = position.top / 2 + 70;
      _rect.left = position.left / 2 - 70;
    }
    this.__canvas.add(_rect);
    this.__canvas.bringToFront(_rect);
    return _rect;
  }

  addTextBox(text, options) {
    if (!this.__canvas) return;
    const textbox = new fabric.Textbox(text, {
      ...options,
      id: getNewID(),
    });
    return textbox;
  }

  addSVGFromURL(url, options) {
    const promise = new Promise((resolve, reject) => {
      if (!this.__canvas) reject();
      let canvas = this.__canvas;
      let imageFit = options?.imageFit;
      const { center, cover, ...restOptions } = options;
      fabric.loadSVGFromURL(url, (objects, svgOptions) => {
        const svg = fabric.util.groupSVGElements(objects, {
          id: getNewID(),
          ...svgOptions,
          ...restOptions,
          type: "group",
        });
        if (imageFit) {
          scaleElementTofitCanvas(imageFit, canvas.height, canvas.width, svg);
        }
        this.__canvas.add(svg);
        resolve(svg);
      });
    });
    return promise;
  }

  drawQuadratic(options) {
    if (!this.__canvas) return;
    const curve = new fabric.Path(
      `M ${INITIAL_PATH.p0}, Q ${INITIAL_PATH.p1} ${INITIAL_PATH.p2}`,
      {
        ...options,
      }
    );
    return curve;
  }

  makeQuadGroup(ObjectsArray) {
    if (!this.__canvas) return;
    const group = new fabric.Group(ObjectsArray);
    group.name = "QuadraticArrow";
    group.setControlsVisibility({
      tl: false,
      tr: false,
      br: false,
      bl: false,
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: false,
    });
    group.name = "QuadraticArrow";
    return group;
  }

  makeEndTriangle(options, left, top, line1, line2, line3) {
    if (!this.__canvas) return;
    const triangle = new fabric.Triangle({
      id: getNewID(),
      left: left,
      top: top,
      ...options,
    });
    triangle.line1 = line1;
    triangle.line2 = line2;
    triangle.line3 = line3;
    triangle.angle = this.getAngle(line1, line3);
    return triangle;
  }

  getAngle(line1, line3) {
    let x1, y1, x2, y2;

    if (line1) {
      // If line1 is provided (for left arrow)
      x1 = line1.path[0][1]; // Get the x-coordinate of the start point
      y1 = line1.path[0][2]; // Get the y-coordinate of the start point
      x2 = line1.path[1][1]; // Get the x-coordinate of the control point
      y2 = line1.path[1][2]; // Get the y-coordinate of the control point
    } else if (line3) {
      // If line3 is provided (for right arrow)
      x1 = line3.path[1][3]; // Get the x-coordinate of the control point
      y1 = line3.path[1][4]; // Get the y-coordinate of the control point
      x2 = line3.path[1][1]; // Get the x-coordinate of the end point
      y2 = line3.path[1][2]; // Get the y-coordinate of the end point
    } else {
      return 0; // Return 0 if no line is provided
    }

    // Calculate the angle in radians
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);

    // Convert the angle from radians to degrees
    const angleDegrees = fabric.util.radiansToDegrees(angleRadians);

    // Adjust the angle by subtracting 90 degrees
    return angleDegrees - 90;
  }

  createArrow(idType, groupArray) {
    const groupObject = new fabric.Group(groupArray, {
      id: `${idType}` + getNewID(),
      name: `${idType}` + getNewID(),
      customType: "arrow",
    });
    this.__canvas.add(groupObject);
    groupArray.forEach((e) => {
      this.removeElement(e);
    });
    this.__canvas.setActiveObject(groupObject);
    return groupObject;
  }

  makeControlPoint(options, left, top) {
    if (!this.__canvas) return;
    const points = new fabric.Path(svg, {
      left: left,
      top: top,
      ...options,
    });
    return points;
  }

  addSVGFromURL__Experimental(url, options) {
    const promise = new Promise((resolve, reject) => {
      if (!this.__canvas) reject();
      fabric.loadSVGFromURL(url, (objects, options) => {
        const svg = fabric.util.groupSVGElements(objects, {
          ...options,
        });
        this.__canvas.add(svg);
        svg.center();
        this.__canvas.renderAll();
        svg.setCoords();
        const renderedFragments = svg.getObjects();
        // group path 2 and 4 (start index = 0 )
        // remove the items
        const rightStroke = objects.splice(5, 1)[0];
        const rightFill = objects.splice(2, 1)[0];
        const rightGroup = fabric.util.groupSVGElements([
          cloneDeep(rightStroke),
          cloneDeep(rightFill),
        ]);
        rightGroup.set({
          left:
            svg.left + svg.width / 2 + renderedFragments[5].left * svg.scaleX,
          top: svg.top + svg.width / 2 + renderedFragments[5].top * svg.scaleY,
        });
        this.__canvas.remove(svg);
        this.__canvas.add.apply(this.__canvas, renderedFragments);
        this.__canvas.add(rightGroup);
        this.__canvas.renderAll();
        resolve(svg);
      });
    });

    return promise;
  }
}

export default CanvasCore;
