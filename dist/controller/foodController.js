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
exports.deleteFood = exports.updateFood = exports.createFood = exports.readFood = void 0;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const global_1 = require("../global");
const prisma = new client_1.PrismaClient({ errorFormat: "pretty" });
const readFood = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cari } = request.query;
        const allFoods = yield prisma.food.findMany({
            where: {
                name: { contains: (cari === null || cari === void 0 ? void 0 : cari.toString()) || "" }
            }
        });
        /** contains means search name of food based on sent keyword */
        return response.json({
            status: true,
            data: allFoods,
            message: `Foods has retrieved`
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
exports.readFood = readFood;
const createFood = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, spicy_level, price } = request.body; /** get requested data (data has been sent from request) */
        /** variable filename use to define of uploaded file name */
        let filename = "";
        if (request.file)
            filename = request.file.filename; /** get file name of uploaded file */
        /** process to save new food */
        const newFood = yield prisma.food.create({
            data: { name, spicy_level: String(spicy_level), price: Number(price), image: filename }
        });
        /** price and stock have to convert in number type */
        return response.json({
            status: true,
            data: newFood,
            message: `New Food has created`
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
exports.createFood = createFood;
// export const updateFood = async (request: Request, response: Response) => {
//     try {
//         const { item_id } = request.params /** get id of food's id that sent in parameter of URL */
//         const { name, spicy_level, price } = request.body /** get requested data (data has been sent from request) */
//         /** make sure that data is exists in database */
//         const findFood = await prisma.food.findFirst({ where: { item_id: Number(item_id) } })
//         if (!findFood) return response
//             .status(200)
//             .json({ status: false, message: `Food is not found` })
//         let filename = findFood.image /** default value of variable filename based on saved information */
//         if (request.file) {
//             filename = request.file.filename
//             let path = `${BASE_URL}/../public/image/${findFood.image}`
//             let exists = fs.existsSync(path)
//             if (exists && findFood.image !== ``) fs.unlinkSync(path)
//             /** this code use to delete old exists file if reupload new file */
//         }
//         /** process to update Food's data */
//         const updatedFood = await prisma.food.update({
//             data: {
//                 name: name || findFood.name,
//                 price: price ? Number(price) : findFood.price,
//                 spicy_level: spicy_level ? String(spicy_level) : findFood.spicy_level,
//                 image: filename
//             },
//             where: { item_id: Number(item_id) }
//         })
//         return response.json({
//             status: true,
//             data: updatedFood,
//             message: `Food has updated`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `An error has occured ${error}`
//             })
//             .status(400)
//     }
// }
const updateFood = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = request.params;
        const { name, spicy_level, price } = request.body;
        const findFood = yield prisma.food.findFirst({ where: { item_id: Number(item_id) } });
        if (!findFood) {
            return response.status(404).json({ status: false, message: `Food is not found` });
        }
        let filename = findFood.image; // Default value based on existing image
        if (request.file) {
            // If a new file is uploaded, use the new filename
            filename = request.file.filename;
            // Delete old image file
            const imagePath = `${global_1.BASE_URL}/public/image/${findFood.image}`;
            const imageExists = fs_1.default.existsSync(imagePath);
            if (imageExists && findFood.image !== '') {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        const updatedFood = yield prisma.food.update({
            data: {
                name: name || findFood.name,
                price: price ? Number(price) : findFood.price,
                spicy_level: spicy_level ? String(spicy_level) : findFood.spicy_level,
                image: filename
            },
            where: { item_id: Number(item_id) }
        });
        return response.json({
            status: true,
            data: updatedFood,
            message: `Food and image have been updated`
        }).status(200);
    }
    catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
});
exports.updateFood = updateFood;
// export const deleteFood = async (request: Request, response: Response) => {
//     try {
//         const { item_id } = request.params
//         /** make sure that data is exists in database */
//         const findFood = await prisma.food.findFirst({ where: { item_id: Number(item_id) } })
//         if (!findFood) return response
//             .status(200)
//             .json({ status: false, message: `Food is not found` })
//         /** prepare to delete file of deleted Food's data */
//         let path = `${BASE_URL}/public/image/${findFood.image}` /** define path (address) of file location */
//         let exists = fs.existsSync(path)
//         if (exists && findFood.image !== ``) fs.unlinkSync(path) /** if file exist, then will be delete */
//         /** process to delete Food's data */
//         const deletedFood = await prisma.food.delete({
//             where: { item_id: Number(item_id) }
//         })
//         return response.json({
//             status: true,
//             data: deletedFood,
//             message: `Food has been deleted`
//         }).status(200)
//     } catch (error) {
//         return response
//             .json({
//                 status: false,
//                 message: `There is an error. ${error}`
//             })
//             .status(400)
//     }
// }
const deleteFood = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { item_id } = request.params;
        const findFood = yield prisma.food.findFirst({ where: { item_id: Number(item_id) } });
        if (!findFood) {
            return response.status(404).json({ status: false, message: `Food is not found` });
        }
        const imagePath = `${global_1.BASE_URL}/public/image/${findFood.image}`;
        const imageExists = fs_1.default.existsSync(imagePath);
        if (imageExists && findFood.image !== '') {
            fs_1.default.unlinkSync(imagePath);
        }
        const deletedFood = yield prisma.food.delete({ where: { item_id: Number(item_id) } });
        return response.json({
            status: true,
            data: deletedFood,
            message: `Food and related image have been deleted`
        }).status(200);
    }
    catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
});
exports.deleteFood = deleteFood;
