const validateUserForm = document.getElementById("validateUserForm");
const createUserButton = document.getElementById("createUserButton");

validateUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(validateUserForm);
    const validateUserData = {};

    data.forEach((value, key) => {
        validateUserData[key] = value;
    });

    const response = await fetch("./api/users/validate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(validateUserData)
    });

    const dataResponse = await response.json();

    if(dataResponse.payload === false){
        validateError();
        setTimeout(() => {
            validateUserForm.reset();
        }, 2000);
    }else if (dataResponse.payload === true){
        validateSuccess();
        setTimeout(() => {
            validateUserForm.reset();
            window.location.href = "/realtimeproducts";
        }, 2000)
    }

});

createUserButton.addEventListener("click", async (e) => {
    window.location.href = "/register";
});

const validateError = () => {
    Swal.fire({
        icon: "error",
        title: "Usuario no encontrado",
        text: "Los datos ingresados son incorrectos o inexistentes",
        timer: 2000
    });
};

const validateSuccess = () => {
    Swal.fire({
        icon: "success",
        title: "Usuario validado",
        text: "Validacion aprobada",
        timer: 2000
    });
};