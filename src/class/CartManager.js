import fs from "fs";

export default class CartManager{
    constructor(path){
        this.path = path
    }

    static id = 0;
    static carts = [];

    initialize = async () => {
        try {
            const readFile = await fs.promises.readFile(this.path, "utf-8");
            CartManager.carts = JSON.parse(readFile);
            console.log("Carrito recuperado");
        } catch (error) {
            console.log(error)
        }
    };

    generateId = () => {
        if(CartManager.carts.length !== 0){ 
            const lastCart = CartManager.carts[CartManager.carts.length -1];
            let lastCartId = lastCart.id;

            return ++lastCartId
        } else {
            return ++CartManager.id
        }
    };

    addCart = async (products) => {
        await this.initialize();
        const cart = {
            id: this.generateId(),
            products
        }

        const findCart = CartManager.carts.find((c) => c.id === cart.id);

        if(findCart === undefined){
            CartManager.carts.push(cart)

            await fs.promises.writeFile(this.path, JSON.stringify(CartManager.carts))
        }else{
            console.log("Error al cargar el carrito. ID REPETIDO")
        }

        return cart;
    };

    listProductsCart = async (id) => {
        await this.initialize()

        const findCart = CartManager.carts.find((cart) => cart.id === id);

        return findCart.products;
    }

    addProductToArrayProducts = async (cid, pid, qty) => {
        await this.initialize();

        const findCart = CartManager.carts.find((c) => c.id === parseFloat(cid))

        const product = {
            id: pid,
            quantity: qty
        };

        if(findCart.products.length === 0){
            findCart.products.push(product);
        }else {
            const findProductId = findCart.products.find((p) => p.id === pid);
            if(findProductId !== undefined){
                const qtyTotal = findProductId.quantity + product.quantity;
                findProductId.quantity = qtyTotal
            }else {
                findCart.products.push(product);
            }
        };

        await fs.promises.writeFile(this.path, JSON.stringify(CartManager.carts))
    };
}

//const cartManager = new CartManager("./src/data/cart.json");
//cartManager.listProductsCart(3)