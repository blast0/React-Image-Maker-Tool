import React, { Component } from "react";
import { fabric } from "fabric";
import _, { noop } from "lodash";
// LOCAL COMPONENTS / METHODS
import CanvasCore from "../core";
import PopupContainer from "../../popmenu/popup-container";
import PopMenuPortal from "../../popmenu/popmenu-portal";
import {
  ACTIONS,
  ARROW_HEAD,
  ARROW_HEAD_POSITION,
  CANVAS_CONTEXT_MENU_ITEMS,
  DeleteIcon,
  CloneIcon,
  INITIAL_PATH,
  RESET_ACTIVE_ELEM_PROPS,
} from "../constants";
import {
  scaleElementTofitCanvas,
  alignElementToCenter,
  createNewPoly,
  // getNextSpeechLabelSchema,
  // getNextSpeechBubbleSchema,
  getQuadraticSchema,
  getNewID,
  roundToDecimal,
} from "../helper-functions";
// CONSTANTS
import "../history";
// STYLE
import "./canvas.css";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // keeping only ids
      elementsRendered: [],
      activeColorIndex: null,
      showContextmenu: false,
      contextMenuProps: {},
      placementShiftMax: 5,
      placementShifted: {
        "i-text": 0,
        rect: 0,
        circle: 0,
        triangle: 0,
        line: 0,
        Svg: 0,
        Image: 0,
        Quadratic: 0,
        SpeechBubble: 0,
      },
      elementPlaceMent: [],
    };
    this.containerRef = React.createRef();
    this.contextMenuRef = React.createRef();
    this._core = null;
    this.activeElement = null;
    // fn binds
    this.handlePageItemClick = this.handlePageItemClick.bind(this);
    this.clearActiveElement = this.clearActiveElement.bind(this);
    this.actionHandler = this.actionHandler.bind(this);
    this.getObjectSizeWithStroke = this.getObjectSizeWithStroke.bind(this);
    this.anchorWrapper = this.anchorWrapper.bind(this);
    this.canvasRef = null;
  }

  handleLeftClickOnCanvasItem(e) {
    // hide context menu
    this.setState({ showContextmenu: false });
    this.clearActiveElement();
    // propagate event to parent
    this.props.onPageClick(e);
  }

  handleRightClickOnCanvasItem(e) {
    if (e.e.button === 2) {
      if (e.target) {
        this.canvasRef.setActiveObject(e.target);
        this.canvasRef.renderAll();
        const editableProps = this.extractEditableProps(e);
        if (!this.props.showStyleEditor) {
          // calculate new offsets for <PlaceElement>
          const offsetProps = this.extractOffsetProps(null, e.target);
          const newActiveElementProps = {
            ...this.props.activeElementProps,
            ...editableProps,
            ...offsetProps,
            id: e.target?.id,
          };
          this.props.onElemSelect(true, newActiveElementProps);
        }
      }
    }
  }

  hideStyleEditorForActiveObject() {
    if (this.props.showStyleEditor) {
      this.props.onElemSelect(false);
    }
  }

  handleAfterMouseClickOnCanvas(e) {
    if (!e.target) return; // only work when mouse:up happens on a canvas element
    const editableProps = this.extractEditableProps(e);
    if (!this.props.showStyleEditor) {
      // calculate new offsets for <PlaceElement>
      const offsetProps = this.extractOffsetProps(e);
      const newActiveElementProps = {
        ...this.props.activeElementProps,
        ...editableProps,
        ...offsetProps,
        id: e.target?.id,
      };
      this.props.onElemSelect(true, newActiveElementProps);
    }
  }

  /**
   * re-attach passed event on canvas items
   * @param {string} eventName
   * @returns
   */
  onOffObjectEvents(eventName) {
    if (!eventName) return;
    // get ref to canvas object
    const self = this;
    this.canvasRef.getObjects().forEach(function (o) {
      // to avoid attaching multiple handlers, first remove listeners from all objects
      o.off(eventName, self.handlePageItemClick);
      setTimeout(() => {
        o.on(eventName, self.handlePageItemClick);
      }, 0);
    });
  }

  // when we edit the textbox and its height or width changes, reposition the polygon points
  handlePolygonResizeOnTextBoxSizeChange(e, _canvas) {
    const SpeechText = e.target;
    const SpeechPoly = _canvas.getObjects().find((item) => {
      return (
        item?.name === "SpeechPoly" && item.bubbleId === SpeechText.bubbleId
      );
    });
    const textBoxHeight = SpeechText.getBoundingRect().height;
    const textBoxHeightDiff = textBoxHeight - SpeechText.lastHeight;
    if (textBoxHeightDiff > 0 || textBoxHeightDiff < 0) {
      SpeechPoly.points.forEach((point, index) => {
        if (index > 4 && index < 16) {
          if (index > 7 && index < 13) {
            SpeechPoly.points[index].y += textBoxHeightDiff;
          } else {
            SpeechPoly.points[index].y += textBoxHeightDiff / 2;
          }
        }
      });
      SpeechText.lastHeight += textBoxHeightDiff;
      SpeechPoly.set({
        height: SpeechPoly.height + textBoxHeightDiff,
        pathOffset: new fabric.Point(
          SpeechPoly.pathOffset.x,
          SpeechPoly.pathOffset.y + textBoxHeightDiff / 2
        ),
      }).setCoords();
    }
  }

  //when SpeechBubble is ungrouped and textbox is moving move the polygon the same amount
  handleSpeechTextMoving(e, _canvas) {
    const SpeechText = e.target;
    const SpeechPoly = _canvas.getObjects().find((item) => {
      return (
        item?.name === "SpeechPoly" && item.bubbleId === SpeechText.bubbleId
      );
    });
    SpeechPoly.left += e.e.movementX;
    SpeechPoly.top += e.e.movementY;
    SpeechPoly.setCoords();
  }

  //when ungrouped and polygon is moving move the text the same amount
  handleSpeechPolygonMoving(e, _canvas) {
    const SpeechPoly = e.target;
    const Speechtext = _canvas.getObjects().find((item) => {
      return (
        item?.name === "Speechtext" && item.bubbleId === SpeechPoly.bubbleId
      );
    });
    if (Speechtext) {
      Speechtext.left += e.e.movementX;
      Speechtext.top += e.e.movementY;
      Speechtext.setCoords();
    }
  }

  //attach controls to move polygon points if not attached
  handleSpeechPolygonClick(e, _canvas) {
    _canvas.offHistory();
    const SpeechPoly = e.target._objects[0];
    if (!SpeechPoly.edit) {
      SpeechPoly.setCoords();
      this.Edit(SpeechPoly, _canvas);
    }
    _canvas.onHistory();
  }

  //Ungroup and focus of textbox to start typing
  handleSpeechBubbleOnDoubleClick(e, _canvas) {
    _canvas.offHistory();
    const SpeechBubble = e.target;
    const SpeechPoly = e.target._objects[0];
    SpeechBubble.toActiveSelection();
    this.Edit(SpeechPoly, _canvas);
    _canvas.onHistory();
  }

  //group back to speechpolygon
  handleSpeechPolyRegroup(e, _canvas) {
    const SpeechPoly = _canvas.getObjects().find((item) => {
      return item.name === "SpeechPoly";
    });
    if (!SpeechPoly) return;
    _canvas.offHistory();
    const SpeechText = _canvas.getObjects().find((item) => {
      return (
        item.customType === "Speechtext" &&
        item.bubbleId === SpeechPoly.bubbleId
      );
    });
    if (!SpeechText) {
      return;
    }
    const SpeechBubble = new fabric.Group([SpeechPoly, SpeechText], {
      customType: "SpeechBubble",
      name: SpeechPoly?.bubbleName,
      bubbleId: SpeechPoly?.bubbleId,
      subTargetCheck: true,
      polyColor: SpeechPoly?.fill,
      polyBorderColor: SpeechPoly?.stroke,
      textBgColor: SpeechText?.backgroundColor,
      textColor: SpeechText?.fill,
      strokeSize: SpeechPoly?.strokeWidth,
      isLabel: SpeechText?.isLabel,
      arrow: SpeechText.arrow,
    });
    _canvas.remove(SpeechPoly);
    _canvas.remove(SpeechText);
    _canvas.add(SpeechBubble);
    _canvas.onHistory();
  }

  async initCanvas() {
    const { id: pageId, elements, style } = this.props.config;
    // const _page = this.containerRef?.current;
    this._core = new CanvasCore();
    await this._core._init({
      canvasId: pageId,
      ...style,
    });
    // get ref to canvas object
    const _canvas = this._core.getRef();
    // pageId and canvas id is same
    const canvasId = `canvas-${pageId}`;
    this.props.onCanvasPostInit(canvasId, _canvas);

    // handle click (mousedown) on canvas
    _canvas.on("mouse:down", (e) => {
      if (e.e.ctrlKey) {
        this.handleDeselection(e, _canvas);
      } else {
        this.onOffObjectEvents("mousedown");
        this.handleLeftClickOnCanvasItem(e);
      }
      if (e.target && e.target?.customType === "SpeechBuble") {
        this.handleSpeechPolygonClick(e, _canvas);
      }
      if (
        e.target?.customType !== "SpeechPoly" &&
        e.target?.customType !== "Speechtext" &&
        e.target?.customType !== "SpeechBubble"
      ) {
        this.handleSpeechPolyRegroup(e, _canvas);
      }
    });

    // handle right click (mousedown) on canvas
    _canvas.on("mouse:down:before", (e) => {
      this.handleRightClickOnCanvasItem(e);
    });

    _canvas.on("mouse:dblclick", (e) => {
      if (e.target && e.target?.customType === "Quadratic") {
        _canvas.offHistory();
        e.target.toActiveSelection();
        _canvas.remove(e.target);
        const objects = _canvas.getObjects().filter((item) => {
          return item?.groupId === e.target?.groupId;
        });
        const controller = objects.find(
          (el) => el.customType === "quad_control"
        );
        controller.set({ fill: "#008000", visible: true });
        _canvas.discardActiveObject();
      } else if (
        e.target?.customType === "quad_control" ||
        e.target?.customType === "quad_curve" ||
        e.target?.customType === "left_Quad_triangle" ||
        e.target?.customType === "right_Quad_triangle"
      ) {
        this.handleGroupQuad(e.target.groupId);
      }
      if (e.target && e.target?.customType === "SpeechBubble") {
        this.handleSpeechBubbleOnDoubleClick(e, _canvas);
      }
    });

    // watch object movement on canvas
    _canvas.on("object:moving", (e) => {
      this.hideStyleEditorForActiveObject();
      if (e.target && e.target?.name === "SpeechPoly") {
        this.handleSpeechPolygonMoving(e, _canvas);
      }
      if (e.target && e.target?.name === "Speechtext") {
        this.handleSpeechTextMoving(e, _canvas);
      }
      const { left, width, top } = e.target.getBoundingRect();
      const pageWidth = this.props.config.style.width;
      const pageHeight = this.props.config.style.height;
      let leftOffset = left + width + 30 > pageWidth ? -16 : 16;
      let topOffset = top - 30 < 0 ? 16 : -16;
      if (left + width > pageWidth) {
        leftOffset = pageWidth - left - width - 20;
      }
      if (left + width < 0) {
        leftOffset = 0 - left - width + 20;
      }
      if (top < 0) {
        topOffset = 0 - top + 20;
      }
      if (top > pageHeight) {
        topOffset = pageHeight - top - 20;
      }
      this.setupCustomControls(leftOffset, topOffset);
    });

    // watch object resize on canvas
    _canvas.on("object:scaling", () => {
      this.hideStyleEditorForActiveObject();
    });

    _canvas.on("selection:created", (e) => this.setupControls(e, _canvas));

    _canvas.on("selection:updated", (e) => {
      this.setupControls(e, _canvas);
    });

    _canvas.on("before:transform", (e) => {
      if (
        e.transform.target &&
        e.transform.target.customType === "SpeechBubble"
      ) {
        const SpeechText = e.transform.target._objects[1];
        SpeechText.lastHeight = SpeechText.height;
        SpeechText.lastLeft = SpeechText.left;
        SpeechText.lastTop = SpeechText.top;
        SpeechText.lastWidth = SpeechText.width;
      }
    });

    _canvas.on("object:modified", (e) => {
      if (e.target?.type === "text" || e.target?.type === "i-text") {
        if (e.target.customName === true) {
          this.props.setSelectedName(e.target.changeName);
        } else {
          this.props.setSelectedName(e.target.text);
        }
        this.props.onElementsRendered();
      }
      if (e.target && e.target?.name === "Speechtext") {
        this.handlePolygonResizeOnTextBoxSizeChange(e, _canvas);
      }
    });

    // re-attach events after undo
    _canvas.on("history:undo", () => this.onOffObjectEvents("mousedown"));

    // re-attach events after undo
    _canvas.on("history:redo", () => this.onOffObjectEvents("mousedown"));

    // watch mouseup on canvas
    _canvas.on("mouse:up", (e) => {
      // it will group the quad if it is not grouped and not selected.
      if (
        e.target?.customType !== "Quadratic" &&
        e.target?.customType !== "quad_curve" &&
        e.target?.customType !== "left_Quad_triangle" &&
        e.target?.customType !== "right_Quad_triangle" &&
        e.target?.customType !== "quad_control"
      ) {
        this.handleAllquadgroups();
        _canvas.onHistory();
      }
      if (!e.e.ctrlKey) {
        // added if to stop conflict between Deselection on Ctrl+Click
        this.handleAfterMouseClickOnCanvas(e);
      }
    });

    // keep track of elements rendered initially
    this.setState({ elementsRendered: elements.map((e) => e?.id) });
    let ElemtoActivate = null;
    try {
      ElemtoActivate = await this.generatePageContent(elements);
    } catch (error) {
      console.log(error);
    } finally {
      if (ElemtoActivate) {
        this.handlePageItemClick(null, ElemtoActivate);
        this.props.ontemplateLoaded(ElemtoActivate);
      }
    }
    this.disableDefaultContextMenu();
    this.setupOwnContextMenu();
  }

  handleAllquadgroups() {
    const objects = this.props._canvas.getObjects().filter((item) => {
      return item?.groupId;
    });
    const ids = objects.map((item) => {
      return item.groupId;
    });
    const groupIds = [...new Set(ids)];
    groupIds.forEach((id) => {
      this.handleGroupQuad(id);
    });
  }

  setupControls(e, canvas) {
    this.props.onElementsRendered();
    if (e.selected?.[0]?.getBoundingRect()) {
      let left = e.selected[0].getBoundingRect().left;
      let width = e.selected[0].getBoundingRect().width;
      let top = e.selected[0].getBoundingRect().top;
      if (canvas.getActiveObject().type === "activeSelection") {
        left = canvas.getActiveObject().getBoundingRect().left;
        width = canvas.getActiveObject().getBoundingRect().width;
        top = canvas.getActiveObject().getBoundingRect().top;
      }
      const pageWidth = this.props.config.style.width;
      const pageHeight = this.props.config.style.height;
      let leftOffset = left + width + 30 > pageWidth ? -16 : 16;
      let topOffset = top - 30 < 0 ? 16 : -16;
      if (left + width > pageWidth) {
        leftOffset = pageWidth - left - width - 20;
      }
      if (left + width < 0) {
        leftOffset = 0 - left - width + 20;
      }
      if (top < 0) {
        topOffset = 0 - top + 20;
      }
      if (top > pageHeight) {
        topOffset = pageHeight - top - 20;
      }
      this.setupCustomControls(leftOffset, topOffset);
    }
  }

  handleGroupQuad(groupId) {
    const objects = this.props._canvas.getObjects().filter((item) => {
      return item?.groupId === groupId;
    });
    const quadGroup = objects.find((el) => el.customType === "Quadratic");
    const leftArrow = objects.find(
      (el) => el.customType === "left_Quad_triangle"
    );
    const rightArrow = objects.find(
      (el) => el.customType === "right_Quad_triangle"
    );
    const curve = objects.find((el) => el.customType === "quad_curve");
    const controller = objects.find((el) => el.customType === "quad_control");
    if (controller) {
      controller.set({ fill: "#FFA500", visible: false });
    }
    if (quadGroup) return;
    if (curve && leftArrow && controller && rightArrow) {
      this.createSelectionFromObject(
        [curve, leftArrow, controller, rightArrow],
        groupId
      );
    }
  }

  createSelectionFromObject(objects, groupId) {
    const _canvas = this._core.getRef();
    const group = this._core.makeQuadGroup(objects);
    group.groupId = groupId;
    group.customType = "Quadratic";
    if (!objects[0].pointsAdded) {
      this.attachPoint(objects[0], objects[1], 0, 1, group);
      this.attachPoint(objects[0], objects[2], 1, 1, group);
      this.attachPoint(objects[0], objects[3], 1, 3, group);
      this.handleQuadraticEvents(
        objects[0],
        objects[1],
        objects[2],
        objects[3],
        group
      );
    }
    this.canvasRef.add(group);
    objects.forEach((el) => _canvas.remove(el));
  }

  handleDeselection(e, canvas) {
    // Check if the target is an active selection
    if (e.target && e.target.type === "activeSelection") {
      // Find the topmost object within the active selection that intersects with the event coordinates
      const clickedObject = canvas.findTarget(e.pointer.x, e.pointer.y);

      if (clickedObject) {
        // Deselect the specific object from the active selection
        this.deselectObjectFromSelection(clickedObject, canvas);
      }
    } else {
      canvas.discardActiveObject();
    }
    canvas.requestRenderAll();
  }

  deselectObjectFromSelection(object, canvas) {
    const activeSelection = canvas.getActiveObject();
    if (activeSelection && activeSelection.type === "activeSelection") {
      const selectedObjects = activeSelection.getObjects();
      const index = selectedObjects.indexOf(object);
      if (index !== -1) {
        selectedObjects.splice(index, 1); // Remove the object from the selection
        canvas.discardActiveObject(); // Deselect the current active selection
        canvas.setActiveObject(
          // Create a new active selection with the updated objects
          new fabric.ActiveSelection(selectedObjects, {
            canvas: canvas,
          })
        );
      }
    }
  }

  // This function sets up a custom delete control for Fabric.js objects.
  setupCustomControls = (leftOffset, topOffset) => {
    const deleteImg = document.createElement("img");
    deleteImg.src = DeleteIcon;
    // Custom delete control for fabric.Object prototype.
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: topOffset,
      offsetX: leftOffset,
      cursorStyle: "pointer",
      mouseUpHandler: this.deleteObject,
      render: this.renderIcon(deleteImg),
      cornerSize: 24,
      sizeX: 24,
      sizeY: 24,
      withConnection: true,
    });
    const cloneImg = document.createElement("img");
    cloneImg.src = CloneIcon;
    // Custom copy control for fabric.Object prototype.
    fabric.Object.prototype.controls.clone = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: topOffset,
      offsetX: leftOffset - 28,
      cursorStyle: "pointer",
      mouseUpHandler: this.cloneObject,
      render: this.renderIcon(cloneImg),
      cornerSize: 24,
      sizeX: 24,
      sizeY: 24,
      withConnection: true,
    });
  };

  // This function is used to render the delete icon on the canvas.
  renderIcon = (icon) => {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
      const size = this.cornerSize;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.restore();
    };
  };

  // deleteObject method to delete the fabric object.
  deleteObject = () => {
    const canvas = this._core.getRef();
    const activeObjects = canvas.getActiveObjects();
    canvas.remove(...activeObjects);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  cloneObject = (eventData, transform, activeElem, canvasRef) => {
    let activeObject = transform?.target;
    let canvas = activeObject?.canvas;
    if (!transform) {
      activeObject = activeElem;
      canvas = canvasRef;
    }
    let count = this.countCustomElementTypes(activeObject.type);
    console.log("count", count, "type", activeObject.type);
    if (activeObject.customType === "SpeechBubble") {
      if (activeObject.isLabel === true) {
        // const bubbleElementSchema = getNextSpeechLabelSchema(this.canvasRef);
        // this.addSpeechBubble(bubbleElementSchema, true);
      } else {
        // const bubbleElementSchema = getNextSpeechBubbleSchema(this.canvasRef);
        // this.addSpeechBubble(bubbleElementSchema, true);
      }
    } else if (activeObject.customType === "Quadratic") {
      const quadraticElementSchema = getQuadraticSchema(this.canvasRef);
      this.addQuadratic(quadraticElementSchema);
    } else if (activeObject.type === "activeSelection") {
      const activeSelection = canvas.getActiveObjects();
      console.log(activeSelection);
      canvas.discardActiveObject();
      activeSelection.forEach((item) => {
        this.cloneElement(item, canvas);
      });
    } else if (activeObject.type === "group") {
      const activeSelection = activeObject.toActiveSelection();
      // canvas.discardActiveObject();
      console.log(activeSelection);
      activeSelection.forEach((item) => {
        this.cloneElement(item, canvas);
      });
    } else this.cloneElement(activeObject, canvas);
  };

  cloneElement = (activeObject, canvas) => {
    activeObject.clone((cloned) => {
      cloned.id = getNewID();
      cloned.left += 10;
      cloned.top += 10;
      if (cloned.type === "i-text") {
        cloned.customName = true;
        cloned.changeName = activeObject.name + " 2";
      }
      cloned.name = activeObject.name + " 2";
      canvas.add(cloned);
      setTimeout(() => {
        canvas.setActiveObject(cloned);
        this.handlePageItemClick(null, cloned);
        canvas.requestRenderAll();
      }, 0);
    });
  };

  mouseOverListener = (event) => {
    const { onCanvasActive } = this.props;
    if (
      event.target.classList.contains("upper-canvas") ||
      event.target.classList.contains("designer")
    ) {
      onCanvasActive(true);
    }
  };

  mouseOutListener = (event) => {
    const { onCanvasActive } = this.props;
    if (
      event.target.classList.contains("lower-canvas") ||
      event.target.classList.contains("designer")
    ) {
      onCanvasActive(false);
    }
  };

  keydownListener = (event) => {
    const { isCanvasActive } = this.props;
    const key = event.key;
    const activeObject = this.canvasRef.getActiveObject();
    if (!activeObject) return;
    if (key === "Delete" || key === "Backspace") {
      // ask to delete the element
      if (activeObject?.bubbleId) {
        if (!activeObject._objects) {
          return;
        }
      }
      if (
        activeObject?.customType &&
        activeObject?.customType !== "customGroup" &&
        activeObject?.customType !== "Quadratic"
      ) {
        return;
      }
      if (isCanvasActive && !this.canvasRef.getActiveObject()?.isEditing) {
        this.props.onElementDeleteRequested(ACTIONS.DELETE_SELECTION);
      }
    }
    if (!this.props.isCanvasActive) return;
    //ctrl+z key press
    if (event.keyCode === 90 && event.ctrlKey) {
      this.canvasRef.undo();
    }
    //ctrl+y key press
    if (event.keyCode === 89 && event.ctrlKey) {
      this.canvasRef.redo();
    }
    //ctrl+a keypress
    if (event.keyCode === 65 && event.ctrlKey) {
      this.canvasRef.discardActiveObject();
      var sel = new fabric.ActiveSelection(this.canvasRef.getObjects(), {
        canvas: this.canvasRef,
      });
      this.canvasRef.setActiveObject(sel);
      this.canvasRef.requestRenderAll();
      event.preventDefault();
    }
    const activeItem = this.canvasRef.getActiveObject();
    if (activeItem) {
      //left key
      if (event.keyCode === 37) {
        activeItem.left -= 1;
        this.canvasRef.requestRenderAll();
      }
      //right key
      if (event.keyCode === 39) {
        activeItem.left += 1;
        this.canvasRef.requestRenderAll();
      }
      //up key
      if (event.keyCode === 38) {
        activeItem.top -= 1;
        this.canvasRef.requestRenderAll();
      }
      //down key
      if (event.keyCode === 40) {
        activeItem.top += 1;
        this.canvasRef.requestRenderAll();
      }
    }
  };

  mouseUpListener = (event) => {
    this.props.onElementsRendered();
    if (event.target.localName === "canvas") {
      // get ref to canvas object
      const canvasElement = this._core.getRef();
      canvasElement.backgroundColor = this.props.pageBgColor;
    }
  };

  componentDidMount() {
    this.initCanvas();
    // const { onCanvasActive } = this.props;
    document.addEventListener("mouseover", this.mouseOverListener);
    document.addEventListener("mouseout", this.mouseOutListener);
    document.addEventListener("keydown", this.keydownListener);
    document.addEventListener("mouseup", this.mouseUpListener);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseover", this.mouseOverListener);
    document.removeEventListener("mouseout", this.mouseOutListener);
    document.removeEventListener("keydown", this.keydownListener);
    document.removeEventListener("mouseup", this.mouseUpListener);
  }

  createArrowStyle(activeObject) {
    const angleType = this.props.activeElementProps.arrowStyle;
    let arrowElement = null;
    switch (angleType) {
      case ARROW_HEAD.LEFT_ARROW:
        const leftTriangleElement = this.getTriangleElement(
          "Left",
          activeObject
        );
        const triangleLeft = this._core.addTriangle(leftTriangleElement);
        const leftArrowGroup = this._core.createArrow(angleType, [
          activeObject,
          triangleLeft,
        ]);
        this.handlePageItemClick(null, leftArrowGroup);
        arrowElement = leftArrowGroup;
        break;
      case ARROW_HEAD.RIGHT_ARROW:
        const rightTriangle = this.getTriangleElement("Right", activeObject);
        const triangleRigh = this._core.addTriangle(rightTriangle);
        const rightArrowGroup = this._core.createArrow(angleType, [
          activeObject,
          triangleRigh,
        ]);
        this.handlePageItemClick(null, rightArrowGroup);
        arrowElement = rightArrowGroup;
        break;
      case ARROW_HEAD.DOUBLE_SIDED:
        const RightElemet = this.getTriangleElement("Right", activeObject);
        const LeftArrow = this._core.addTriangle(RightElemet);
        const LeftElement = this.getTriangleElement("Left", activeObject);
        const RightArrow = this._core.addTriangle(LeftElement);
        const doubleArrowGroup = this._core.createArrow(angleType, [
          activeObject,
          LeftArrow,
          RightArrow,
        ]);
        this.handlePageItemClick(null, doubleArrowGroup);
        arrowElement = doubleArrowGroup;
        break;
      default:
        console.log("unhandled-action arrowType");
        break;
    }
    arrowElement.stroke = this.props.activeElementProps.stroke;
  }

  getTriangleElement(angleType, activeObject) {
    const lineThickness = Math.abs(
      activeObject.aCoords.tr.y - activeObject.aCoords.br.y
    );
    const triangle = {
      id: getNewID(),
      arrowAngle: activeObject?.angle,
      left:
        angleType === "Right"
          ? activeObject.oCoords.mr.x // line object right middle point (line can be scaled to have some thickness)
          : activeObject.oCoords.ml.x, // line object left middle point (line can be scaled to have some thickness)
      top:
        angleType === "Right"
          ? activeObject.oCoords.mr.y // line top right middle point of line (line can be slanted at some angle to have different vertical points on left and right)
          : activeObject.oCoords.ml.y, // line top left middle point of line (line can be slanted at some angle to have different vertical points on left and right)
      angle:
        angleType === "Right"
          ? activeObject.angle + 90 //rotate the triangle(to the right) and add line angle to align the triangle with line angle to make
          : activeObject.angle - 90, //rotate the triangle(to the left) and add line angle to align the triangle with line angle to make
      width: 20 + 2 * activeObject.strokeWidth + 2 * lineThickness,
      height: 20 + 2 * activeObject.strokeWidth + lineThickness,
      ...Object.assign({}, ARROW_HEAD_POSITION),
    };
    return triangle;
  }

  componentDidUpdate(prevProps, prevState) {
    this.canvasRef = this._core.getRef();
    const pageWidth = this.props.config.style.width;
    const pageHeight = this.props.config.style.height;
    const handlePageItemClick = this.handlePageItemClick;
    if (this.props.selectedElementId !== prevProps.selectedElementId) {
      const { selectedElementId } = this.props;
      this.canvasRef.getObjects().forEach((item) => {
        if (item.id === selectedElementId) {
          if (item.id) this.handlePageItemClick(undefined, item);
        }
      });
    }
    if (this.props.config !== prevProps.config) {
      this.canvasRef.setDimensions({
        width: pageWidth,
        height: pageHeight,
      });
    }
    if (this.props.activeElementProps !== prevProps.activeElementProps) {
      // update box color
      if (!this._core) return; // cant update box color without core being initiated
      // get ref to canvas object
      const activeObject = this.canvasRef.getActiveObject();
      if (!activeObject) return; // cant update box color without active element
      // do nothing if not active page
      if (this.props.activePageID !== this.props.config.id) return;
      const {
        id,
        colors,
        fontFamily,
        fontSize,
        backgroundColor,
        stroke,
        strokeWidth,
        radius,
        URL,
        imageFit,
        rx,
        ry,
        imageBorder,
        BorderX,
        BorderY,
        BorderLock,
        patternActive,
        isValidURL,
      } = this.props.activeElementProps;
      if (!id) return;
      if (prevProps.activeElementProps.id !== id) {
        this.handlePageItemClick(null, activeObject);
        return;
      }

      // now update color in main svg
      if (activeObject instanceof fabric.IText) {
        activeObject.set({
          fontFamily,
          fontSize,
          backgroundColor,
          stroke,
          strokeWidth,
          fill: patternActive
            ? activeObject.fill
            : activeObject.fillGradient
            ? new fabric.Gradient(activeObject.gradient)
            : colors[0],
          URL,
        });
      } else if (activeObject instanceof fabric.Circle) {
        activeObject.set({
          backgroundColor,
          stroke,
          strokeWidth,
          radius,
          fill: patternActive
            ? activeObject.fill
            : activeObject.fillGradient
            ? new fabric.Gradient(activeObject.gradient)
            : colors[0],
          URL,
        });
      } else if (activeObject instanceof fabric.Rect) {
        activeObject.set({
          stroke,
          strokeWidth,
          fill: patternActive
            ? activeObject.fill
            : activeObject.fillGradient
            ? new fabric.Gradient(activeObject.gradient)
            : colors[0],
          rx,
          ry,
          URL,
        });
      } else if (activeObject instanceof fabric.Triangle) {
        activeObject.set({
          backgroundColor,
          stroke,
          strokeWidth,
          fill: patternActive
            ? activeObject.fill
            : activeObject.fillGradient
            ? new fabric.Gradient(activeObject.gradient)
            : colors[0],
          URL,
        });
      } else if (activeObject instanceof fabric.Line) {
        if (this.props.activeElementProps.hasOwnProperty("arrowStyle")) {
          this.createArrowStyle(activeObject);
        } else {
          activeObject.set({
            stroke,
            strokeWidth,
          });
        }
      } else if (activeObject instanceof fabric.Image) {
        if (isValidURL)
          if (activeObject.url !== URL) {
            activeObject.setSrc(
              URL,
              function (img) {
                scaleElementTofitCanvas(imageFit, pageWidth, pageWidth, img);
                if (URL !== "") handlePageItemClick(null, img);
              },
              {
                crossOrigin: "anonymous",
                id,
                URL,
                url: URL,
                imageFit,
                imageBorder,
                rx,
                ry,
                BorderX,
                BorderY,
                BorderLock,
              }
            );
          }
      } else if (activeObject instanceof fabric.Group) {
        if (this.props.activeElementProps.hasOwnProperty("arrowStyle")) {
          //arrow update handling
        } else
          activeObject.getObjects().forEach((obj) => {
            const oldIndex = prevProps.activeElementProps.colors.indexOf(
              obj.fill
            );
            obj.set({ fill: colors[oldIndex] });
          });
      }
      this.canvasRef.renderAll();
      this.canvasRef.onHistory();
    }

    // page elements have changed
    if (this.props.config.elements !== prevProps.config.elements) {
      const { elements } = this.props.config;
      const { elementsRendered } = this.state;
      // we have to skip render for already rendered elements in canvas
      const newElements = elements.filter(
        (elem) => !elementsRendered.includes(elem.id)
      );
      this.setState({
        elementsRendered: [
          ...elementsRendered,
          ...newElements.map((e) => e.id),
        ],
      });
      this.generatePageContent(newElements);
    }
  }

  /**
   * Disables default right click context menu
   */
  disableDefaultContextMenu() {
    fabric.util.addListener(
      document.getElementsByClassName("upper-canvas")[0],
      "contextmenu",
      function (e) {
        e.preventDefault();
      }
    );
  }

  setupOwnContextMenu() {
    fabric.util.addListener(
      document.getElementsByClassName("upper-canvas")[0],
      "contextmenu",
      (e) => {
        const upperCanvasElement =
          this.containerRef.current.getBoundingClientRect();
        const curX = e.clientX - upperCanvasElement.left;
        const curY = e.clientY - upperCanvasElement.top;
        const offsetUnit = "px";
        this.setState({
          showContextmenu: true,
          contextMenuProps: {
            top: curY + offsetUnit,
            left: curX + offsetUnit,
            display: "inline-block",
          },
        });
      }
    );
  }

  clearActiveElement() {
    this.activeElement = "";
    // clear active element at parent
    this.props.onElemSelect(false, Object.assign({}, RESET_ACTIVE_ELEM_PROPS));
  }

  handlePageItemClick(event, item) {
    const editableProps = this.extractEditableProps(event, item);
    const offsetProps = this.extractOffsetProps(event, item);
    // set active element
    this.activeElement = item ? item : event.target;
    let newActiveElementProps = {
      ...this.props.activeElementProps,
      ...editableProps,
      ...offsetProps,
      id: this.activeElement?.id,
    };
    this.props.onElemSelect(true, newActiveElementProps);
  }

  hideContextMenu() {
    // hide context menu
    this.setState({ showContextmenu: false });
  }

  closeContextMenu = () => {
    this.hideContextMenu();
    this.clearActiveElement();
    this.setState({
      showContextmenu: false,
      contextMenuProps: {},
    });
  };

  // DELETE SELECTED ELEMENT OR GROUP OF ACTIVE ELEMENTS
  deleteActiveElement() {
    // run actions after deleting an element
    this.closeContextMenu();
    // get ref to canvas object
    // get currently active element in canvas
    const activeObject = this.canvasRef.getActiveObject();
    if (!activeObject) {
      // run post delete actions at least
      this.closeContextMenu();
      return;
    }
    if (activeObject?.bubbleId) {
      const objects = this.canvasRef.getObjects().filter((i) => {
        return i.bubbleId === activeObject.bubbleId;
      });
      this.canvasRef.remove(...objects);
    }
    const activeObjects = this.canvasRef.getActiveObjects();
    this.canvasRef.remove(...activeObjects);
    this.canvasRef.discardActiveObject();
    this.closeContextMenu();
  }

  /**
   * extract editable properties like color, font-family, font-size from
   * selected element
   */
  extractEditableProps(event, item) {
    const _target = item ? item : event.target;
    const editableProps = {};
    const { fontFamily, fontSize } = this.generateFontProps();
    let colors = this.generateColorInfo(_target);
    editableProps.colors = colors;
    editableProps.type = _target.type;
    editableProps.fillGradient = _target.fillGradient;
    editableProps.pattern = _target.pattern;
    editableProps.patternLeft = _target.patternLeft;
    editableProps.patternTop = _target.patternTop;
    editableProps.patternWidth = _target.patternWidth;
    editableProps.patternHeight = _target.patternHeight;
    editableProps.patternAngle = _target.patternAngle;
    editableProps.patternActive = _target.patternActive;
    editableProps.patternFit = _target.patternFit;
    editableProps.URL = _target?.URL;
    editableProps.isValidURL = _target?.isValidURL;
    editableProps.states = _target?.states;
    editableProps.randomShapePath = _target?.randomShapePath;
    editableProps.selectedTool = _target?.selectedTool;
    editableProps.height = _target?.height;
    editableProps.width = _target?.width;
    editableProps.name = _target?.name;
    if (_target?.bubbleId) {
      editableProps.polyColor = _target.polyColor;
      editableProps.polyBorderColor = _target.polyBorderColor;
      editableProps.textBgColor = _target.textBgColor;
      editableProps.textColor = _target.textColor;
      editableProps.strokeSize = _target.strokeSize;
    }
    if (
      _target instanceof fabric.IText ||
      _target instanceof fabric.Circle ||
      _target instanceof fabric.Triangle
    ) {
      editableProps.backgroundColor = _target?.backgroundColor;
    }
    if (
      _target instanceof fabric.IText ||
      _target instanceof fabric.Circle ||
      _target instanceof fabric.Rect ||
      _target instanceof fabric.Triangle ||
      _target instanceof fabric.Line ||
      _target.customType === "arrow"
    ) {
      editableProps.colors = colors;
      editableProps.stroke = _target?.stroke;
      editableProps.strokeWidth = _target?.strokeWidth;
      editableProps.rx = _target?.rx;
      editableProps.ry = _target?.ry;
      editableProps.BorderLock = _target?.BorderLock;
    }
    if (_target instanceof fabric.IText) {
      editableProps.fontFamily = fontFamily;
      editableProps.fontSize = fontSize;
    }
    if (_target instanceof fabric.Circle) {
      editableProps.radius = _target?.radius;
    }
    if (_target instanceof fabric.Image) {
      editableProps.imageFit = _target?.imageFit;
      editableProps.rx = _target?.rx;
      editableProps.ry = _target?.ry;
      editableProps.BorderX = _target?.BorderX;
      editableProps.BorderY = _target?.BorderY;
      editableProps.BorderLock = _target?.BorderLock;
    }
    if (_target.type === "quad") {
      editableProps.fill = _target?.fill;
    }
    return editableProps;
  }

  extractOffsetProps(event, item) {
    const _target = item ? item : event.target;
    const pageRect = this.containerRef.current.getBoundingClientRect();
    // NOTE: event will provide offsets regarding to canvas which is same as
    // Page component offsets and not relative to viewport. So we have to add
    // <Page> component offsets along with offsets of the selected item

    // NOTE: we have to take care of scale factor too when calculating height and width
    // scale factor is the factor by which the object on canvas is scaled from
    // it's original size
    const clientWidth = _target.scaleX
      ? _target.width * roundToDecimal(_target.scaleX, 2)
      : _target.width;
    const clientHeight = _target.scaleY
      ? _target.height * roundToDecimal(_target.scaleY, 2)
      : _target.height;
    return {
      client: {
        // top: pageRect.top + _target.aCoords.tl.y,
        // left: pageRect.left + _target.aCoords.tl.x,
        top: _target.aCoords.tl.y,
        left: _target.aCoords.tl.x,
        width: clientWidth,
        height: clientHeight,
      },
      page: {
        top: pageRect.top,
        width: pageRect.width,
        height: pageRect.height,
      },
    };
  }

  /**
   * extract color inforation from selected object and send to parent
   * @param {HTML Event} event canvas click event
   */
  generateColorInfo(target) {
    const colors = [];
    if (target.hasOwnProperty("_objects")) {
      // target is a "group"
      target._objects.forEach((object) => {
        // check if color is already picked
        if (colors.includes(object.fill)) return;
        // add color to collection
        colors.push(object.fill);
      });
      return colors;
    } else {
      // svg path (instance of klass)
      if (typeof target.fill !== "object") {
        if (target.fill) colors.push(target.fill);
        return colors;
      } else {
        return this.props.activeElementProps.colors;
      }
    }
  }

  /**
   * extract font inforation from selected object and send to parent
   * @param {HTML Event} event canvas click event
   */
  generateFontProps() {
    // get ref to canvas object
    const canvasElement = this._core.getRef();
    const activeObject = canvasElement.getActiveObject();
    // fill
    return {
      fontSize: activeObject?.fontSize,
      fontFamily: activeObject?.fontFamily,
    };
  }

  SaveAndShiftElementPosition(elem) {
    const canvasElement = this._core.getRef();
    let type = elem.customType;
    if (!type) type = elem.type;
    const shifted = this.state.placementShifted[type];
    canvasElement.getObjects().forEach((item) => {
      if (_.isEqual(this.getDimension(elem), this.getDimension(item))) {
        if (shifted % 5 !== 0) {
          if (elem.shifted !== true) {
            elem.left += 20 * (shifted % 5);
            elem.top += 20 * (shifted % 5);
            elem.setCoords();
            elem.shifted = true;
            this.setState({
              placementShifted: {
                ...this.state.placementShifted,
                [type]: (shifted % 5) + 1,
              },
            });
            canvasElement.renderAll();
          }
        } else {
          this.setState({
            placementShifted: {
              ...this.state.placementShifted,
              [type]: shifted + 1,
            },
          });
        }
      }
    });
  }

  getDimension(elem) {
    return elem.getBoundingRect();
  }

  checkElementPosition(elem) {
    if (elem.type === "line" || elem.customType === "Quadratic") {
      alignElementToCenter(
        this.canvasRef,
        this.canvasRef.width,
        this.canvasRef.height,
        elem
      );
      this.SaveAndShiftElementPosition(elem);
    }
    if (!elem.left && !elem.top && elem.type !== "line") {
      alignElementToCenter(
        this.canvasRef,
        this.canvasRef.width,
        this.canvasRef.height,
        elem
      );
      this.SaveAndShiftElementPosition(elem);
    }
    if (elem.customType === "SpeechBubble") {
      alignElementToCenter(
        this.canvasRef,
        this.canvasRef.width,
        this.canvasRef.height,
        elem
      );
      this.SaveAndShiftElementPosition(elem);
    }
  }

  handleElementInit(elem) {
    this.handlePageItemClick(null, elem);
    this.canvasRef.setActiveObject(elem);
    this.checkElementPosition(elem);
  }

  async addTextElementToPage(elem) {
    const textElement = await this._core.addText(elem.value, elem);
    if (elem.selectable) {
      textElement.on("mousedown", this.handlePageItemClick);
    }
    this.handleElementInit(textElement);
  }

  async addSvgElementToPage(elem) {
    const svgElement = await this._core.addSVGFromURL(elem.url, elem);
    if (elem.selectable) {
      svgElement.on("mousedown", this.handlePageItemClick);
    }
    this.handleElementInit(svgElement);
  }

  addTriangleElementToPage(elem) {
    const triangleElement = this._core.addTriangle(elem);
    if (elem.selectable) {
      triangleElement.on("mousedown", this.handlePageItemClick);
    }
    this.handleElementInit(triangleElement);
  }

  addCirlceElementToPage(elem) {
    const circleElement = this._core.addCircle(elem);
    if (elem.selectable) {
      circleElement.on("mousedown", this.handlePageItemClick);
    }
    this.handleElementInit(circleElement);
  }

  addLineElementToPage(elem) {
    const lineElement = this._core.addLine(elem);
    if (elem.selectable) {
      lineElement.on("mousedown", this.handlePageItemClick);
    }
    this.handleElementInit(lineElement);
  }

  addRectangleElementToPage(elem) {
    const rectElement = this._core.addRect(elem);
    // if element is selectable, attach event handler on it
    if (elem.selectable) {
      rectElement.on("mousedown", this.handlePageItemClick);
    }
    this.handleElementInit(rectElement);
  }

  async addImageElementToPage(elem) {
    const image = await this._core.addImgFromURL(elem.url, elem);
    if (elem.selectable) {
      image.on("mousedown", this.handlePageItemClick);
    }
    this.handlePageItemClick(null, image);
  }

  async addImgAsPatternFromURL(elem) {
    const patternImage = await this._core.addImgAsPatternFromURL(
      elem.url,
      elem
    );
    if (elem.selectable) {
      patternImage.on("mousedown", this.handlePageItemClick);
    }
    this.handlePageItemClick(null, patternImage);
  }

  addQuadratic(elem) {
    // Draw the quadratic curve
    let groupId = getNewID();
    let curve = this._core.drawQuadratic(elem.Path);
    curve.groupId = groupId;
    // Create control points and end triangles for the curve
    let p0 = this._core.makeEndTriangle(elem.Arrow, ...INITIAL_PATH.p0, curve);
    p0.name = "left_Quad_triangle";
    p0.customType = "left_Quad_triangle";
    p0.groupId = groupId;
    let p1 = this._core.makeControlPoint(elem.CurvePoint, ...INITIAL_PATH.p1);
    p1.fill = "#FFA500";
    p1.groupId = groupId;
    let p2 = this._core.makeEndTriangle(
      elem.Arrow,
      ...INITIAL_PATH.p2,
      null,
      null,
      curve
    );
    p2.name = "right_Quad_triangle";
    p2.customType = "right_Quad_triangle";
    p2.groupId = groupId;
    // Attach control points to the curve

    // Create a group containing the curve and control points
    const group = this._core.makeQuadGroup([curve, p0, p1, p2], groupId);
    group.groupId = groupId;
    group.name = elem.name;
    group.customType = "Quadratic";
    this.attachPoint(curve, p0, 0, 1, group);
    this.attachPoint(curve, p1, 1, 1, group);
    this.attachPoint(curve, p2, 1, 3, group);
    // Handle events for the quadratic curve and control points
    this.handleQuadraticEvents(curve, p0, p1, p2, group);
    curve.pointsAdded = true;
    this.canvasRef.add(group);
    this.handleElementInit(group);
  }

  // Set up event listeners for the quadratic curve and control points
  handleQuadraticEvents(curve, p0, p1, p2, group) {
    // Update angle and coordinates of p0 when moved
    p0.on("moving", () => {
      p0.angle = this._core.getAngle(curve);
      p0.setCoords();
    });

    // Update angles of p0 and p2 when p1 is moved
    p1.on("moving", () => {
      p0.angle = this._core.getAngle(curve);
      p2.angle = this._core.getAngle(null, curve);
    });

    // Update angle and coordinates of p2 when moved
    p2.on("moving", () => {
      p2.angle = this._core.getAngle(null, curve);
      p2.setCoords();
    });

    // Move control points when the curve is moved
    curve.on("moving", (options) => {
      let x = options.e.movementX;
      let y = options.e.movementY;
      curve.setCoords();
      for (let pt of [p0, p1, p2, group]) {
        pt.set("left", pt.left + x);
        pt.set("top", pt.top + y);
        pt.setCoords();
      }
    });

    // Show p1 when the group is selected, hide when deselected
    group.on("selected", () => {
      p1.visible = true;
    });

    group.on("deselected", () => {
      p1.visible = false;
    });
  }

  // Attach control point to the curve and update coordinates
  attachPoint(curve, pt, pathIndex, coordinateIndex) {
    pt.on("moving", (options) => {
      let x = options.e.movementX;
      let y = options.e.movementY;
      curve.path[pathIndex][coordinateIndex] += x;
      curve.path[pathIndex][coordinateIndex + 1] += y;
      curve.setCoords();
    });
  }

  addSpeechBubble(elem) {
    //create polygon
    const bubbleId = getNewID();
    const textbox = this._core.addTextBox(elem.text, {
      left: elem.left + elem.textPadding,
      top: elem.top + elem.textPadding + elem.strokeWidth / 2 + 1,
      width: elem.width,
      fontSize: 20,
      name: "Speechtext",
      backgroundColor: elem?.textBgColor ? elem.textBgColor : "#ffffff",
      fill: elem?.textColor ? elem.textColor : "#000",
      polyPadding: elem.textPadding,
      bubbleId,
      splitByGrapheme: true,
      lockRotation: true,
      hasControls: false,
      textAlign: "center",
      lastWidth: elem.width,
      hasBorders: false,
      arrowWidth: elem.arrowWidth,
      customType: "Speechtext",
      fontFamily: elem?.fontFamily ? elem?.fontFamily : "Times New Roman",
      isLabel: elem.isLabel,
      arrow: elem.arrow,
    });
    let result = createNewPoly(elem.strokeWidth, textbox, elem.arrow);
    let newPoints = result.newPoints;
    let newPolyTop = result.newPolyTop;
    let newPolyLeft = result.newPolyLeft;
    const SpeechPoly = this._core.addPolygon(
      JSON.parse(JSON.stringify(newPoints)),
      {
        left: newPolyLeft,
        top: newPolyTop,
        fill: elem?.polyColor ? elem.polyColor : "#fff",
        strokeWidth: elem.strokeWidth,
        stroke: elem?.borderColor ? elem.borderColor : "#acacac",
        scaleX: 1,
        scaleY: 1,
        name: "SpeechPoly",
        polyPadding: elem.textPadding,
        objectCaching: false,
        bubbleId,
        hasBorders: false,
        bubbleName: elem.name,
        customType: "SpeechPoly",
        dirty: false,
        strokeLineJoin: "round",
      }
    );
    const SpeechBubble = new fabric.Group([SpeechPoly, textbox], {
      bubbleId,
      name: elem.name,
      subTargetCheck: true,
      polyColor: SpeechPoly.fill,
      polyBorderColor: SpeechPoly.stroke,
      textBgColor: textbox.backgroundColor,
      textColor: textbox.fill,
      strokeSize: elem.strokeWidth,
      customType: "SpeechBubble",
      arrow: elem.arrow,
      isLabel: elem.isLabel,
    });
    this.canvasRef.offHistory();
    this.canvasRef.add(SpeechBubble);
    this.handleElementInit(SpeechBubble);
    this.canvasRef.onHistory();
  }

  // define a function that can locate the controls.
  // this function will be used both for drawing and for interaction.
  polygonControlPositionHandler(dim, finalMatrix, fabricObject) {
    var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
      y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    return fabric.util.transformPoint(
      { x: x, y: y },
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  }

  getObjectSizeWithStroke(object) {
    var stroke = new fabric.Point(
      object.strokeUniform ? 1 / object.scaleX : 1,
      object.strokeUniform ? 1 / object.scaleY : 1
    ).multiply(object.strokeWidth);
    // return new fabric.Point(object.width + stroke.x, object.height + stroke.y);
    let newPoint = new fabric.Point(
      object.width + stroke.x,
      object.height + stroke.y
    );
    return newPoint;
  }

  // define a function that will define what the control does
  // this function will be called on every mouse move after a control has been
  // clicked and is being dragged.
  // The function receive as argument the mouse event, the current trasnform object
  // and the current position in canvas coordinate
  // transform.target is a reference to the current object being transformed,
  actionHandler(eventData, transform, x, y) {
    let mY = eventData.layerY;
    let mX = eventData.layerX;
    let polygon = transform.target;
    let currentControl = polygon.controls[polygon.__corner];
    let prevX = polygon.points[currentControl.pointIndex].x;
    let prevY = polygon.points[currentControl.pointIndex].y;
    const Speechtext = this.canvasRef.getObjects().find((item) => {
      return item?.name === "Speechtext" && item.bubbleId === polygon.bubbleId;
    });
    let mousePos = polygon.toLocalPoint(
      new fabric.Point(x, y),
      "center",
      "center"
    );
    let polyBaseSize = this.getObjectSizeWithStroke(polygon);
    let size = polygon._getTransformedDimensions(0, 0);
    let newX = (mousePos.x * polyBaseSize.x) / size.x + polygon.pathOffset.x;
    let newY = (mousePos.y * polyBaseSize.y) / size.y + polygon.pathOffset.y;
    let finalPointPosition = {
      x: newX,
      y: newY,
    };
    const SpeechTextBottom =
      Speechtext.getBoundingRect().height + Speechtext.getBoundingRect().top;
    const lowerLimit =
      Speechtext.getBoundingRect().top - polygon.polyPadding + 1;
    const rightLimit = Speechtext.getBoundingRect().left - polygon.polyPadding;
    const { width, height } = polygon._calcDimensions();
    const pW = polygon.width;
    const pH = polygon.height;
    const leftLimit =
      Speechtext.getBoundingRect().left +
      polygon.polyPadding +
      Speechtext.getBoundingRect().width -
      1;
    const bottomLimit =
      lowerLimit +
      Speechtext.getBoundingRect().height +
      2 * polygon.polyPadding;
    //leftTop Coord update
    if (currentControl.pointIndex === 0) {
      if (mY >= lowerLimit && mX <= rightLimit) {
        finalPointPosition = {
          x: newX,
          y: prevY,
        };
      } else if (mY <= lowerLimit && mX >= rightLimit) {
        finalPointPosition = {
          x: prevX,
          y: newY,
        };
      } else if (mY > lowerLimit && mX > rightLimit) {
        finalPointPosition = {
          x: prevX,
          y: prevY,
        };
      }
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      polygon
        .set({
          width,
          height,
          pathOffset: new fabric.Point(
            polygon.pathOffset.x - (width - pW) / 2,
            polygon.pathOffset.y - (height - pH) / 2
          ),
        })
        .setCoords();
      return true;
    }
    //rightTop Coord update
    if (currentControl.pointIndex === 4) {
      if (mX > leftLimit) {
        finalPointPosition.y = prevY;
        polygon.points[currentControl.pointIndex] = finalPointPosition;
      }
      if (mX <= leftLimit) {
        finalPointPosition.x = prevX;
        finalPointPosition.y = prevY;
        polygon.points[currentControl.pointIndex] = finalPointPosition;
      }
      if (mY <= lowerLimit) {
        finalPointPosition.y = newY;
      }
      polygon
        .set({
          width,
          height,
          pathOffset: new fabric.Point(
            polygon.pathOffset.x + (width - pW) / 2,
            polygon.pathOffset.y - (height - pH) / 2
          ),
        })
        .setCoords();
      return true;
    }
    //rightBottom Coord update
    if (currentControl.pointIndex === 8) {
      if (mX >= leftLimit) {
        finalPointPosition.y = prevY;
        polygon.points[currentControl.pointIndex] = finalPointPosition;
      }
      if (mX < leftLimit) {
        finalPointPosition.x = prevX;
        finalPointPosition.y = prevY;
        polygon.points[currentControl.pointIndex] = finalPointPosition;
      }
      if (mY >= bottomLimit) {
        finalPointPosition.y = newY;
      }
      polygon
        .set({
          width,
          height,
          pathOffset: new fabric.Point(
            polygon.pathOffset.x + (width - pW) / 2,
            polygon.pathOffset.y + (height - pH) / 2
          ),
        })
        .setCoords();
      return true;
    }
    //leftBottom Coord update
    if (currentControl.pointIndex === 12) {
      if (mY <= bottomLimit && mX <= rightLimit) {
        finalPointPosition = {
          x: newX,
          y: prevY,
        };
      } else if (mY >= bottomLimit && mX >= rightLimit) {
        finalPointPosition = {
          x: prevX,
          y: newY,
        };
      } else if (mY < bottomLimit && mX > rightLimit) {
        finalPointPosition = {
          x: prevX,
          y: prevY,
        };
      }
      polygon.points[currentControl.pointIndex] = finalPointPosition;
      polygon
        .set({
          width,
          height,
          pathOffset: new fabric.Point(
            polygon.pathOffset.x - (width - pW) / 2,
            polygon.pathOffset.y + (height - pH) / 2
          ),
        })
        .setCoords();
      return true;
    }
    if ([1, 2, 3].includes(currentControl.pointIndex)) {
      if (mY < lowerLimit) {
        finalPointPosition.y = newY;
        polygon.points[currentControl.pointIndex] = finalPointPosition;
      } else {
        finalPointPosition.y = prevY;
        polygon.points[currentControl.pointIndex] = finalPointPosition;
      }
      polygon
        .set({
          width,
          height,
          pathOffset: new fabric.Point(
            mX < rightLimit
              ? polygon.pathOffset.x - (width - pW) / 2
              : mX > leftLimit
              ? polygon.pathOffset.x + (width - pW) / 2
              : polygon.pathOffset.x,
            polygon.pathOffset.y - (height - pH) / 2
          ),
        })
        .setCoords();
      return true;
    }
    //handle rightside points
    if ([5, 6, 7].includes(currentControl.pointIndex)) {
      if (
        mX - polygon.polyPadding <
        Speechtext.getBoundingRect().left + Speechtext.getBoundingRect().width
      ) {
        polygon.points[currentControl.pointIndex].x = prevX;
        polygon.points[currentControl.pointIndex].y = newY;
        return true;
      } else {
        polygon.points[currentControl.pointIndex] = finalPointPosition;
        polygon
          .set({
            width,
            height,
            pathOffset: new fabric.Point(
              polygon.pathOffset.x + (width - pW) / 2,
              polygon.pathOffset.y - (height - pH) / 2
            ),
          })
          .setCoords();
        return true;
      }
    }
    //handle bottomside points
    if ([9, 10, 11].includes(currentControl.pointIndex)) {
      const bottomRect =
        polygon.getBoundingRect().height + polygon.getBoundingRect().top;
      if (newY < bottomRect) {
        polygon.points[currentControl.pointIndex].x = newX;
        polygon.points[currentControl.pointIndex].y = prevY;
      }
      polygon
        .set({
          width,
          height,
          pathOffset: new fabric.Point(
            newX > rightLimit
              ? polygon.pathOffset.x + (width - pW) / 2
              : polygon.pathOffset.x - (width - pW) / 2,
            polygon.pathOffset.y + (height - pH) / 2
          ),
        })
        .setCoords();
      if (mY <= SpeechTextBottom + polygon.polyPadding + 2) return true;
    }
    //handle leftside points
    if ([13, 14, 15].includes(currentControl.pointIndex)) {
      if (mX + polygon.polyPadding > Speechtext.getBoundingRect().left) {
        polygon.points[currentControl.pointIndex].x = prevX;
        polygon.points[currentControl.pointIndex].y = newY;
        return true;
      } else if (currentControl.pointIndex !== 0) {
        polygon
          .set({
            width,
            height,
            pathOffset: new fabric.Point(
              newX > rightLimit
                ? polygon.pathOffset.x - (width - pW) / 2
                : polygon.pathOffset.x - (width - pW) / 2,
              polygon.pathOffset.y + (height - pH) / 2
            ),
          })
          .setCoords();
      }
    }
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    if (mousePos) return true;
  }

  // define a function that can keep the polygon in the same position when we change its width/height/top/left
  anchorWrapper(anchorIndex, fn) {
    return (eventData, transform, x, y) => {
      var fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
          },
          fabricObject.calcTransformMatrix()
        ),
        actionPerformed = fn(eventData, transform, x, y),
        // newDim = fabricObject._setPositionDimensions({}),
        polyBaseSize = this.getObjectSizeWithStroke(fabricObject),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polyBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polyBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  }

  Edit(poly, _canvas) {
    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    _canvas.setActiveObject(poly);
    poly.edit = true;
    poly.controls = fabric.Object.prototype.controls;
    if (poly.edit) {
      var lastControlIndex = poly.points.length - 1;
      poly.cornerStyle = "circle";
      poly.controls = poly.points.reduce((acc, point, index) => {
        acc["p" + index] = new fabric.Control({
          positionHandler: this.polygonControlPositionHandler,
          actionHandler: this.anchorWrapper(
            index > 0 ? index - 1 : lastControlIndex,
            this.actionHandler
          ),
          actionName: "modifyPolygon",
          pointIndex: index,
        });
        return acc;
      }, {});
    } else {
      poly.cornerStyle = "rect";
      poly.controls = fabric.Object.prototype.controls;
    }
  }

  async generatePageContent(elements) {
    for (const elem of elements) {
      switch (elem.type) {
        case "i-text":
          await this.addTextElementToPage(elem);
          break;
        case "Svg":
          await this.addSvgElementToPage(elem);
          break;
        case "triangle":
          this.addTriangleElementToPage(elem);
          break;
        case "circle":
          this.addCirlceElementToPage(elem);
          break;
        case "line":
          this.addLineElementToPage(elem);
          break;
        case "rect":
          this.addRectangleElementToPage(elem);
          break;
        case "Image":
          await this.addImageElementToPage(elem);
          break;
        case "Pattern":
          await this.addImgAsPatternFromURL(elem);
          break;
        case "Quadratic":
          this.addQuadratic(elem);
          break;
        case "speech_bubble":
          this.addSpeechBubble(elem, false);
          break;
        case "speech_label":
          this.addSpeechBubble(elem, true);
          break;
        default:
          console.log("unknown element type");
          break;
      }
    }
    const objects = this.canvasRef?.getObjects();
    if (objects) {
      const activeElem = objects?.find((item) => {
        return item.preselected === true;
      });
      return activeElem;
    } else {
      return null;
    }
  }

  countCustomElementTypes(type) {
    let count = 0;
    this.canvasRef.getObjects().forEach((item) => {
      if (item.customType === type || item.type === type) {
        count++;
      }
    });
    return count;
  }

  createCustomGroup(activeObject) {
    if (activeObject instanceof fabric.Group) {
      const customGroup = activeObject.toGroup();
      customGroup.id = getNewID();
      let count = this.countCustomElementTypes("customGroup");
      customGroup.name = "customGroup " + count;
      customGroup.customType = "customGroup";
      this.handlePageItemClick(null, customGroup);
    }
  }

  handleContextMenuItemClick(action) {
    // get ref to canvas object
    const activeObject = this.canvasRef?.getActiveObject();
    switch (action) {
      case "delete":
        this.deleteActiveElement(action);
        break;
      case "sendToBack":
        this.stackElement(action);
        break;
      case "bringToFront":
        this.stackElement(action);
        break;
      case "sendBackwards":
        this.stackElement(action);
        break;
      case "bringForward":
        this.stackElement(action);
        break;
      case "duplicate":
        this.cloneObject(null, null, activeObject, this.canvasRef);
        break;
      case "group":
        this.createCustomGroup(activeObject);
        break;
      case "unGroup":
        if (activeObject.name.includes("customGroup")) {
          const object = activeObject.toActiveSelection();
          this.handlePageItemClick(null, object);
        }
        break;
      default:
        this.closeContextMenu();
        break;
    }
    this.closeContextMenu();
  }

  stackElement(action) {
    // - canvas instance should exists
    if (!this._core) return;
    // get ref to canvas object
    const activeObject = this.canvasRef?.getActiveObject();
    // - active element should exists
    if (!activeObject) return;
    // all the actions will be performed on active element
    switch (action) {
      case "sendToBack":
        activeObject.sendToBack();
        break;
      case "bringToFront":
        activeObject.bringToFront();
        break;
      case "sendBackwards":
        activeObject.sendBackwards();
        break;
      case "bringForward":
        activeObject.bringForward();
        break;
      default:
        this.closeContextMenu();
        break;
    }
    // hide context menu after each action
    this.closeContextMenu();
  }

  hide() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { style, id: pageId } = this.props.config;
    const { showContextmenu } = this.state;
    // console.log(this.props.theme);
    return (
      <div
        className="page"
        style={
          this.props.theme === "light"
            ? {
                backgroundColor: "#fff",
                ...style,
              }
            : {
                backgroundColor: "#9cbfff",
                ...style,
              }
        }
        ref={this.containerRef}
      >
        <canvas id={`canvas-${pageId}`} />
        <div
          className="contextMenu"
          id="contextMenu"
          ref={this.contextMenuRef}
          style={{ ...this.state.contextMenuProps }}
        ></div>
        {showContextmenu ? (
          <PopMenuPortal>
            <PopupContainer
              nativeElement={this.contextMenuRef.current}
              onOutsideClick={() => {
                this.setState({
                  showContextmenu: false,
                });
              }}
              outsideClickExcludeSelectors={["menu"]}
            >
              <ul className="menu">
                {CANVAS_CONTEXT_MENU_ITEMS.map((item) => {
                  return (
                    <li className="menu-item" key={item.value}>
                      <a
                        href="/#"
                        onClick={(e) => {
                          e.preventDefault();
                          this.handleContextMenuItemClick(item.value);
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </PopupContainer>
          </PopMenuPortal>
        ) : null}
      </div>
    );
  }
}

Page.defaultProps = {
  onCanvasPostInit: noop,
  onElementMovedToDiffCanvas: noop,
  onElementDeleteRequested: noop,
  onPageClick: noop,
  activePageID: "",
  config: {
    id: "",
    style: {},
  },
  canvases: {},
};

export default Page;
