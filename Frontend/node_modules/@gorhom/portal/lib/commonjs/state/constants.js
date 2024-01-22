"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INITIAL_STATE = exports.ACTIONS = void 0;
var ACTIONS;
exports.ACTIONS = ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["REGISTER_HOST"] = 0] = "REGISTER_HOST";
  ACTIONS[ACTIONS["DEREGISTER_HOST"] = 1] = "DEREGISTER_HOST";
  ACTIONS[ACTIONS["ADD_UPDATE_PORTAL"] = 2] = "ADD_UPDATE_PORTAL";
  ACTIONS[ACTIONS["REMOVE_PORTAL"] = 3] = "REMOVE_PORTAL";
})(ACTIONS || (exports.ACTIONS = ACTIONS = {}));

const INITIAL_STATE = {};
exports.INITIAL_STATE = INITIAL_STATE;
//# sourceMappingURL=constants.js.map