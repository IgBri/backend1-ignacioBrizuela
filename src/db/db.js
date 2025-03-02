import mongoose from "mongoose";
import Cart from "../models/cart.model.js";

const createCart = async () => {
    try {
        const newCart = await new Cart();
        await newCart.save();

        console.log(newCart)
    } catch (error) {
        console.log(error)
    }
};


const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        //await createCart();

        console.log("Conexion a MongoDB exitosa")
    } catch (error) {
        console.error("Error en la conexion a MongoDB", error)
    }
};

export default connectMongoDB;