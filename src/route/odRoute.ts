import express from "express";
import { verifyAdmin } from "../middleware/verify";
import { createTransaction, deleteTransaction, readTransaction, updateTransaction } from "../controller/odController";
import { verifyAddOrder, verifyEditOrder } from "../middleware/verifyOrder";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/transaction`, verifyAdmin, readTransaction);

// adress for add new admin
app.post(`/transaction`, verifyAdmin, verifyAddOrder, createTransaction);

app.put(`/transaction/:detail_id`, verifyAdmin, verifyEditOrder, updateTransaction);

app.delete(`/transaction/:detail_id`, verifyAdmin, deleteTransaction);


export default app;
