import { PrismaClient } from "@prisma/client";
import { Request, Response, request, response } from "express";
import md5 from "md5"
import { sign } from "jsonwebtoken";
import { Sign } from "crypto";

// create an object from prisma
const prisma = new PrismaClient();

// create a function to "create" new admin
// asyncronous = fungsi yang berjalan secara pararel
const createTransaction = async (request: Request, response: Response) => {
    try {
        // read a request from body
        const order_id = request.body.order_id;
        const food_id = request.body.food_id;
        const quantity = request.body.quantity;
        const price = request.body.price;

        //insert to admin table using prisma
        const newData = await prisma.order_detail.create({
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
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
};


// create a function to READ admin
const readTransaction = async (request: Request, response: Response) => {
    try {
        // pagination
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        // searching
        const keyword = request.query.keyword?.toString() || "";

        // await untuk memebri delay pada sistem asyncronous sehingga berjalan
        // seperti syncronous dan menunggu sistem sebelumnya
        const transactionData = await prisma.order_detail.findMany({
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
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
};


// baru
// function for update admin
const updateTransaction = async (request: Request, response: Response) => {

    try {
        // read admin id that sent from url
        const detail_id = request.params.detail_id
        // read data perubahan
        const order_id = request.body.order_id;
        const food_id = request.body.food_id;
        const quantity = request.body.quantity;
        const price = request.body.price;
        // make sure that data has existed
        const findTransaction = await prisma.order_detail.findFirst({
            where: { detail_id: Number(detail_id) }
        })

        if (!findTransaction) {
            return response.status(400).json({
                status: false,
                message: `Transaction data not found`
            })
        }

        const dataTransaction = await prisma.order_detail.update({
            where: { detail_id: Number(detail_id) },
            data: {
                order_id: order_id || findTransaction.order_id,
                food_id: food_id || findTransaction.food_id,
                quantity: quantity || findTransaction.quantity,
                price: price || findTransaction.price,

            }
        })

        return response.status(200).json({
            status: true,
            message: `Data has been updated`,
            data: dataTransaction
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
// create a function to delete admin
const deleteTransaction = async (request: Request, response: Response) => {
    try {

        // get admin id from url 
        const detail_id = request.params.detail_id

        // make sure that admin is exist 
        const findTransaction = await prisma.order_detail.findFirst({
            where: { detail_id: Number(detail_id) }
        })

        if (!findTransaction) {
            return response.status(400).json({
                status: false,
                message: `Data not found`
            })
        }

        // execute for delete admin
        const dataTransaction = await prisma.order_detail.delete({
            where: { detail_id: Number(detail_id) }
        })

        // return response 
        return response.status(200).json({
            status: true,
            message: `Transaction data has been deleted `
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
export { createTransaction, readTransaction, updateTransaction, deleteTransaction };
