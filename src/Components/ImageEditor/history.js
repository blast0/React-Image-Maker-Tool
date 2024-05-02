import { fabric } from "fabric";
import { EXTRA_ELEMENT_PROPS } from "./constants";
/**
 * Override the initialize function for the _historyInit();
 */
fabric.Canvas.prototype.initialize = (function (originalFn) {
  return function (...args) {
    originalFn.call(this, ...args);
    this._historyInit();
    return this;
  };
})(fabric.Canvas.prototype.initialize);

/**
 * Override the dispose function for the _historyDispose();
 */
fabric.Canvas.prototype.dispose = (function (originalFn) {
  return function (...args) {
    originalFn.call(this, ...args);
    this._historyDispose();
    return this;
  };
})(fabric.Canvas.prototype.dispose);

/**
 * Returns current state of the string of the canvas
 */
fabric.Canvas.prototype._historyNext = function () {
  return JSON.stringify(this.toDatalessJSON(this.extraProps));
};

/**
 * Returns an object with fabricjs event mappings
 */
fabric.Canvas.prototype._historyEvents = function () {
  return {
    "object:added": this._historySaveAction,
    "object:removed": this._historySaveAction,
    "object:modified": this._historySaveAction,
    "object:skewing": this._historySaveAction,
  };
};

/**
 * Override the sendToBack function for the Canvas;
 */
fabric.Canvas.prototype.sendToBack = (function (originalFn) {
  return function (...args) {
    this._historySaveAction();
    originalFn.call(this, ...args);
    return this;
  };
})(fabric.Canvas.prototype.sendToBack);

/**
 * Override the bringToFront function for the Canvas;
 */
fabric.Canvas.prototype.bringToFront = (function (originalFn) {
  return function (...args) {
    this._historySaveAction();
    originalFn.call(this, ...args);
    return this;
  };
})(fabric.Canvas.prototype.bringToFront);

/**
 * Override the sendBackwards function for the Canvas;
 */
fabric.Canvas.prototype.sendBackwards = (function (originalFn) {
  return function (...args) {
    this._historySaveAction();
    originalFn.call(this, ...args);
    return this;
  };
})(fabric.Canvas.prototype.sendBackwards);

/**
 * Override the bringForward function for the Canvas;
 */
fabric.Canvas.prototype.bringForward = (function (originalFn) {
  return function (...args) {
    this._historySaveAction();
    originalFn.call(this, ...args);
    return this;
  };
})(fabric.Canvas.prototype.bringForward);

/**
 * Initialization of the plugin
 */
fabric.Canvas.prototype._historyInit = function () {
  this.historyUndo = [];
  this.historyRedo = [];
  this.extraProps = EXTRA_ELEMENT_PROPS;
  this.historyNextState = this._historyNext();

  this.on(this._historyEvents());
};

/**
 * Remove the custom event listeners
 */
fabric.Canvas.prototype._historyDispose = function () {
  this.off(this._historyEvents());
};

/**
 * It pushes the state of the canvas into history stack
 */
fabric.Canvas.prototype._historySaveAction = function () {
  if (this.historyProcessing) return;
  const json = this.historyNextState;
  if (this.historyUndo.length === 0) {
    this.historyUndo.push(json);
  }
  this.historyNextState = this._historyNext();
  if (json !== this.historyUndo[this.historyUndo.length - 1]) {
    this.historyUndo.push(json);
    this.fire("history:append", { json: json });
  }
};

/**
 * Undo to latest history.
 * Pop the latest state of the history. Re-render.
 * Also, pushes into redo history.
 */
fabric.Canvas.prototype.undo = function (callback) {
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;

  const history = this.historyUndo.pop();
  if (history) {
    // Push the current state to the redo history
    this.historyRedo.push(this._historyNext());
    this.historyNextState = history;
    this._loadHistory(history, "history:undo", callback);
  } else {
    this.historyProcessing = false;
  }
};

fabric.Canvas.prototype.removeLastEventHistory = function () {
  this.historyProcessing = true;
  this.historyUndo.pop();
  this.historyProcessing = false;
};

/**
 * Redo to latest undo history.
 */
fabric.Canvas.prototype.redo = function (callback) {
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;
  const history = this.historyRedo.pop();
  if (history) {
    // Every redo action is actually a new action to the undo history
    this.historyUndo.push(this._historyNext());
    this.historyNextState = history;
    this._loadHistory(history, "history:redo", callback);
  } else {
    this.historyProcessing = false;
  }
};

fabric.Canvas.prototype._loadHistory = function (history, event, callback) {
  var that = this;

  this.loadFromJSON(history, function () {
    that.renderAll();
    that.fire(event);
    that.historyProcessing = false;

    if (callback && typeof callback === "function") callback();
  });
};

/**
 * Clear undo and redo history stacks
 */
fabric.Canvas.prototype.clearHistory = function () {
  this.historyUndo = [];
  this.historyRedo = [];
  this.historyNextState = this._historyNext();
  this.fire("history:clear");
};

/**
 * On the history
 */
fabric.Canvas.prototype.onHistory = function () {
  this.historyProcessing = false;
  this._historySaveAction();
};

/**
 * Off the history
 */
fabric.Canvas.prototype.offHistory = function () {
  this.historyProcessing = true;
};
