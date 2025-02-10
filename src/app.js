import express from "express";
import productsRouter from "./routes/product-router.js";
import cartRouter from "./routes/cart-router.js";
import handlebars from "express-handlebars";
//import __dirname from "./utils/dirname.js";
import viewsrouter from "./routes/views-router.js"
import http from "http";
import {Server} from "socket.io";
import { ProductManager } from "./class/ProductManager.js";

const app = express();
const PORT = 8080;

const server = http.createServer(app);
const io = new Server (server);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, "../public")))

//Routers
app.use("/", viewsrouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const productManager = new ProductManager("./src/data/products.json");
const allProducts = await productManager.getProduct()

io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.emit("allProducts", JSON.parse(allProducts))

    socket.on("addProducts", async ({title, description, price, stock, category}) => {
        try {
            await productManager.addProduct(title, description, price, stock, category);

            const updatedList = JSON.parse(await productManager.getProduct());

            io.emit("addedProduct", updatedList);
        } catch (error) {
            console.log("Error al añadir el nuevo producto");
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            await productManager.deleteProduct(id);
            const newData = JSON.parse(await productManager.getProduct());
            io.emit("confirmDeleted", newData);
        } catch (error) {
            console.log("Error al eliminar el producto");
        }
    })
});

server.listen(PORT, (req, res) => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});