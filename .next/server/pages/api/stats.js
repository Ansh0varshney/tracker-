"use strict";
(() => {
var exports = {};
exports.id = 939;
exports.ids = [939];
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

/***/ 941:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(722);
/* harmony import */ var _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);


async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).end("Method Not Allowed");
    }
    try {
        await (0,_mongodb__WEBPACK_IMPORTED_MODULE_0__/* .connectToDatabase */ .v)();
        // Get counts of different event types
        const openCount = await _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__/* ["default"].countDocuments */ .Z.countDocuments({
            type: "open"
        });
        const clickCount = await _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__/* ["default"].countDocuments */ .Z.countDocuments({
            type: "click"
        });
        // Get unique recipients who have opened
        const uniqueOpeners = await _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__/* ["default"].distinct */ .Z.distinct("recipient", {
            type: "open"
        });
        // Get unique companies
        const companies = await _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__/* ["default"].distinct */ .Z.distinct("company");
        // Get company engagement stats
        const companyStats = await Promise.all(companies.map(async (company)=>{
            const opens = await _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__/* ["default"].countDocuments */ .Z.countDocuments({
                company,
                type: "open"
            });
            const clicks = await _models_EmailEvent__WEBPACK_IMPORTED_MODULE_1__/* ["default"].countDocuments */ .Z.countDocuments({
                company,
                type: "click"
            });
            return {
                company,
                opens,
                clicks,
                engagement: opens + clicks
            };
        }));
        // Most engaged companies
        companyStats.sort((a, b)=>b.engagement - a.engagement);
        return res.status(200).json({
            totalEvents: openCount + clickCount,
            openCount,
            clickCount,
            uniqueOpenersCount: uniqueOpeners.length,
            topCompanies: companyStats.slice(0, 5)
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(500).json({
            error: error.message
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
var __webpack_exports__ = __webpack_require__.X(0, [722], () => (__webpack_exec__(941)));
module.exports = __webpack_exports__;

})();