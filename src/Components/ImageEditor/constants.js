export const ACTIONS = {
  ADD_CIRCLE: "circle",
  ADD_DASHED_LINE: "dashed_line",
  ADD_FROM_LIBRARY: "add-from-library",
  ADD_FROM_DESKTOP: "add-from-desktop",
  ADD_LINE: "solid_line",
  ADD_PATTERN: "pattern",
  ADD_QUADRATIC_CURVE: "quadratic_curve",
  ADD_RECTANGLE: "rectangle",
  ADD_RANDOM_SHAPE: "random_shape",
  ADD_SPEECH_BUBBLE: "speech_bubble",
  ADD_TEXT: "add-text",
  ADD_TRIANGLE: "triangle",
  ALIGN_ELEMENT_HORIZONTALLTY: "align-horizontally",
  ALIGN_ELEMENT_VERTICALLY: "align-vertically",
  ALIGN_WITHIN_GROUP_HORIZONTALLTY: "align-within-group-horizontally",
  ALIGN_WITHIN_GROUP_VERTICALLY: "align-within-group-vertically",
  CHANGE_ACTIVE_ELEMENT_PROPS: "change-active-element-props",
  CHANGE_PAGE_BACKGROUND: "change-page-bakground",
  CHANGE_PAGE_BACKGROUND_IMAGE: "change-page-bakground-image",
  CHANGE_PAGE_DIMENSIONS: "change-page-dimensions",
  CHANGE_PATTERN_SIZE: "change_pattern_size",
  CHANGE_PATTERN_POSITION: "change_pattern_position",
  CLEAR_PAGE: "clear-page",
  DOWNLOAD_JSON: "download-json",
  DOWNLOAD_PAGE: "download-page",
  DOWNLOAD_SELECTION: "download-selection",
  DELETE_SELECTION: "delete-selection",
  ELEMENT_NAME: "element_name",
  PATTERN_IMG_HEIGHT: "PATTERN_IMG_HEIGHT",
  PATTERN_IMG_ANGLE: "pattern_img_angle",
  REDO_ACTION: "redo-action",
  SAVE_PAGE_TO_LIBRARY: "save-page-to-library",
  SAVE_SELECTION_TO_LIBRARY: "save-selection-to-library",
  SPACE_WITHIN_GROUP_EVENLY: "space-within-group-evenly",
  UNDO_ACTION: "undo-action",
  UPDATE_ACTIVE_ELEMENT: "update-active-element",
  RAW_DATA: "raw_data",
  IMAGE_DATA: "img_data",
  SHOW_SAVED_TEMPLATES: "show-saved-templates",
  SHOW_GLOBAL_TEMPLATES: "show-global-templates",
  UPLOAD_JSON: "upload-file",
  UPLOAD_IMAGE: "image",
  UPLOAD_SVG: "svg",
};

export const EXTRA_ELEMENT_PROPS = [
  "selectable",
  "editable",
  "id",
  "name",
  "type",
  "url",
  "URL",
  "fillGradient",
  "imageFit",
  "customType",
  "patternLeft",
  "patternTop",
  "patternWidth",
  "patternHeight",
  "patternFit",
  "patternAngle",
  "patternActive",
  "subType",
  "states",
  "randomShapePath",
  "selectedTool",
  "patternSourceCanvas",
  "bubbleId",
  "objectCaching",
  "pathOffset",
  "polyPadding",
  "lastHeight",
  "lockMovementX",
  "lockMovementY",
  "hasControls",
  "polyColor",
  "polyBorderColor",
  "textBgColor",
  "textColor",
  "strokeSize",
  "customName",
  "bubbleName",
  "boxShadow",
  "BorderX",
  "BorderY",
  "BorderLock",
  "gradient",
  "height",
  "width",
  "groupId",
  "pointsAdded",
];

export const ArrowDirection = [
  {
    name: "Top",
    value: "Top",
  },
  {
    name: "Left",
    value: "Left",
  },
  {
    name: "Right",
    value: "Right",
  },
  {
    name: "Bottom",
    value: "Bottom",
  },
];

export const FLIP_OPTIONS = [
  {
    title: "Flip Text Horizontally",
    leftIcon: "icon-flip-h",
    value: "x",
  },
  {
    title: "Flip Text Vertically",
    leftIcon: "icon-flip-v",
    value: "y",
  },
];

