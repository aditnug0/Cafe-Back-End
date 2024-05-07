"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verify_1 = require("../middleware/verify");
const odController_1 = require("../controller/odController");
const verifyOrder_1 = require("../middleware/verifyOrder");
const app = (0, express_1.default)();
// allow to read json from the body
app.use(express_1.default.json());
// adress for get admin data
app.get(`/transaction`, verify_1.verifyAdmin, odController_1.readTransaction);
// adress for add new admin
app.post(`/transaction`, verify_1.verifyAdmin, verifyOrder_1.verifyAddOrder, odController_1.createTransaction);
app.put(`/transaction/:detail_id`, verify_1.verifyAdmin, verifyOrder_1.verifyEditOrder, odController_1.updateTransaction);
app.delete(`/transaction/:detail_id`, verify_1.verifyAdmin, odController_1.deleteTransaction);
exports.default = app;
