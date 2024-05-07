import { PrismaClient } from "@prisma/client";
import { Request, Response, request, response } from "express";
import md5 from "md5"
import { sign } from "jsonwebtoken";
import { Sign } from "crypto";

// create an object from prisma
const prisma = new PrismaClient();

// create a function to "create" new admin
// asyncronous = fungsi yang berjalan secara pararel
const createOrder = async (request: Request, response: Response) => {
    try {
        const { customer_name, table_number, order_date, order_detail } = request.body;

        // Create order list with associated order details
        const newOrderList = await prisma.order_list.create({
            data: {
                customer_name,
                table_number,
                order_date,
                // : new Date(order_date).toISOString(),
                order_detail: {
                    createMany: {
                        data: order_detail.map((detail: any) => ({
                            orderId: detail.order_id,
                            food_id: detail.food_id,
                            quantity: detail.quantity,
                            price: detail.price
                        }))
                    }
                }
            }
        });

        return response.status(201).json({
            status: true,
            data: newOrderList,
            message: 'Order list created successfully'
        });
    } catch (error) {
        console.error('Error creating order list:', error);
        return response.status(500).json({
            status: false,
            message: '[POST ORDERLIST] Internal server error'
        });
    }
};


// create a function to READ admin
const readOrder = async (request: Request, response: Response) => {

    try {

        const orderList = await prisma.order_list.findMany({
            include: {
                order_detail: {
                    include: {
                        food_detail: true
                    }
                }
            }
        })

        if (orderList.length === 0) {
            return response.status(404).json({
                status: false,
                message: 'Order list not found'
            });
        }

        return response.status(200).json({
            status: true,
            data: orderList,
            message: 'Order list found'
        });
    } catch (error) {
        console.error('Error getting order list:', error);
        return response.status(500).json({
            status: false,
            message: '[GET ORDERLIST ID] Internal server error'
        });
    }
};


// baru
// function for update admin
const updateOrder = async (request: Request, response: Response) => {

    try {
        const { list_id } = request.params;
        const { customer_name, table_number, order_date, order_detail } = request.body;

        if (!list_id) {
            return response.status(400).json({
                status: false,
                message: "ID required"
            });
        }

        // Check if the order exists
        const findOrder = await prisma.order_list.findFirst({
            where: {
                list_id: Number(list_id)
            }
        });

        if (!findOrder) {
            return response.status(404).json({
                status: false,
                message: 'Order not found'
            });
        }

        // Update the order
        const updatedOrder = await prisma.order_list.update({
            where: { list_id: Number(list_id) },
            data: {
                customer_name: customer_name || findOrder.customer_name,
                table_number: table_number || findOrder.table_number,
                order_date: order_date || findOrder.order_date,
                order_detail: {
                    updateMany: order_detail.map((detail: any) => ({
                        where: {
                            list_id: detail.list_id
                        }, // Provide the ID of the order detail to update
                        data: {
                            foodId: detail.food_id,
                            quantity: detail.quantity,
                            price: detail.price
                        }
                    }))
                }
            },
        });

        return response.status(200).json({
            status: true,
            data: updatedOrder,
            message: 'Order has been updated'
        });
    } catch (error) {
        console.error('Error updating order list:', error);
        return response.status(500).json({
            status: false,
            message: '[PUT ORDERLIST] Internal server error'
        });
    }
}
// create a function to delete admin
const deleteOrder = async (request: Request, response: Response) => {

    try {
        const { list_id } = request.params;

        if (!list_id) {
            return response.status(400).json({
                status: false,
                message: "ID required"
            });
        }

        const deletedOrderList = await prisma.order_list.delete({
            where: {
                list_id: parseInt(list_id)
            }
        });

        return response.status(200).json({
            status: true,
            deletedOrderList,
            message: 'Order list deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order list:', error);
        return response.status(500).json({
            status: false,
            message: '[DELETE ORDERLIST] Internal server error'
        });
    }
}
export { createOrder, readOrder, updateOrder, deleteOrder };


// export const getOrderListById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;

//         const orderList = await prisma.order_list.findUnique({
//             where: {
//                 id: parseInt(id)
//             },
//             include: {
//                 order_detail: {
//                     include: {
//                         foodId: true
//                     }
//                 }
//             }
//         });

//         if (!orderList) {
//             return res.status(404).json({
//                 status: false,
//                 message: 'Order list not found'
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             data: orderList,
//             message: 'Order list found'
//         });
//     } catch (error) {
//         console.error('Error getting order list:', error);
//         return res.status(500).json({
//             status: false,
//             message: '[GET ORDERLIST] Internal server error'
//         });
//     }
// };
