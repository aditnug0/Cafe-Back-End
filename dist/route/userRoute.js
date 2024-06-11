"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const verifytoken_1 = require("../middleware/verifytoken");
const userController_1 = require("../controller/userController");
const app = (0, express_1.default)();
// allow to read json from the body
app.use(express_1.default.json());
// adress for get admin data
app.get(`/user`, verify_1.verifyUser, userController_1.readUser);
// adress for add new admin
app.post(`/user`, verifytoken_1.verifyAddAU, userController_1.createUser);
app.put(`/user/:userId`, verify_1.verifyUser, verifytoken_1.verifyEditAU, userController_1.updateUser);
app.delete(`/user/:userId`, verify_1.verifyUser, userController_1.deleteUser);
app.post(`/user/login`, verifytoken_1.verifyAuthentication, userController_1.loginUser);
exports.default = app;
