"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*ini adalah file utama untuk menjalankan server backend */
/** import library express */
const express_1 = __importDefault(require("express"));
const adminRoute_1 = __importDefault(require("./route/adminRoute"));
const olRoute_1 = __importDefault(require("./route/olRoute")); // order list
const foodRoute_1 = __importDefault(require("./route/foodRoute"));
const odRoute_1 = __importDefault(require("./route/odRoute"));
/**buat wadah inisiasi express */
const app = (0, express_1.default)();
/** mendefinisikan PORT berjalannya server */
const PORT = 12;
/**test*/
app.get(`/see`, (request, response) => {
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
app.use(adminRoute_1.default);
app.use(olRoute_1.default);
app.use(foodRoute_1.default);
app.use(odRoute_1.default);
/**run server  */
app.listen(PORT, () => {
    console.log(`😋 Server running on port ${PORT}`);
});
// 🔰
