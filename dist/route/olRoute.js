"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const olController_1 = require("../controller/olController");
const verifyOrder_1 = require("../middleware/verifyOrder");
const app = (0, express_1.default)();
// allow to read json from the body
app.use(express_1.default.json());
// adress for get admin data
app.get(`/table`, verify_1.verifyAdmin, olController_1.readOrder);
// adress for add new admin
app.post(`/table`, verify_1.verifyUser, verifyOrder_1.verifyAddOrder, olController_1.createOrder);
app.put(`/table/:list_id`, verify_1.verifyAdmin, verifyOrder_1.verifyEditOrder, olController_1.updateOrder);
app.delete(`/table/:list_id`, verify_1.verifyAdmin, olController_1.deleteOrder);
exports.default = app;
