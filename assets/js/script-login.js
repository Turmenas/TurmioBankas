document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");
    const pinInput = document.getElementById("pin-input");
    const loginError = document.getElementById("login-error");

    const correctPin = "1234"; // Example PIN

    loginButton.addEventListener("click", () => {
        const enteredPin = pinInput.value;
        if (enteredPin === correctPin) {
            if (!localStorage.getItem("accountBalance")) {
                localStorage.setItem("accountBalance", "2380");
                localStorage.setItem("savingsBalance", "795");
            }

            window.location.href = "menu.html";
        } else {
            loginError.textContent = "Invalid PIN. Please try again.";
        }
    });
});
