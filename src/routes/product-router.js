import express from "express";
import { ProductManager } from "../class/ProductManager.js";


const productsRouter = express.Router();
const productManager = new ProductManager ("./src/data/products.json");


productsRouter.post("/", async (req, res) => {
    const {title, description, price, stock, category} = req.body;

    if(!title || !description || !price || !stock || !category){
        res.status(400).send({message: "Error al cargar datos. Debe haber algun campo vacio."})
    } else {
        const newProduct = await productManager.addProduct(title, description, price, stock, category);

        //console.log(newProduct)

        res.status(200).send(newProduct)
    };
});

productsRouter.get("/", async (req, res) => {
    try {
        await productManager.initialize();
        const data = await productManager.getProduct();
        const jsonData = JSON.parse(data);
        //console.log(jsonData)
        res.status(200).send(jsonData)
    } catch (error) {
        console.error("Error al conectar")
    }
});

productsRouter.get("/:pid", async (req, res) => {
    const {pid} = req.params;

    try {
        const getProductById = await productManager.getProductById(pid);
        const jsonGetProductById = JSON.parse(getProductById);
        //console.log(getProductById)
        res.status(200).send(jsonGetProductById);

    } catch (error) {
        console.log("Error en la lectura")
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const {title, description, price, stock, category} = req.body
    try {
        const editProducts = await productManager.setProduct(pid, title, description, price, stock, category);

        //res.status(200).send(editProducts);
        res.render("index", {editProducts})
    } catch (error) {
        console.log(error);
    }
})

productsRouter.delete("/delete/:pid", async (req, res) => {
    const {pid} = req.params;
    try {
        const eliminatedProduct = await productManager.deleteProduct(pid);
        console.log(eliminatedProduct)
        //res.status(200).send(eliminatedProduct);
        res.render("index", {eliminatedProduct})
    } catch (error) {
        console.log(error)
    }
})

export default productsRouter;