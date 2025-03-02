import express from "express";
import Product from "../models/product.model.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res) => {
    try {
        const {type, title, description, price, stock, category} = req.body;

        const newProduct = await Product.insertOne({type, title, description, price, stock, category});

        res.status(200).send({status: "success", payload: newProduct});
    } catch (error) {
        res.status(400).send(error.message)    
    };
});

productsRouter.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = parseInt(req.query.sort)|| 1;
        const query = req.query.query;
        
        const products = await Product.paginate({category: query}, {limit, page: page, sort: {"price monetaryValue": sort}, lean: true});
        
        res.status(200).send({status: "success", payload: products});
    } catch (error) {
        res.status(500).send({status: "error", payload: error.message});
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const {pid} = req.params;
        const getProductById = await Product.findById(pid);
    
        res.status(200).send(getProductById);

    } catch (error) {
        res.status(500).send({status: "error", payload: error.message});  
    }
});

productsRouter.delete("/delete/:pid", async (req, res) => {
    try {
        const {pid} = req.params;
        const eliminatedProduct = await Product.findByIdAndDelete(pid);
        
        res.status(200).send({eliminatedProduct});
    } catch (error) {
        res.status(400).send(error.message)    
    }
})

export default productsRouter;