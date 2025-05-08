"use strict";
(() => {
var exports = {};
exports.id = 774;
exports.ids = [774];
exports.modules = {

/***/ 81:
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ 663:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 645:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

// Check if the model already exists to prevent OverwriteModelError
const EmailEvent = (mongoose__WEBPACK_IMPORTED_MODULE_0___default().models.EmailEvent) || mongoose__WEBPACK_IMPORTED_MODULE_0___default().model("EmailEvent", new (mongoose__WEBPACK_IMPORTED_MODULE_0___default().Schema)({
    type: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    linkClicked: {
        type: String
    },
    userAgent: {
        type: String
    },
    ipAddress: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmailEvent);


/***/ }),

/***/ 855:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(722);
/* harmony import */ var _models_EmailEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(645);
// File: api/pixel/[emailId].js - Tracking pixel endpoint



async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).end("Method Not Allowed");
    }
    console.log("Pixel tracking request received:", {
        query: req.query,
        headers: req.headers,
        method: req.method
    });
    const { emailId  } = req.query;
    const recipient = req.query.p || "unknown";
    const company = req.query.c || "unknown";
    try {
        console.log("Attempting to connect to MongoDB...");
        // Connect to MongoDB
        await (0,_mongodb__WEBPACK_IMPORTED_MODULE_1__/* .connectToDatabase */ .v)();
        console.log("MongoDB connection successful");
        // Create a new email open event
        const openEvent = new _models_EmailEvent__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z({
            type: "open",
            emailId,
            recipient,
            company,
            userAgent: req.headers["user-agent"],
            ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress
        });
        console.log("Saving event:", openEvent);
        // Save the event
        await openEvent.save();
        console.log(`Email open tracked: ${emailId} by ${recipient} at ${company}`);
        // Return a 1x1 transparent GIF
        const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
        res.setHeader("Content-Type", "image/gif");
        res.setHeader("Content-Length", pixel.length);
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        return res.status(200).send(pixel);
    } catch (error) {
        console.error("Error tracking open:", {
            error: error.message,
            stack: error.stack,
            emailId,
            recipient,
            company
        });
        return res.status(500).end();
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [722], () => (__webpack_exec__(855)));
module.exports = __webpack_exports__;

})();