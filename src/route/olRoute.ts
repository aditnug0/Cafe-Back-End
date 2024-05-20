import express from "express";
import { verifyAdmin, verifyUser } from "../middleware/verify";
import { createOrder, deleteOrder, readOrder, updateOrder } from "../controller/olController";
import { verifyAddOrder, verifyEditOrder } from "../middleware/verifyOrder";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/table`, verifyAdmin, readOrder);

// adress for add new admin
app.post(`/table`, verifyUser, verifyAddOrder, createOrder);

app.put(`/table/:list_id`, verifyAdmin, verifyEditOrder, updateOrder);

app.delete(`/table/:list_id`, verifyAdmin, deleteOrder);


export default app;
