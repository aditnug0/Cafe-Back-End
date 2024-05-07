"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditOrder = exports.verifyAddOrder = void 0;
const joi_1 = __importDefault(require("joi"));
const detailSchema = joi_1.default.object({
    quantity: joi_1.default.number().min(1).required(),
    price: joi_1.default.number().min(1).optional(),
    food_id: joi_1.default.number().min(1).optional()
});
/** create schema when add new pack's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    customer_name: joi_1.default.string().required(),
    table_number: joi_1.default.string().required(),
    order_date: joi_1.default.string().required(),
    order_detail: joi_1.default.array().items(detailSchema).min(1).required()
});
/** create schema when edit pack's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    customer_name: joi_1.default.string().optional(),
    table_number: joi_1.default.string().optional(),
    order_date: joi_1.default.string().optional(),
    order_detail: joi_1.default.array().items(detailSchema).min(1).optional()
});
const verifyAddOrder = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyAddOrder = verifyAddOrder;
const verifyEditOrder = (request, response, next) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false });
    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        });
    }
    return next();
};
exports.verifyEditOrder = verifyEditOrder;
