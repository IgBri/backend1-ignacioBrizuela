import express from "express";
import CartManager from "../CartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager("./src/data/cart.json");

cartRouter.post("/", async (req, res) => {
    const {products} = req.body;

    if(!products){
        res.status(400).send({message: "Error. No se han cargado productos al carrito"})
    }else {
        const newCart = await cartManager.addCart(products)
        res.status(200).send(newCart);
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const {qty} = req.body;

    const newProduct = await cartManager.addProductToArrayProducts(cid, pid, qty); 

    res.status(200).send(newProduct);
})

cartRouter.get("/:cid", async (req, res) => {
    const {cid} = req.params;
    try {
        const getListProducts = await cartManager.listProductsCart(parseFloat(cid))

        res.status(200).send(getListProducts);
    } catch (error) {
        console.log(error)
    }
})

export default cartRouter;