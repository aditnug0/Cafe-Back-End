import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const readFood = async (request: Request, response: Response) => {
    try {
        const { cari } = request.query
        const allFoods = await prisma.food.findMany({
            where: {
                name: { contains: cari?.toString() || "" }
            }
        })
        /** contains means search name of food based on sent keyword */
        return response.json({
            status: true,
            data: allFoods,
            message: `Foods has retrieved`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `Error has occured ${error}`
            })
            .status(400)
    }
}

export const createFood = async (request: Request, response: Response) => {
    try {
        const { name, spicy_level, price } = request.body /** get requested data (data has been sent from request) */

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (request.file) filename = request.file.filename /** get file name of uploaded file */

        /** process to save new food */
        const newFood = await prisma.food.create({
            data: { name, spicy_level: String(spicy_level), price: Number(price), image: filename }
        })
        /** price and stock have to convert in number type */

        return response.json({
            status: true,
            data: newFood,
            message: `New Food has created`
        }).status(200)
    } catch (error) {
        return response
            .json({
                status: false,
                message: `An error has occured ${error}`
            })
            .status(400)
    }
}

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

export const updateFood = async (request: Request, response: Response) => {
    try {
        const { item_id } = request.params;
        const { name, spicy_level, price } = request.body;

        const findFood = await prisma.food.findFirst({ where: { item_id: Number(item_id) } });
        if (!findFood) {
            return response.status(404).json({ status: false, message: `Food is not found` });
        }

        let filename = findFood.image; // Default value based on existing image

        if (request.file) {
            // If a new file is uploaded, use the new filename
            filename = request.file.filename;

            // Delete old image file
            const imagePath = `${BASE_URL}/public/image/${findFood.image}`;
            const imageExists = fs.existsSync(imagePath);

            if (imageExists && findFood.image !== '') {
                fs.unlinkSync(imagePath);
            }
        }

        const updatedFood = await prisma.food.update({
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
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
};

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

export const deleteFood = async (request: Request, response: Response) => {
    try {
        const { item_id } = request.params;

        const findFood = await prisma.food.findFirst({ where: { item_id: Number(item_id) } });
        if (!findFood) {
            return response.status(404).json({ status: false, message: `Food is not found` });
        }

        const imagePath = `${BASE_URL}/public/image/${findFood.image}`;
        const imageExists = fs.existsSync(imagePath);

        if (imageExists && findFood.image !== '') {
            fs.unlinkSync(imagePath);
        }

        const deletedFood = await prisma.food.delete({ where: { item_id: Number(item_id) } });

        return response.json({
            status: true,
            data: deletedFood,
            message: `Food and related image have been deleted`
        }).status(200);
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
};
