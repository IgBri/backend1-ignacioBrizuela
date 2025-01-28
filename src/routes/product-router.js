import express from "express";
import { ProductManager } from "../ProductManager.js";


const productsRouter = express.Router();
const productManager = new ProductManager ("./src/data/products.json");

productsRouter.post("/", async (req, res) => {
    const {title, description, price, stock, category} = req.body;

    if(!title || !description || !price || !stock || !category){
        res.status(400).send({message: "Error al cargar datos. Debe haber algun campo vacio."})
    } else {
        const newProduct = await productManager.addProduct(title, description, price, stock, category);

        res.status(200).send(newProduct)
    };
});

productsRouter.get("/", async (req, res) => {
    await productManager.initialize();
    try {
        const data = await productManager.getProduct();
        res.status(200).send(JSON.parse(data))
    } catch (error) {
        
    }
});

productsRouter.get("/:pid", async (req, res) => {
    const {pid} = req.params;

    try {
        const getProductById = await productManager.getProductById(pid);
        console.log(getProductById)
        res.status(200).send(getProductById);
    } catch (error) {
        console.log("Error en la lectura")
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const {pid} = req.params;
    const {title, description, price, stock, category} = req.body
    try {
        const editProducts = await productManager.setProduct(pid, title, description, price, stock, category);

        res.status(200).send(editProducts);
    } catch (error) {
        console.log(error);
    }
})

productsRouter.delete("/:pid", async (req, res) => {
    const {pid} = req.params;
    try {
        const eliminatedProduct = await productManager.deleteProduct(pid);

        res.status(200).send(eliminatedProduct);
    } catch (error) {
        console.log(error)
    }
})

export default productsRouter;