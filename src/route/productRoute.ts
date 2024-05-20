import express from "express";
import { verifyAdmin } from "../middleware/verify";
import uploadFile from "../middleware/uploadFile";
import { createProduct, deleteProduct, readProduct, updateProduct, } from "../controller/productController";
import { verifyAddProduct, verifyEditProduct } from "../middleware/verifyProduct";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/product`, readProduct);

// adress for add new admin
app.post(`/product`, [uploadFile.single("image"), verifyAdmin, verifyAddProduct], createProduct);

app.put(`/product/:item_id`, [uploadFile.single("image"), verifyAdmin, verifyEditProduct], updateProduct);

app.delete(`/product/:item_id`, verifyAdmin, deleteProduct);
// import express from "express"
// import { verifyToken } from "../middlewares/authorization"
// import { createEgg, dropEgg, getAllEggs, updateEgg } from "../controllers/eggController"
// import uploadFile from "../middlewares/uploadFile"
// import { verifyAddEgg, verifyEditEgg } from "../middlewares/verifyEgg"
// const app = express()

// app.use(express.json())
// /** add middleware process to verify token */
// app.get(`/`, [verifyToken], getAllEggs)

// /** add middleware process to varify token, upload an image, and verify request data */
// app.post(`/`, [verifyToken, uploadFile.single("image"), verifyAddEgg], createEgg)

// /** add middleware process to varify token, upload an image, and verify request data */
// app.put(`/:id`, [verifyToken, uploadFile.single("image"), verifyEditEgg], updateEgg)

// /** add middleware process to verify token */
// app.delete(`/:id`, [verifyToken], dropEgg)
export default app