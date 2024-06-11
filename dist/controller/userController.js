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
exports.loginUser = exports.deleteUser = exports.updateUser = exports.readUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = require("jsonwebtoken");
// create an object from prisma
const prisma = new client_1.PrismaClient();
// create a function to "create" new user
// asyncronous = fungsi yang berjalan secara pararel
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read a request from body
        const name = request.body.name;
        const email = request.body.email;
        const password = (0, md5_1.default)(request.body.password);
        //insert to user table using prisma
        const newData = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });
        return response.status(200).json({
            status: true,
            message: `User data has been created`,
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
exports.createUser = createUser;
// create a function to READ user
const readUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // pagination
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        // searching
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        // await untuk memebri delay pada sistem asyncronous sehingga berjalan
        // seperti syncronous dan menunggu sistem sebelumnya
        const userData = yield prisma.user.findMany({
            //untuk mendefinisikan jml data yang diambil
            take: qty,
            skip: (page - 1) * qty,
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { email: { contains: keyword } },
                ]
            },
            orderBy: { userId: "asc" }
        });
        return response.status(200).json({
            status: true,
            message: `User data has been loaded`,
            data: userData,
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.readUser = readUser;
// baru
// function for update user
const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read user id that sent from url
        const userId = request.params.userId;
        // read data perubahan
        const name = request.body.name;
        const email = request.body.email;
        const password = (0, md5_1.default)(request.body.password);
        // make sure that data has existed
        const findUser = yield prisma.user.findFirst({
            where: { userId: Number(userId) }
        });
        if (!findUser) {
            return response.status(400).json({
                status: false,
                message: `User data not found`
            });
        }
        const dataUser = yield prisma.user.update({
            where: { userId: Number(userId) },
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: password || findUser.password
            }
        });
        return response.status(200).json({
            status: true,
            message: `Data has been updated`,
            data: dataUser
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.updateUser = updateUser;
// create a function to delete user
const deleteUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get user id from url 
        const userId = request.params.userId;
        // make sure that user is exist 
        const findUsers = yield prisma.user.findFirst({
            where: { userId: Number(userId) }
        });
        if (!findUsers) {
            return response.status(400).json({
                status: false,
                message: `Data not found`
            });
        }
        // execute for delete user
        const dataUser = yield prisma.user.delete({
            where: { userId: Number(userId) }
        });
        // return response 
        return response.status(200).json({
            status: true,
            message: `User data has been deleted `
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.deleteUser = deleteUser;
const loginUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = request.body.email;
        const password = (0, md5_1.default)(request.body.password);
        const user = yield prisma.user.findFirst({
            where: { email: email, password: password }
        });
        if (user) {
            const payload = user;
            const secretkey = 'user☝️';
            const token = (0, jsonwebtoken_1.sign)(payload, secretkey);
            return response.status(200).json({
                status: true,
                message: "login success 😁",
                token: token
            });
        }
        else {
            return response.status(200).json({
                status: false,
                message: "Failed to LogIn "
            });
        }
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.loginUser = loginUser;
