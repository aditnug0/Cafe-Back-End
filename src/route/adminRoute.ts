import express from "express";
import { verifyAdmin } from "../middleware/verify";
import { verifyAddAU, verifyAuthentication, verifyEditAU } from "../middleware/verifytoken";
import { createAdmin, deleteAdmin, loginAdmin, readAdmin, updateAdmin } from "../controller/adminController";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/admin`, verifyAdmin, readAdmin);

// adress for add new admin
app.post(`/admin`, verifyAdmin, verifyAddAU, createAdmin);

app.put(`/admin/:adminId`, verifyAdmin, verifyEditAU, updateAdmin);

app.delete(`/admin/:adminId`, verifyAdmin, deleteAdmin);

app.post(`/admin/login`, verifyAuthentication, loginAdmin);


export default app;
