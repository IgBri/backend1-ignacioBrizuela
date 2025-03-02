import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    cartName: {type: String},
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
            }
        ],
        default: []
    }
});

cartSchema.pre("find", function(next){
    this.populate("products.product");
    next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;