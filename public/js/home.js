const addToCart = document.querySelectorAll(".addToCart");
const viewProduct = document.querySelectorAll(".viewProduct");
const getIntoEcommerce = document.getElementById("getIntoEcommerce");

getIntoEcommerce.addEventListener("click", async (e) => {
    window.location.href = "/validate"
});


addToCart.forEach((button) => {
    button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        
        try {
            const response = await fetch("/api/carts", {
                method: "POST",
            });
            if(response.ok){
                const data = await response.json();

                const pid = id;

                try {
                    const response = await fetch(`http://localhost:8080/api/carts/${data.payload._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({pid})
                    })

                    if(response.ok){
                        Swal.fire({
                            title: "Exito",
                            text: "Producto agregado con exito",
                            icon: "success"
                        });
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.log(error)
        };
    });
});

viewProduct.forEach((button) => {
    button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        console.log("boton funciona", id)

        try {
            const response = await fetch(`/product/${id}`, {
                method: "GET",
            });

            if(response.ok) window.location.href = `/product/${id}`;
        } catch (error) {
            console.log(error)
        }
    });
});