import express from "express";
import { ProductManager } from "../class/ProductManager.js";

const viewsRouter = express.Router();
const pathFile = "./src/data/products.json";
const productsManager = new ProductManager(pathFile)

viewsRouter.get("/", async (req, res) => {
    try {
        const products = await productsManager.getProduct()
        const jsonProducts = JSON.parse(products);
        console.log(jsonProducts)
        res.render("home", {jsonProducts});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        /*const products = await productsManager.getProduct()
        const jsonProducts = JSON.parse(products);
        console.log(jsonProducts)*/
        res.render("realTimeProducts")
    } catch (error) {
        res.status(500).send({message: error.message});
    }
    //La data se pasa por los sockets
});


export default viewsRouter;