const socket = io();

//Enlaces al DOM
const formNewProduct = document.getElementById("formNewProduct");
const containerProducts = document.getElementById("containerProducts");

formNewProduct.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formNewProduct);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });

    const {type, title, description, monetaryValue, currency, stock, category} = productData;

    const product = {
        type,
        title,
        description,
        price: {monetaryValue: Number(monetaryValue), currency},
        stock, 
        category
    };

    const response = await fetch("/api/products",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    console.log(response)

    socket.emit("addProducts", product);

    formNewProduct.reset();
});

const addEventDeleted = () => {
    document.querySelectorAll(".deleteButton").forEach( (button) => {
        button.addEventListener("click", (e) => {
    
            const id = e.target.dataset.id;
            console.log("ID capturado: " + id)
    
            socket.emit("deleteProduct", id);
        })
    });
};

socket.on("allProducts", (data) => {
    console.log(data)
    containerProducts.innerHTML = ``;

    data.forEach( (product) => {
        containerProducts.innerHTML += `<div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">${product.title}</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">${product.category}</h6>
                                                <p class="card-text">${product.description}</p>
                                                <button data-id= ${product._id}  class="deleteButton">Eliminar producto</button>
                                            </div>
                                        </div>`
        });
    addEventDeleted();
})

socket.on("addedProduct", (newProduct) => {

    containerProducts.innerHTML = ``;

    newProduct.forEach( (product) => {
        containerProducts.innerHTML += `<div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">${product.title}</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">${product.category}</h6>
                                                <p class="card-text">${product.description}</p>
                                                <button data-id= ${product._id}  class="deleteButton">Eliminar producto</button>
                                            </div>
                                        </div>`
        });
    addEventDeleted();
})

socket.on("confirmDeleted", (newData) => {
    containerProducts.innerHTML = ``;

    newData.forEach( (product) => {
        containerProducts.innerHTML += `<div class="card">
                                            <div class="card-body">
                                                <h5 class="card-title">${product.title}</h5>
                                                <h6 class="card-subtitle mb-2 text-body-secondary">${product.category}</h6>
                                                <p class="card-text">${product.description}</p>
                                                <button data-id= ${product.id}  class="deleteButton">Eliminar producto</button>
                                            </div>
                                        </div>`
        });
    addEventDeleted();
});