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
exports.deleteOrder = exports.updateOrder = exports.readOrder = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
// create an object from prisma
const prisma = new client_1.PrismaClient();
// create a function to "create" new admin
// asyncronous = fungsi yang berjalan secara pararel
const createOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     // read a request from body
    //     const customer_name = request.body.customer_name;
    //     const table_number = request.body.table_number;
    //     const order_date = request.body.order_date
    //     //insert to admin table using prisma
    //     const newData = await prisma.order_list.create({
    //         data: {
    //             customer_name: customer_name,
    //             table_number: table_number,
    //             order_date: order_date
    //         }
    //     });
    //     return response.status(200).json({
    //         status: true,
    //         message: `Order data has been created`,
    //         data: newData,
    //     });
    // } catch (error) {
    //     return response.status(500).json({
    //         status: false,
    //         message: error,
    //     });
    // }
    try {
        const { customer_name, table_number, order_date, order_detail } = request.body;
        // Create order list with associated order details
        const newOrderList = yield prisma.order_list.create({
            data: {
                customer_name,
                table_number,
                order_date,
                // : new Date(order_date).toISOString(),
                order_detail: {
                    createMany: {
                        data: order_detail.map((detail) => ({
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
    }
    catch (error) {
        console.error('Error creating order list:', error);
        return response.status(500).json({
            status: false,
            message: '[POST ORDERLIST] Internal server error'
        });
    }
});
exports.createOrder = createOrder;
// create a function to READ admin
const readOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     // pagination
    //     const page = Number(request.query.page) || 1;
    //     const qty = Number(request.query.qty) || 5;
    //     // searching
    //     const keyword = request.query.keyword?.toString() || "";
    //     // await untuk memebri delay pada sistem asyncronous sehingga berjalan
    //     // seperti syncronous dan menunggu sistem sebelumnya
    //     const orderData = await prisma.order_list.findMany({
    //         //untuk mendefinisikan jml data yang diambil
    //         take: qty,
    //         skip: (page - 1) * qty,
    //         where: {
    //             OR: [
    //                 { customer_name: { contains: keyword } },
    //             ]
    //         },
    //         orderBy: { list_id: "asc" }
    //     });
    //     return response.status(200).json({
    //         status: true,
    //         message: `Order data has been loaded`,
    //         data: orderData,
    //     });
    // } catch (error) {
    //     return response.status(500).json({
    //         status: false,
    //         message: error,
    //     });
    // }
    try {
        const orderList = yield prisma.order_list.findMany({
            include: {
                order_detail: {
                    include: {
                        food_detail: true
                    }
                }
            }
        });
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
    }
    catch (error) {
        console.error('Error getting order list:', error);
        return response.status(500).json({
            status: false,
            message: '[GET ORDERLIST ID] Internal server error'
        });
    }
});
exports.readOrder = readOrder;
// baru
// function for update admin
const updateOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     // read admin id that sent from url
    //     const list_id = request.params.list_id
    //     // read data perubahan
    //     const customer_name = request.body.customer_name
    //     const table_number = request.body.table_number
    //     const order_date = request.body.order_date
    //     // make sure that data has existed
    //     const findOrder = await prisma.order_list.findFirst({
    //         where: { list_id: Number(list_id) }
    //     })
    //     if (!findOrder) {
    //         return response.status(400).json({
    //             status: false,
    //             message: `Order data not found`
    //         })
    //     }
    //     const dataOrder = await prisma.order_list.update({
    //         where: { list_id: Number(list_id) },
    //         data: {
    //             customer_name: customer_name || findOrder.customer_name,
    //             table_number: table_number || findOrder.table_number,
    //             order_date: order_date || findOrder.order_date
    //         }
    //     })
    //     return response.status(200).json({
    //         status: true,
    //         message: `Data has been updated`,
    //         data: dataOrder
    //     })
    // } catch (error) {
    //     return response.status(500).json({
    //         status: false,
    //         message: error,
    //     });
    // }
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
        const findOrder = yield prisma.order_list.findFirst({
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
        const updatedOrder = yield prisma.order_list.update({
            where: { list_id: Number(list_id) },
            data: {
                customer_name: customer_name || findOrder.customer_name,
                table_number: table_number || findOrder.table_number,
                order_date: order_date || findOrder.order_date,
                order_detail: {
                    updateMany: order_detail.map((detail) => ({
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
    }
    catch (error) {
        console.error('Error updating order list:', error);
        return response.status(500).json({
            status: false,
            message: '[PUT ORDERLIST] Internal server error'
        });
    }
});
exports.updateOrder = updateOrder;
// create a function to delete admin
const deleteOrder = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     // get admin id from url 
    //     const list_id = request.params.list_id
    //     // make sure that admin is exist 
    //     const findOrders = await prisma.order_list.findFirst({
    //         where: { list_id: Number(list_id) }
    //     })
    //     if (!findOrders) {
    //         return response.status(400).json({
    //             status: false,
    //             message: `Data not found`
    //         })
    //     }
    //     // execute for delete admin
    //     const dataOrder = await prisma.order_list.delete({
    //         where: { list_id: Number(list_id) }
    //     })
    //     // return response 
    //     return response.status(200).json({
    //         status: true,
    //         message: `Order data has been deleted `
    //     })
    // } catch (error) {
    //     return response.status(500).json({
    //         status: false,
    //         message: error,
    //     });
    // }
    try {
        const { list_id } = request.params;
        if (!list_id) {
            return response.status(400).json({
                status: false,
                message: "ID required"
            });
        }
        const deletedOrderList = yield prisma.order_list.delete({
            where: {
                list_id: parseInt(list_id)
            }
        });
        return response.status(200).json({
            status: true,
            deletedOrderList,
            message: 'Order list deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting order list:', error);
        return response.status(500).json({
            status: false,
            message: '[DELETE ORDERLIST] Internal server error'
        });
    }
});
exports.deleteOrder = deleteOrder;
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
