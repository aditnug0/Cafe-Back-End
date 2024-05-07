"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const verifytoken_1 = require("../middleware/verifytoken");
const adminController_1 = require("../controller/adminController");
const app = (0, express_1.default)();
// allow to read json from the body
app.use(express_1.default.json());
// adress for get admin data
app.get(`/admin`, verify_1.verifyAdmin, adminController_1.readAdmin);
// adress for add new admin
app.post(`/admin`, verify_1.verifyAdmin, adminController_1.createAdmin);
app.put(`/admin/:adminId`, verify_1.verifyAdmin, adminController_1.updateAdmin);
app.delete(`/admin/:adminId`, verify_1.verifyAdmin, adminController_1.deleteAdmin);
app.post(`/admin/login`, verifytoken_1.verifyAuthentication, adminController_1.login);
exports.default = app;
