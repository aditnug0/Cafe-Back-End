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
exports.verifyUser = exports.verifyAdmin = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const verifyAdmin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // membaca data header request
        const header = request.headers.authorization;
        // membaca data token yang dikirimkan 
        const token = (header === null || header === void 0 ? void 0 : header.split(" ")[1]) || '';
        const secretkey = 'admin🤓';
        // proses verifikasi token 
        (0, jsonwebtoken_1.verify)(token, secretkey, error => {
            if (error) {
                return response.status(401).json({
                    status: false,
                    message: 'Unauthorized'
                });
            }
            next();
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.verifyAdmin = verifyAdmin;
const verifyUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // membaca data header request
        const header = request.headers.authorization;
        // membaca data token yang dikirimkan 
        const token = (header === null || header === void 0 ? void 0 : header.split(" ")[1]) || '';
        const secretkey = 'user☝️';
        // proses verifikasi token 
        (0, jsonwebtoken_1.verify)(token, secretkey, error => {
            if (error) {
                return response.status(401).json({
                    status: false,
                    message: 'Unauthorized'
                });
            }
            next();
        });
    }
    catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
});
exports.verifyUser = verifyUser;
