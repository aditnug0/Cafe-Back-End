import express from "express";
import { verifyAdmin } from "../middleware/verify";
import uploadFile from "../middleware/uploadFile";
import { createFood, deleteFood, readFood, updateFood } from "../controller/foodController";
import { verifyAddFood, verifyEditFood } from "../middleware/verifyaddFood";
const app = express();

// allow to read json from the body
app.use(express.json());

// adress for get admin data
app.get(`/food`, readFood);

// adress for add new admin
app.post(`/food`, [uploadFile.single("image"), verifyAdmin, verifyAddFood], createFood);

app.put(`/food/:item_id`, [uploadFile.single("image"), verifyAdmin, verifyAddFood], updateFood);

app.delete(`/food/:item_id`, verifyAdmin, deleteFood);
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