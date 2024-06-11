import { PrismaClient } from "@prisma/client";
import { Request, Response, request, response } from "express";

// create an object from prisma
const prisma = new PrismaClient();

const createOrder = async (request: Request, response: Response) => {
    try {
        const { cust_id, order_date, order_detail } = request.body;

        // Fetch product prices and quantities for each order detail
        const productIds = order_detail.map((detail: any) => detail.product_id);
        const products = await prisma.product.findMany({
            where: {
                item_id: { in: productIds }
            },
            select: {
                item_id: true,
                price: true,
                qty: true
            }
        });

        // Create a map of product prices and quantities
        const productMap: { [key: number]: { price: number, qty: number } } = {};
        products.forEach(product => {
            productMap[product.item_id] = { price: product.price, qty: product.qty };
        });

        // Prepare order details with calculated prices and check for sufficient stock
        const orderDetails = order_detail.map((detail: any) => {
            const product = productMap[detail.product_id];
            if (product.qty < detail.quantity) {
                throw new Error(`Insufficient stock for product ID: ${detail.product_id}`);
            }
            return {
                order_id: detail.order_id,
                product_id: detail.product_id,
                quantity: detail.quantity,
                price: detail.quantity * product.price
            };
        });

        // Create order list with associated order details
        const newOrderList = await prisma.order_list.create({
            data: {
                cust_id,
                order_date,
                order_detail: {
                    createMany: {
                        data: orderDetails
                    }
                }
            }
        });

        // Update product quantities
        await Promise.all(order_detail.map(async (detail: any) => {
            await prisma.product.update({
                where: { item_id: detail.product_id },
                data: { qty: { decrement: detail.quantity } }
            });
        }));

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
                cust_detail: true,
                order_detail: {
                    include: {
                        product_detail: true
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


const updateOrder = async (request: Request, response: Response) => {
    try {
        const { list_id } = request.params;
        const { cust_id, order_date, order_detail } = request.body;

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

        // Fetch product prices and quantities for each order detail
        const productIds = order_detail.map((detail: any) => detail.product_id);
        const products = await prisma.product.findMany({
            where: {
                item_id: { in: productIds }
            },
            select: {
                item_id: true,
                price: true,
                qty: true
            }
        });

        // Create a map of product prices and quantities
        const productMap: { [key: number]: { price: number, qty: number } } = {};
        products.forEach(product => {
            productMap[product.item_id] = { price: product.price, qty: product.qty };
        });

        // Prepare order details with calculated prices and check for sufficient stock
        const orderDetails = order_detail.map((detail: any) => {
            const product = productMap[detail.product_id];
            if (product.qty < detail.quantity) {
                throw new Error(`Insufficient stock for product ID: ${detail.product_id}`);
            }
            return {
                order_id: detail.order_id,
                product_id: detail.product_id,
                quantity: detail.quantity,
                price: detail.quantity * product.price
            };
        });

        // Update the order
        const updatedOrder = await prisma.order_list.update({
            where: { list_id: Number(list_id) },
            data: {
                cust_id: cust_id || findOrder.cust_id,
                order_date: order_date || findOrder.order_date,
                order_detail: {
                    updateMany: orderDetails.map((detail: any) => ({
                        where: {
                            detail_id: detail.detail_id
                        }, // Provide the ID of the order detail to update
                        data: {
                            product_id: detail.product_id,
                            quantity: detail.quantity,
                            price: detail.price
                        }
                    }))
                }
            },
        });

        // Update product quantities
        await Promise.all(order_detail.map(async (detail: any) => {
            await prisma.product.update({
                where: { item_id: detail.product_id },
                data: { qty: { decrement: detail.quantity } }
            });
        }));

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
};


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

