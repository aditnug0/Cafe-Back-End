/*ini adalah file utama untuk menjalankan server backend */
/** import library express */
import express, { Request, Response } from "express";
import routeAdmin from "./route/adminRoute";
import routeTable from "./route/olRoute";// order list
import routeFood from "./route/foodRoute";
import routeTransaction from "./route/odRoute";

/**buat wadah inisiasi express */

const app = express();

/** mendefinisikan PORT berjalannya server */
const PORT = 12;

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
app.use(routeTable)
app.use(routeFood)
app.use(routeTransaction)



/**run server  */
app.listen(PORT, () => {
    console.log(`😋 Server running on port ${PORT}`);
});
// 🔰
