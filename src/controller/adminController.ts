import { PrismaClient } from "@prisma/client";
import { Request, Response, request, response } from "express";
import md5 from "md5"
import { sign } from "jsonwebtoken";
import { Sign } from "crypto";

// create an object from prisma
const prisma = new PrismaClient();

// create a function to "create" new admin
// asyncronous = fungsi yang berjalan secara pararel
const createAdmin = async (request: Request, response: Response) => {
    try {
        // read a request from body
        const name = request.body.name;
        const email = request.body.email;
        const password = md5(request.body.password);

        //insert to admin table using prisma
        const newData = await prisma.admin.create({
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
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
};

// create a function to READ admin
const readAdmin = async (request: Request, response: Response) => {
    try {
        // pagination
        const page = Number(request.query.page) || 1;
        const qty = Number(request.query.qty) || 5;
        // searching
        const keyword = request.query.keyword?.toString() || "";

        // await untuk memebri delay pada sistem asyncronous sehingga berjalan
        // seperti syncronous dan menunggu sistem sebelumnya
        const adminData = await prisma.admin.findMany({
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
    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
};


// baru
// function for update admin
const updateAdmin = async (request: Request, response: Response) => {

    try {
        // read admin id that sent from url
        const adminId = request.params.adminId
        // read data perubahan
        const name = request.body.name
        const email = request.body.email
        const password = md5(request.body.password)
        // make sure that data has existed
        const findAdmin = await prisma.admin.findFirst({
            where: { adminId: Number(adminId) }
        })

        if (!findAdmin) {
            return response.status(400).json({
                status: false,
                message: `Admin data not found`
            })
        }

        const dataAdmin = await prisma.admin.update({
            where: { adminId: Number(adminId) },
            data: {
                name: name || findAdmin.name,
                email: email || findAdmin.email,
                password: password || findAdmin.password
            }
        })

        return response.status(200).json({
            status: true,
            message: `Data has been updated`,
            data: dataAdmin
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
// create a function to delete admin
const deleteAdmin = async (request: Request, response: Response) => {
    try {

        // get admin id from url 
        const adminId = request.params.adminId

        // make sure that admin is exist 
        const findAdmins = await prisma.admin.findFirst({
            where: { adminId: Number(adminId) }
        })

        if (!findAdmins) {
            return response.status(400).json({
                status: false,
                message: `Data not found`
            })
        }

        // execute for delete admin
        const dataAdmin = await prisma.admin.delete({
            where: { adminId: Number(adminId) }
        })

        // return response 
        return response.status(200).json({
            status: true,
            message: `Admin data has been deleted `
        })

    } catch (error) {
        return response.status(500).json({
            status: false,
            message: error,
        });
    }
}
const login = async (request: Request, response: Response) => {
    try {
        const email = request.body.email
        const password = md5(request.body.password)
        const admin = await prisma.admin.findFirst(
            {
                where: { email: email, password: password }
            }
        )
        if (admin) {
            const payload = admin
            const secretkey = 'yummy😋😋'
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
export { createAdmin, readAdmin, updateAdmin, deleteAdmin, login };
