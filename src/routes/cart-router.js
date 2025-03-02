import express from "express";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
    try {
        const existCart = await Cart.find();
        if(existCart.length === 0){
            const createdCart = await Cart.insertOne({});

            res.status(200).send({status: "success", payload: createdCart});
        }else {
            res.status(200).send({status: "success", payload: existCart[0]});
        }
    } catch (error) {
        res.status(500).send({status: "error", message: error.message})
    }
})

cartRouter.get("/:cid", async (req, res) => {
    try {
        const {cid} = req.params;
        
        const oneCart = await Cart.findById(cid).populate("products.product");

        res.status(200).send({status: "success", payload: oneCart});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

cartRouter.put("/:cid", async (req, res) => {
    try {
        const {pid} = req.body;
        const {cid} = req.params;

        const productId = new mongoose.Types.ObjectId(pid);

        const addProductToCart = await Cart.findByIdAndUpdate(
            cid,
            {$push: {products: {product: productId}}},
            {new: true}
        );

        res.status(200).send({status: "success", payload: addProductToCart});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;

        const deleteOneProduct = await Cart.findByIdAndUpdate(
            cid,
            {$pull: {products: {product: pid}}},
            {new: true}
        );

        res.status(200).send({status: "success", payload: deleteOneProduct});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

cartRouter.get("/", async (req, res) => {
    try {
        const cart = await Cart.find();
        //POPULACION AUTOMATICA

        res.status(200).send({statu:"success", payload: cart});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message})
    }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;

        const cartId = new mongoose.Types.ObjectId(cid);
        const productId = new mongoose.Types.ObjectId(pid);

        const findCart = await Cart.aggregate([
            { $match: {_id: cartId} },
            { $unwind: "$products" },
            { $match: {"products.product": productId} },
            { $group: {_id: "$products.product", qty: {$sum: 1 }}}
        ]);

        res.status(200).send({status: "success", payload: findCart});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

cartRouter.delete("/:cid", async (req, res) => {
    try {
        const {cid} = req.params;
        const cleanCart = await Cart.findByIdAndUpdate(
            cid,
            {$set: {products: []}},
            {new: true}
        );

        res.status(200).send({status: "success", payload: cleanCart});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});


export default cartRouter;