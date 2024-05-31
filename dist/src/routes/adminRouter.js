"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.route('/list-all-users').get(auth_1.isLoggedIn, adminController_1.getAllUsers);
router.route('/delete-users/:id').delete(auth_1.isLoggedIn, adminController_1.deleteUser);
// Blockuser
// Create coupons
exports.default = router;
//# sourceMappingURL=adminRouter.js.map