import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = parseInt(req.query.sort)|| 1;
        const query = req.query.query;

        if(!query){
            const filterProducts = await Product.paginate({}, {limit: limit, page: page, sort: {"price.monetaryValue": sort}, lean: true});
            
            res.render("home", {filterProducts});
        } else {
            const filterProducts = await Product.paginate({category: query}, {limit: limit, page: page, sort: {"price.monetaryValue": sort}, lean: true});

            res.render("home", {filterProducts, query, limit, page, sort});
        };
    } catch (error) {
        res.status(500).send({message: error.message});
    }
})

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const products = await Product.paginate({}, {limit: 12, page: page, lean: true});

        res.render("realTimeProducts", {products, page});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});

viewsRouter.get("/register", async (req, res) => {
    try {
        res.render("registerUser")
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});

viewsRouter.get("/validate", async (req, res) => {
    try {
        res.render("validateUser")
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    try {
        const {cid} = req.params;
        const viewCart = await Cart.findById(cid).populate("products.product").lean();

        const {_id, cartName, products} = viewCart;

        res.render("cart", {products});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});
viewsRouter.get("/product/:pid", async (req, res) => {
    try {
        const {pid} = req.params;

        const findProduct = await Product.findById(pid).lean();

        console.log(findProduct)

        res.render("products", {findProduct});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
});


export default viewsRouter;