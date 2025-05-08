"use strict";
(() => {
var exports = {};
exports.id = 398;
exports.ids = [398];
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

/***/ 538:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(722);
/* harmony import */ var _models_EmailEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(645);



async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).end("Method Not Allowed");
    }
    const { emailId  } = req.query;
    const { to , r: recipient , c: company  } = req.query;
    if (!to) {
        return res.status(400).send("Missing destination URL");
    }
    try {
        // Connect to MongoDB
        await (0,_mongodb__WEBPACK_IMPORTED_MODULE_1__/* .connectToDatabase */ .v)();
        // Decode the destination URL
        const decodedUrl = decodeURIComponent(to);
        // Create a new link click event
        const clickEvent = new _models_EmailEvent__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z({
            type: "click",
            emailId,
            recipient: recipient || "unknown",
            company: company || "unknown",
            linkClicked: decodedUrl,
            userAgent: req.headers["user-agent"],
            ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress
        });
        // Save the event
        await clickEvent.save();
        console.log(`Link click tracked: ${decodedUrl} by ${recipient} at ${company}`);
        // Redirect to the destination URL
        return res.redirect(decodedUrl);
    } catch (error) {
        console.error("Error tracking click:", error);
        // Redirect anyway, even if tracking fails
        return res.redirect(decodeURIComponent(to));
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [722], () => (__webpack_exec__(538)));
module.exports = __webpack_exports__;

})();