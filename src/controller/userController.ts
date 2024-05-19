import { PrismaClient } from "@prisma/client";
import { Request, Response, request, response } from "express";
import md5 from "md5"
import { sign } from "jsonwebtoken";
import { Sign } from "crypto";

// create an object from prisma
const prisma = new PrismaClient();

// create a function to "create" new user
// asyncronous = fungsi yang berjalan secara pararel
const createUser = async (request: Request, response: Response) => {
    try {
        // read a request from body
        const name = request.body.name;
        const email = request.body.email;
        const password = md5(request.body.password);

        //insert to user table using prisma
        const newData = await prisma.user.create({
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
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
};

// create a function to READ user
const readUser = async (request: Request, response: Response) => {
    try {
        // pagination
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        // searching
        const keyword = request.query.keyword?.toString() || "";

        // await untuk memebri delay pada sistem asyncronous sehingga berjalan
        // seperti syncronous dan menunggu sistem sebelumnya
        const userData = await prisma.user.findMany({
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
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
};


// baru
// function for update user
const updateUser = async (request: Request, response: Response) => {

    try {
        // read user id that sent from url
        const userId = request.params.userId
        // read data perubahan
        const name = request.body.name
        const email = request.body.email
        const password = md5(request.body.password)
        // make sure that data has existed
        const findUser = await prisma.user.findFirst({
            where: { userId: Number(userId) }
        })

        if (!findUser) {
            return response.status(400).json({
                status: false,
                message: `User data not found`
            })
        }

        const dataUser = await prisma.user.update({
            where: { userId: Number(userId) },
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: password || findUser.password
            }
        })

        return response.status(200).json({
            status: true,
            message: `Data has been updated`,
            data: dataUser
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
// create a function to delete user
const deleteUser = async (request: Request, response: Response) => {
    try {

        // get user id from url 
        const userId = request.params.userId

        // make sure that user is exist 
        const findUsers = await prisma.user.findFirst({
            where: { userId: Number(userId) }
        })

        if (!findUsers) {
            return response.status(400).json({
                status: false,
                message: `Data not found`
            })
        }

        // execute for delete user
        const dataUser = await prisma.user.delete({
            where: { userId: Number(userId) }
        })

        // return response 
        return response.status(200).json({
            status: true,
            message: `User data has been deleted `
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
const loginUser = async (request: Request, response: Response) => {
    try {
        const email = request.body.email
        const password = md5(request.body.password)
        const user = await prisma.user.findFirst(
            {
                where: { email: email, password: password }
            }
        )
        if (user) {
            const payload = user
            const secretkey = 'user☝️'
            const token = sign(payload, secretkey)

            return response.status(200).json({
                status: true,
                message: "login success 😁",
                token: token
            })
        }
        else {
            return response.status(200).json({
                status: false,
                message: "Failed to LogIn "
            })
        }

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
export { createUser, readUser, updateUser, deleteUser, loginUser };