export const TEXT_ALIGNMENT = [
  {
    title: "Align Left",
    leftIcon: "icon-align-left",
    value: "left",
  },
  {
    title: "Align Center",
    leftIcon: "icon-align-center",
    value: "center",
  },
  {
    title: "Align Right",
    leftIcon: "icon-align-right",
    value: "right",
  },
];

export const FONT_STYLES = [
  {
    title: "Bold Toggle",
    leftIcon: "icon-bold",
    value: "bold",
  },
  {
    title: "Italic Toggle",
    leftIcon: "icon-italic",
    value: "italic",
  },
  {
    title: "Strikethrough Toggle",
    leftIcon: "icon-strikethrough",
    value: "strikethrough",
  },
  {
    title: "Underline Toggle",
    leftIcon: "icon-underline",
    value: "underline",
  },
];

export const ALIGNMENT_OPTIONS = [
  {
    title: "Align Left",
    leftIcon: "icon-align-object-left",
    value: "left",
  },
  {
    title: "Align Center",
    leftIcon: "icon-align-object-center",
    value: "center",
  },
  {
    title: "Align Right",
    leftIcon: "icon-align-object-right",
    value: "right",
  },
  {
    title: "Align Top",
    leftIcon: "icon-align-object-top",
    value: "top",
  },
  {
    title: "Align Middle",
    leftIcon: "icon-align-object-middle",
    value: "middle",
  },
  {
    title: "Align Bottom",
    leftIcon: "icon-align-object-bottom",
    value: "bottom",
  },
];

