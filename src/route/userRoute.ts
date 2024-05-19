import express from "express";
import { verifyUser } from "../middleware/verify";
import { verifyAddAU, verifyAuthentication, verifyEditAU } from "../middleware/verifytoken";
import { createUser, deleteUser, loginUser, readUser, updateUser } from "../controller/userController";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/user`, verifyUser, readUser);

// adress for add new admin
app.post(`/user`, verifyAddAU, createUser);

app.put(`/user/:userId`, verifyUser, verifyEditAU, updateUser);

app.delete(`/user/:userId`, verifyUser, deleteUser);

app.post(`/user/login`, verifyAuthentication, loginUser);


export default app;
