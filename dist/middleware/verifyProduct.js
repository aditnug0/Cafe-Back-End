"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEditProduct = exports.verifyAddProduct = void 0;
const joi_1 = __importDefault(require("joi"));
/** create schema when add new egg's data, all of fileds have to be required */
const addDataSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    qty: joi_1.default.number().min(1).required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().min(1).required(),
    image: joi_1.default.allow().optional()
});
/** create schema when edit egg's data, all of fileds allow and optional to sent in request */
const updateDataSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    qty: joi_1.default.number().min(1).optional(),
    description: joi_1.default.string().optional(),
    price: joi_1.default.number().min(1).optional(),
    image: joi_1.default.allow().optional()
});
const verifyAddProduct = (request, response, next) => {
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
exports.verifyAddProduct = verifyAddProduct;
const verifyEditProduct = (request, response, next) => {
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
exports.verifyEditProduct = verifyEditProduct;
