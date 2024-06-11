"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.readProduct = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../global");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const readProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = request.query;
        const allProducts = yield prisma.product.findMany({
            where: {
                name: { contains: (search === null || search === void 0 ? void 0 : search.toString()) || "" }
            }
        });
        /** contains means search name of product based on sent keyword */
        return response.json({
            status: true,
            data: allProducts,
            message: `Product has found`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `Error has occured ${error}`
        })
            .status(400);
    }
});
exports.readProduct = readProduct;
const createProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, qty, description, price } = request.body; /** get requested data (data has been sent from request) */
        /** variable filename use to define of uploaded file name */
        let filename = "";
        if (request.file)
            filename = request.file.filename; /** get file name of uploaded file */
        /** process to save new product */
        const newProduct = yield prisma.product.create({
            data: { name, qty: Number(qty), description: String(description), price: Number(price), image: filename }
        });
        /** price and stock have to convert in number type */
        return response.json({
            status: true,
            data: newProduct,
            message: `New Product data has created`
        }).status(200);
    }
    catch (error) {
        return response
            .json({
            status: false,
            message: `An error has occured ${error}`
        })
            .status(400);
    }
});
exports.createProduct = createProduct;
const updateProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = request.params;
        const { name, qty, description, price } = request.body; /** get requested data (data has been sent from request) */
        const findProduct = yield prisma.product.findFirst({ where: { item_id: Number(item_id) } });
        if (!findProduct) {
            return response.status(404).json({ status: false, message: `Product is not found` });
        }
        let filename = findProduct.image; // Default value based on existing image
        if (request.file) {
            // If a new file is uploaded, use the new filename
            filename = request.file.filename;
            // Delete old image file
            const imagePath = `${global_1.BASE_URL}/public/image/${findProduct.image}`;
            const imageExists = fs_1.default.existsSync(imagePath);
            if (imageExists && findProduct.image !== '') {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        const updateProduct = yield prisma.product.update({
            data: {
                name: name || findProduct.name,
                qty: qty ? Number(qty) : findProduct.qty,
                description: description ? String(description) : findProduct.description,
                price: price ? Number(price) : findProduct.price,
                image: filename
            },
            where: { item_id: Number(item_id) }
        });
        return response.json({
            status: true,
            data: updateProduct,
            message: `Product data have been updated`
        }).status(200);
    }
    catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = request.params;
        const findProduct = yield prisma.product.findFirst({ where: { item_id: Number(item_id) } });
        if (!findProduct) {
            return response.status(404).json({ status: false, message: `Product is not found` });
        }
        const imagePath = `${global_1.BASE_URL}/public/image/${findProduct.image}`;
        const imageExists = fs_1.default.existsSync(imagePath);
        if (imageExists && findProduct.image !== '') {
            fs_1.default.unlinkSync(imagePath);
        }
        const deletedProduct = yield prisma.product.delete({ where: { item_id: Number(item_id) } });
        return response.json({
            status: true,
            data: deletedProduct,
            message: `Product data have been deleted`
        }).status(200);
    }
    catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
});
exports.deleteProduct = deleteProduct;
