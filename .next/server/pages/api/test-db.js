"use strict";
(() => {
var exports = {};
exports.id = 414;
exports.ids = [414];
exports.modules = {

/***/ 81:
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ 663:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 684:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(722);

async function handler(req, res) {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
        const conn = await (0,_mongodb__WEBPACK_IMPORTED_MODULE_0__/* .connectToDatabase */ .v)();
        console.log("MongoDB connection successful");
        res.status(200).json({
            status: "Connected to MongoDB successfully!",
            connection: !!conn
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        res.status(500).json({
            error: error.message,
            details: "Check server console for more information"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [722], () => (__webpack_exec__(684)));
module.exports = __webpack_exports__;

})();