import express from "express";
import { verifyAdmin } from "../middleware/verify";
import { verifyAuthentication } from "../middleware/verifytoken";
import { createAdmin, deleteAdmin, login, readAdmin, updateAdmin } from "../controller/adminController";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/admin`, verifyAdmin, readAdmin);

// adress for add new admin
app.post(`/admin`, verifyAdmin, createAdmin);

app.put(`/admin/:adminId`, verifyAdmin, updateAdmin);

app.delete(`/admin/:adminId`, verifyAdmin, deleteAdmin);

app.post(`/admin/login`, verifyAuthentication, login);


export default app;
