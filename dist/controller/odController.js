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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.readTransaction = exports.createTransaction = void 0;
const client_1 = require("@prisma/client");
// create an object from prisma
const prisma = new client_1.PrismaClient();
// create a function to "create" new admin
// asyncronous = fungsi yang berjalan secara pararel
const createTransaction = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read a request from body
        const order_id = request.body.order_id;
        const food_id = request.body.food_id;
        const quantity = request.body.quantity;
        const price = request.body.price;
        //insert to admin table using prisma
        const newData = yield prisma.order_detail.create({
            data: {
                order_id: order_id,
                food_id: food_id,
                quantity: quantity,
                price: price
            }
        });
        return response.status(200).json({
            status: true,
            message: `Transaction data has been created`,
            data: newData,
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.createTransaction = createTransaction;
// create a function to READ admin
const readTransaction = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // pagination
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        // searching
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        // await untuk memebri delay pada sistem asyncronous sehingga berjalan
        // seperti syncronous dan menunggu sistem sebelumnya
        const transactionData = yield prisma.order_detail.findMany({
            //untuk mendefinisikan jml data yang diambil
            take: qty,
            skip: (page - 1) * qty,
            orderBy: { detail_id: "asc" }
        });
        return response.status(200).json({
            status: true,
            message: `Transaction data has been loaded`,
            data: transactionData,
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.readTransaction = readTransaction;
// baru
// function for update admin
const updateTransaction = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read admin id that sent from url
        const detail_id = request.params.detail_id;
        // read data perubahan
        const order_id = request.body.order_id;
        const food_id = request.body.food_id;
        const quantity = request.body.quantity;
        const price = request.body.price;
        // make sure that data has existed
        const findTransaction = yield prisma.order_detail.findFirst({
            where: { detail_id: Number(detail_id) }
        });
        if (!findTransaction) {
            return response.status(400).json({
                status: false,
                message: `Transaction data not found`
            });
        }
        const dataTransaction = yield prisma.order_detail.update({
            where: { detail_id: Number(detail_id) },
            data: {
                order_id: order_id || findTransaction.order_id,
                food_id: food_id || findTransaction.food_id,
                quantity: quantity || findTransaction.quantity,
                price: price || findTransaction.price,
            }
        });
        return response.status(200).json({
            status: true,
            message: `Data has been updated`,
            data: dataTransaction
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.updateTransaction = updateTransaction;
// create a function to delete admin
const deleteTransaction = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get admin id from url 
        const detail_id = request.params.detail_id;
        // make sure that admin is exist 
        const findTransaction = yield prisma.order_detail.findFirst({
            where: { detail_id: Number(detail_id) }
        });
        if (!findTransaction) {
            return response.status(400).json({
                status: false,
                message: `Data not found`
            });
        }
        // execute for delete admin
        const dataTransaction = yield prisma.order_detail.delete({
            where: { detail_id: Number(detail_id) }
        });
        // return response 
        return response.status(200).json({
            status: true,
            message: `Transaction data has been deleted `
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.deleteTransaction = deleteTransaction;
