import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const readProduct = async (request: Request, response: Response) => {
    try {
        const { search } = request.query
        const allProducts = await prisma.product.findMany({
            where: {
                name: { contains: search?.toString() || "" }
            }
        })
        /** contains means search name of product based on sent keyword */
        return response.json({
            status: true,
            data: allProducts,
            message: `Product has found`
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


export const createProduct = async (request: Request, response: Response) => {
    try {
        const { name, qty, description, price } = request.body /** get requested data (data has been sent from request) */

        /** variable filename use to define of uploaded file name */
        let filename = ""
        if (request.file) filename = request.file.filename /** get file name of uploaded file */

        /** process to save new product */
        const newProduct = await prisma.product.create({
            data: { name, qty: Number(qty), description: String(description), price: Number(price), image: filename }
        })
        /** price and stock have to convert in number type */

        return response.json({
            status: true,
            data: newProduct,
            message: `New Product data has created`
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


export const updateProduct = async (request: Request, response: Response) => {
    try {
        const { item_id } = request.params;
        const { name, qty, description, price } = request.body /** get requested data (data has been sent from request) */

        const findProduct = await prisma.product.findFirst({ where: { item_id: Number(item_id) } });
        if (!findProduct) {
            return response.status(404).json({ status: false, message: `Product is not found` });
        }

        let filename = findProduct.image; // Default value based on existing image

        if (request.file) {
            // If a new file is uploaded, use the new filename
            filename = request.file.filename;

            // Delete old image file
            const imagePath = `${BASE_URL}/public/image/${findProduct.image}`;
            const imageExists = fs.existsSync(imagePath);

            if (imageExists && findProduct.image !== '') {
                fs.unlinkSync(imagePath);
            }
        }

        const updateProduct = await prisma.product.update({
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
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
};

export const deleteProduct = async (request: Request, response: Response) => {
    try {
        const { item_id } = request.params;

        const findProduct = await prisma.product.findFirst({ where: { item_id: Number(item_id) } });
        if (!findProduct) {
            return response.status(404).json({ status: false, message: `Product is not found` });
        }

        const imagePath = `${BASE_URL}/public/image/${findProduct.image}`;
        const imageExists = fs.existsSync(imagePath);

        if (imageExists && findProduct.image !== '') {
            fs.unlinkSync(imagePath);
        }

        const deletedProduct = await prisma.product.delete({ where: { item_id: Number(item_id) } });

        return response.json({
            status: true,
            data: deletedProduct,
            message: `Product data have been deleted`
        }).status(200);
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `An error occurred: ${error}`
        });
    }
};
