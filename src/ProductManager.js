import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export class ProductManager{
    constructor(path){
        this.path = path;
    };

    static id = 0;
    static products = [];

    generateId = () => {
        if(ProductManager.products.length !== 0){ 
            const lastProduct = ProductManager.products[ProductManager.products.length -1];
            let lastProductId = lastProduct.id;
            
            return ++lastProductId
        } else {
            return ++ProductManager.id
        }
    };

    initialize = async () => {
        try{
            const readFile = await fs.promises.readFile(this.path, "utf-8");

            ProductManager.products = JSON.parse(readFile);

            console.log("Initialize ejecutado");
        }catch(err){
            console.log("Error en la lectura del archivo")
        };
    };

    addProduct = async (title, description, price, stock, category) => {
        await this.initialize();

        const createdProduct = {
            id: this.generateId(),
            title,
            description,
            code: uuidv4(),
            price,
            stock,
            category,
            status: true
        };

        const findProduct = ProductManager.products.find((product) => product.code === createdProduct.code);

        if(findProduct === undefined){
            ProductManager.products.push(createdProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(ProductManager.products));
        }else {
            console.log("Error al cargar producto. CODIGO REPETIDO")
        }
        console.log(ProductManager.products)
    };

    getProduct = async () => {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return data;
    };

    getProductById = async(id) => {
        const readFile = await fs.promises.readFile(this.path, "utf-8");
        const jsonFile = JSON.parse(readFile);
        const findProduct = jsonFile.find((product) => product.id === parseInt(id));

        return findProduct;
    };

    setProduct = async (id, title, description, price, stock, category) => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");

            const jsonData = JSON.parse(data);

            const indexProduct = jsonData.findIndex((product) => product.id === parseFloat(id));

            if(indexProduct !== -1){
                jsonData[indexProduct] = {
                    id: jsonData[indexProduct].id,
                    title, 
                    description, 
                    code: jsonData[indexProduct].code,
                    price, 
                    stock, 
                    category,
                    status: jsonData[indexProduct].status
                };

                return await fs.promises.writeFile(this.path, (JSON.stringify(jsonData)));
            }
        } catch (error) {
            console.log(error);
        }
    };

    deleteProduct = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const jsonData = JSON.parse(data);

            const deleteProduct = jsonData.filter((product) => product.id !== parseFloat(id));

            console.log(deleteProduct)

            return await fs.promises.writeFile(this.path, JSON.stringify(deleteProduct))
        } catch (error) {
            console.log(error)
        }
    };
}