export const CANVAS_CONTEXT_MENU_ITEMS = [
  { label: "Send Backwards", value: "sendBackwards" },
  { label: "Send To Back", value: "sendToBack" },
  { label: "Bring Forward", value: "bringForward" },
  { label: "Bring To Front", value: "bringToFront" },
  { label: "Group Selected", value: "group" },
  { label: "Ungroup Selected", value: "unGroup" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete" },
];

export const CANVAS_PAGE_GUTTER = 200;

export const PAGE_LAYOUTS = {
  print: {
    label: "Print",
    sizes: [
      { label: "A4", value: "A4", width: "595px", height: "842px" },
      { label: "A3", value: "A4", width: "842px", height: "1191px" },
      { label: "Letter", value: "letter", height: "612px", width: "791px" },
      { label: "Custom", value: "custom", height: "100%", width: "100%" },
    ],
  },
  googleAd: {
    label: "Google Ad",
    sizes: [
      { label: "300 x 300", value: "300", height: "300px", width: "300px" },
    ],
  },
};

export const PAGE_CONFIG = Object.freeze({
  id: "",
  orientation: "potrait",
  template: {},
  elements: [],
  style: {
    backgroundColor: "#ffffff",
    backgroundImage: null,
    height: "",
    width: "",
  },
});

export const SAVE_OPTIONS = [
  {
    btnText: "Canvas as Image",
    tooltip: "Download Design as Image",
    leftIcon: "icon-image",
    value: ACTIONS.DOWNLOAD_PAGE,
  },
  {
    btnText: "Selection as Image",
    tooltip: "Download Design as Image",
    leftIcon: "icon-image",
    value: ACTIONS.DOWNLOAD_SELECTION,
  },
  {
    btnText: "Raw Canvas json",
    tooltip: "Download Design as json",
    leftIcon: "icon-fs-file",
    value: ACTIONS.SAVE_PAGE_TO_LIBRARY,
  },
  {
    btnText: "Save to File",
    tooltip: "Download raw design",
    leftIcon: "icon-fs-file",
    value: ACTIONS.DOWNLOAD_JSON,
  },
];

export const ADD_OPTIONS = [
  // {
  //   title: "From Library",
  //   value: "lib",
  // },
  {
    title: "From Desktop",
    value: "desktop",
  },
];

export const OPEN_OPTIONS = [
  // {
  //   title: "Choose New Design",
  //   tooltip: "Choose from a variety of templates",
  //   icon: "icon-manage-files",
  //   value: "show-global-templates",
  // },
  // {
  //   title: "Open Design From Library",
  //   tooltip: "Open a previously saved cover image",
  //   icon: "icon-file-library",
  //   value: "show-saved-templates",
  // },
  // {
  //   title: "Open Design From File",
  //   tooltip: "Open a supported cover image from local file",
  //   icon: "icon-fs-file",
  //   value: "raw_data",
  // },
  {
    title: "Open Image From File",
    tooltip: "Open a supported cover image from local file",
    icon: "icon-fs-image",
    value: "img_data",
  },
];

export const DELETE_OPTIONS = [
  {
    btnText: "Clear Page",
    leftIcon: "icon-laptop",
    value: "clear-page",
  },
  {
    btnText: "Selected Item",
    leftIcon: "icon-cancel-circle",
    value: "selected-item",
  },
];

export const ADD_SHAPE_OPTIONS = [
  // {
  //   btnText: "Add Image from library",
  //   leftIcon: "icon-image-library",
  //   value: "add-from-library",
  // },
  // {
  //   btnText: "Upload and Add from Library",
  //   tooltip: "Upload Image to Library and Add",
  //   leftIcon: "icon-fs-image",
  //   value: "image",
  // },
  {
    btnText: "Add Svg",
    tooltip: "Upload Svg from Desktop",
    leftIcon: "icon-svg",
    value: "svg",
  },
  {
    btnText: "Add Triangle",
    leftIcon: "icon-triangle",
    value: "triangle",
  },
  {
    btnText: "Add Text",
    leftIcon: "icon-text",
    value: "add-text",
  },
  {
    btnText: "Add Rectangle",
    leftIcon: "icon-rectangle",
    value: "rectangle",
  },
  {
    btnText: "Add Circle",
    leftIcon: "icon-circle",
    value: "circle",
  },
  {
    btnText: "Add Solid Line",
    leftIcon: "icon-minus",
    value: "solid_line",
  },
  {
    btnText: "Add Dashed Line",
    leftIcon: "icon-more-horizon",
    value: "dashed_line",
  },
  {
    btnText: "Add Arrow",
    leftIcon: "icon-quad-arrow",
    value: "quadratic_curve",
  },
  {
    btnText: "Add Speech Bubble",
    leftIcon: "icon-random-communication",
    value: "speech_bubble",
  },
  {
    btnText: "Add Label",
    leftIcon: "icon-engage",
    value: "speech_label",
  },
];

export const CANVAS_ACTION_HISTORY = {
  id: null,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  z: 0,
  angle: 0,
  actionType: "",
};

export const RESET_ACTIVE_ELEM_PROPS = {
  id: "",
  colors: [],
};

export const ARROW_HEAD = {
  LEFT_ARROW: "Left Arrow",
  RIGHT_ARROW: "Right Arrow",
  DOUBLE_SIDED: "Double Sided",
};

export const SHAPES_PROPS_DEFAULT = Object.freeze({
  fill: "rgba(196, 232, 188, 0.44)",
  stroke: "#000",
  strokeWidth: 1,
  // paintFirst: "stroke",
  backgroundColor: "rgba(0,0,0,0)",
});

export const LINE_PROPS_DEFAULT = Object.freeze({
  strokeWidth: 2,
  stroke: "#000",
});

export const ARROW_HEAD_POSITION = Object.freeze({
  fill: "#000",
  originX: "center",
  originY: "center",
});

export const QUADRATIC_PROPS_DEFAULT = Object.freeze({
  Path: {
    fill: "",
    stroke: "black",
    hasBorders: false,
    hasControls: false,
    objectCaching: false,
    name: "quad_curve",
    customType: "quad_curve",
    selectable: false,
  },
  CurvePoint: {
    originX: "center",
    originY: "center",
    hasBorders: false,
    hasControls: false,
    name: "quad_control",
    customType: "quad_control",
    visible: false,
    hoverCursor: "grab",
    moveCursor: "grabbing",
    scaleX: 0.4,
    scaleY: 0.4,
  },
  Arrow: {
    width: 8,
    height: 8,
    fill: "#000",
    stroke: "#000",
    strokeWidth: 2,
    originX: "center",
    originY: "bottom",
    line1: "",
    line2: "",
    line3: "",
    hasBorders: false,
    hasControls: false,
  },
});

export const INITIAL_PATH = {
  p0: [50, 50],
  p1: [125, 75],
  p2: [150, 150],
  p3: [65, 100],
};

export const SPEECH_BUBBLE_DEFAULT_PROPS = Object.freeze({
  CONFIGURATION: {
    text: "Hello World!",
  },
  TEXT: {
    width: 180,
    fontFamily: "Quicksand",
    fontSize: 16,
    originY: "center",
    originX: "center",
    stroke: "red",
    objectCaching: false,
    textAlign: "center",
  },
  TAIL_RECT: {
    fill: "transparent",
    hasRotatingPoint: false,
    hasControls: false,
    originY: "center",
    originX: "right",
    width: 24,
    height: 24,
    stroke: "#000",
  },
  BUBBLE_BOX: {
    fill: "white",
    stroke: "#000",
    rx: 8,
    ry: 8,
    objectCaching: false,
  },
  POLYGON_TAIL: {
    fill: "white",
    stroke: "#000",
    objectCaching: false,
    strokeWidth: 2,
    hasBorders: false,
    hasControls: false,
  },
  BUBBLE_OVERLAY: {
    fill: "white",
    objectCaching: false,
    strokeWidth: 2,
    hasBorders: false,
    hasControls: false,
  },
});

export const POLY_POINTS = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
];

