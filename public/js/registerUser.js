const formUser = document.getElementById("formUser");

formUser.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(formUser);
    const userData = {};

    data.forEach((value, key) => {
        userData[key] = value;
    });

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userData)
        })

        const data = await response.json();

        if(response.ok){
            Swal.fire({
                title: "Usuario creado correctamente",
                text: `Usuario ${data.payload.userName} creado`,
                icon: "success"
            });
            setTimeout(() => {
                window.location.href = "/"
            }, 1500)
        }
    
        formUser.reset();
    } catch (error) {
        console.error(error)
    }
});