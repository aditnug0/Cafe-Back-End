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
exports.login = exports.deleteAdmin = exports.updateAdmin = exports.readAdmin = exports.createAdmin = void 0;
const client_1 = require("@prisma/client");
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = require("jsonwebtoken");
// create an object from prisma
const prisma = new client_1.PrismaClient();
// create a function to "create" new admin
// asyncronous = fungsi yang berjalan secara pararel
const createAdmin = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read a request from body
        const name = request.body.name;
        const email = request.body.email;
        const password = (0, md5_1.default)(request.body.password);
        //insert to admin table using prisma
        const newData = yield prisma.admin.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });
        return response.status(200).json({
            status: true,
            message: `Admin data has been created`,
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
exports.createAdmin = createAdmin;
// create a function to READ admin
const readAdmin = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // pagination
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        // searching
        const keyword = ((_a = request.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        // await untuk memebri delay pada sistem asyncronous sehingga berjalan
        // seperti syncronous dan menunggu sistem sebelumnya
        const adminData = yield prisma.admin.findMany({
            //untuk mendefinisikan jml data yang diambil
            take: qty,
            skip: (page - 1) * qty,
            where: {
                OR: [
                    { name: { contains: keyword } },
                    { email: { contains: keyword } },
                ]
            },
            orderBy: { adminId: "asc" }
        });
        return response.status(200).json({
            status: true,
            message: `Admin data has been loaded`,
            data: adminData,
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.readAdmin = readAdmin;
// baru
// function for update admin
const updateAdmin = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // read admin id that sent from url
        const adminId = request.params.adminId;
        // read data perubahan
        const name = request.body.name;
        const email = request.body.email;
        const password = (0, md5_1.default)(request.body.password);
        // make sure that data has existed
        const findAdmin = yield prisma.admin.findFirst({
            where: { adminId: Number(adminId) }
        });
        if (!findAdmin) {
            return response.status(400).json({
                status: false,
                message: `Admin data not found`
            });
        }
        const dataAdmin = yield prisma.admin.update({
            where: { adminId: Number(adminId) },
            data: {
                name: name || findAdmin.name,
                email: email || findAdmin.email,
                password: password || findAdmin.password
            }
        });
        return response.status(200).json({
            status: true,
            message: `Data has been updated`,
            data: dataAdmin
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.updateAdmin = updateAdmin;
// create a function to delete admin
const deleteAdmin = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get admin id from url 
        const adminId = request.params.adminId;
        // make sure that admin is exist 
        const findAdmins = yield prisma.admin.findFirst({
            where: { adminId: Number(adminId) }
        });
        if (!findAdmins) {
            return response.status(400).json({
                status: false,
                message: `Data not found`
            });
        }
        // execute for delete admin
        const dataAdmin = yield prisma.admin.delete({
            where: { adminId: Number(adminId) }
        });
        // return response 
        return response.status(200).json({
            status: true,
            message: `Admin data has been deleted `
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.deleteAdmin = deleteAdmin;
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = request.body.email;
        const password = (0, md5_1.default)(request.body.password);
        const admin = yield prisma.admin.findFirst({
            where: { email: email, password: password }
        });
        if (admin) {
            const payload = admin;
            const secretkey = 'yummy😋😋';
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
exports.login = login;
