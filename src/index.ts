/*ini adalah file utama untuk menjalankan server backend */
/** import library express */
import express, { Request, Response } from "express";
import routeAdmin from "./route/adminRoute";
import routeUser from "./route/userRoute"
import routeTransaction from "./route/olRoute";// order list
import routeProduct from "./route/productRoute";

/**buat wadah inisiasi express */

const app = express();

/** mendefinisikan PORT berjalannya server */
const PORT = 69;

/**test*/
app.get(`/see`, (request: Request, response: Response) => {
    /**ini adalah proses handle request dengan url adress
     * url adress :https//localhost:12/see
     * method get
     */

    //memberi respon
    return response.status(200).json({
        message: `Hello  `,
    });
});

// register route of event
app.use(routeAdmin)
app.use(routeUser)
app.use(routeTransaction)
app.use(routeProduct)


/**run server  */
app.listen(PORT, () => {
    console.log(`😋 Server running on port ${PORT}`);
});
// 🔰
