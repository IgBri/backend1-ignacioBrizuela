import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    type: {type: String, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {
        monetaryValue: {type: Number, required: true},
        currency: {type: String, required: true}
    },
    stock: {type: Number, required: true},
    category: {type: String, required: true}
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);

export default Product;