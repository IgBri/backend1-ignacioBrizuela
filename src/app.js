import express from "express";
import productsRouter from "./routes/product-router.js";
import cartRouter from "./routes/cart-router.js";
import viewsrouter from "./routes/views-router.js"
import userRouter from "./routes/user-router.js";
import handlebars from "express-handlebars";
//import __dirname from "./utils/dirname.js";
import http from "http";
import {Server} from "socket.io";
import dotenv from "dotenv"
import connectMongoDB from "./db/db.js";

import Product from "./models/product.model.js";

const app = express();
const PORT = 8080;

dotenv.config();

const server = http.createServer(app);
const io = new Server (server);

connectMongoDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
//app.use(express.static(path.join(__dirname, "../public")))

//Routers
app.use("/", viewsrouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);

//handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("addProducts", async ({type, title, description, price, stock, category}) => {
        try {
            await Product.insertOne({type, title, description, price, stock, category});

            const updatedList = await Product.find().lean();

            console.log("Lista actualizada", updatedList)

            io.emit("addedProduct", updatedList);
        } catch (error) {
            console.log("Error al añadir el nuevo producto");
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            await Product.findByIdAndDelete(id);
            const newData = await Product.find().lean();
            io.emit("confirmDeleted", newData);
        } catch (error) {
            console.log("Error al eliminar el producto");
        }
    })
});

server.listen(PORT, (req, res) => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});