export const DeleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

export const CloneIcon =
  "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' version='1.1' fill='%23000000' transform='matrix(1, 0, 0, 1, 0, 0)rotate(180)'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath style='fill:%2390B1DE;stroke:%232C3D60;stroke-width:1.5px' d='m 32,87 0,-55 c 0,-2 1,-3 3,-3 l 59,0 c 0,0 3,1 3,4 l 0,64 0,0 -59,0 z'%3E%3C/path%3E%3Cpath style='fill:%234E7EC2' d='m 34,31 0,56 5,8 56,0 0,-64 z'%3E%3C/path%3E%3Cpath style='fill:%23999999;stroke:%23555555;stroke-width:2px' d='m 49,70 c -2,0 -2,2 -2,3 l 0,24 40,0 0,-24 c 0,-3 -1,-3 -10,-3 z m 8,4 c 6,0 5,4 5,4 l 0,10 c 0,0 0,5 -4,5 -4,0 -5,0 -5,0 l 0,-18 c 0,0 0,-1 4,-1 z'%3E%3C/path%3E%3Crect style='fill:%23ff0000;fill-opacity:0.7' width='45' height='6' x='42' y='32'%3E%3C/rect%3E%3Crect style='fill:%23eeeeee;' width='45' height='29' x='42' y='38'%3E%3C/rect%3E%3Crect style='fill:%232C3D60;' width='4' height='4' x='35' y='33'%3E%3C/rect%3E%3Cpath style='fill:none;stroke:%23bbbbbb;stroke-width:2px' d='m 44,60 41,0 m -41,-8 41,0 m -41,-8 41,0'%3E%3C/path%3E%3Cpath style='fill:%2390B1DE;stroke:%232C3D60;stroke-width:1.5px' d='M 2.8,63 2.8,5.6 C 2.8,3.5 3.5,2.8 5.6,2.8 l 60.4,0 c 2,0 3,1.4 3,3.5 L 69,66 c 0,1 0,3 -3,3 L 9.1,69 z'%3E%3C/path%3E%3Cpath style='fill:%234E7EC2' d='M 4.9,4.9 4.9,62 9.8,67 67,67 67,4.9 z'%3E%3C/path%3E%3Cpath style='fill:%23999999;stroke:%23555555;stroke-width:2px' d='m 20,44 c -2,0 -2,2 -2,3 l 0,22 36,0 0,-22 c 0,-1 -1,-3 -3,-3 z m 7,4 c 5,0 5,1 5,1 l 0,14 c 0,0 0,2 -5,2 -2,0 -3,0 -3,0 l 0,-17 c 0,0 0,0 3,0 z'%3E%3C/path%3E%3Crect style='fill:%23ff0000;fill-opacity:0.7' width='45' height='6' x='13' y='6'%3E%3C/rect%3E%3Crect style='fill:%23eeeeee;' width='45' height='29' x='13' y='12'%3E%3C/rect%3E%3Crect style='fill:%232C3D60;' width='4' height='4' x='6' y='7'%3E%3C/rect%3E%3Cpath style='fill:none;stroke:%23bbbbbb;stroke-width:2px' d='m 15,34 41,0 m -41,-8 41,0 m -41,-8 41,0'%3E%3C/path%3E%3C/g%3E%3C/svg%3E";

export const svg =
  "M829.449,601.585L819.7,611.7a1,1,0,0,1-1.7-.713V604H804v13.962h6.933a1.071,1.071,0,0,1,.989.619,0.954,0.954,0,0,1-.239,1.09l-10.439,9.737a2,2,0,0,1-2.828-.021L788.3,619.66a1,1,0,0,1,.713-1.7H796V604H782v6.986a1,1,0,0,1-1.7.713l-9.748-10.115a2,2,0,0,1-.022-2.828l9.758-10.439a0.957,0.957,0,0,1,1.092-.239,1.073,1.073,0,0,1,.621.989V596h14V582.037h-6.986a1,1,0,0,1-.713-1.7l10.115-9.728a2,2,0,0,1,2.828-.022l10.439,9.738a0.954,0.954,0,0,1,.239,1.09,1.073,1.073,0,0,1-.989.619H804V596h14v-6.933a1.071,1.071,0,0,1,.621-0.989,0.957,0.957,0,0,1,1.092.239l9.758,10.439A2,2,0,0,1,829.449,601.585Z";

export const Ok =
  "M738.133333 311.466667L448 601.6l-119.466667-119.466667-59.733333 59.733334 179.2 179.2 349.866667-349.866667z";

export const FONT_PROPS_DEFAULT = Object.freeze({
  type: "i-text",
  value: "text",
  name: "text",
  fontFamily: "Times New Roman",
  fontSize: 48,
  backgroundColor: "rgba(255,255,255,0)",
  fill: "#000",
  stroke: "#000",
  strokeWidth: 0,
  paintFirst: "stroke",
});

export const BlankTemplate = Object.freeze({
  name: "Blank Page",
  value: "blank",
  pageStyles: {
    backgroundColor: "#ffffff",
    backgroundImage: null,
    width: 595,
    height: 842,
  },
  elements: [],
});

export const SPACE_EVENLY_OPTIONS = [
  {
    title: "Equally Space Horizontal",
    leftIcon: "icon-space-evenly-horizontally",
    value: "horizontal",
  },
  {
    title: "Equally Space Vertical",
    leftIcon: "icon-space-evenly-vertically",
    value: "vertical",
  },
];

export const CANVAS_CUSTOM_FONTS = {
  comforter: "Comforter Brush",
  quicksand: "Quicksand",
  Ubuntu: "Ubuntu",
  Caprasimo: "Caprasimo",
  Fasthand: "Fasthand",
  RobotoSlab: "Roboto Slab",
  Barlow: "Barlow Condensed",
  Rubik: "Rubik",
  Montserrat: "Montserrat",
  Raleway: "Raleway",
  Josefin_Slab: "Josefin Slab",
  Holtwood_One_SC: "Holtwood One SC",
  Titillium_Web: "Titillium Web",
  Bebas_Neue: "Bebas Neue",
  Patua_One: "Patua One",
  Abril_Fatface: "Abril Fatface",
  Playfair_Display: "Playfair Display",
  Libre_Baskerville: "Libre Baskerville",
};

export const DefaultTemplate = {
  name: "Default Template",
  value: "default",
  pageStyles: {
    width: 1280,
    height: 720,
  },
  elements: [
    {
      type: "Pattern",
      name: "Background Image",
      width: 1280,
      height: 720,
      containerType: "rect", //triangle. circle, rect
      url: "https://cdn.pixabay.com/photo/2017/10/10/07/48/hills-2836301_1280.jpg",
      imageFit: "Show full Image",
      BorderX: 5,
      BorderY: 5,
      BorderLock: true,
    },
    {
      type: "rect",
      name: "Overlay Bottom",
      width: 1080,
      height: 520,
      left: 100,
      top: 100,
      fill: "rgba(0,0,0,0.36)",
      stroke: "rgba(0,0,0,0)",
      strokeWidth: 0,
      rx: 0,
      ry: 0,
      BorderLock: true,
      preselected: true,
    },
    {
      type: "rect",
      name: "Overlay Top",
      left: 200,
      top: 200,
      width: 880,
      height: 320,
      fill: "#ffffff50",
      stroke: "rgba(0,0,0,0)",
      strokeWidth: 0,
      rx: 5,
      ry: 5,
      BorderLock: true,
    },
    {
      ...FONT_PROPS_DEFAULT,
      value: "Make/Edit Your Svg",
      left: 255,
      top: 317,
      fontFamily: "Caprasimo",
      fontSize: 75,
      fill: "#660708",
      stroke: "#a52e2e",
    },
    {
      ...FONT_PROPS_DEFAULT,
      value: "Make/Edit Your Image",
      left: 490,
      top: 218,
      fontSize: 32,
      fill: "#660708",
    },
    {
      ...FONT_PROPS_DEFAULT,
      value: "Make/Edit Your Cover",
      left: 480,
      top: 458,
      fontSize: 32,
      fill: "#660708",
    },
  ],
};

export const PAGE_TEMPLATES = [BlankTemplate, DefaultTemplate];
