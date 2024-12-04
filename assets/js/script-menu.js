document.addEventListener("DOMContentLoaded", () => {
    const accountBalanceElement = document.getElementById("account-balance");
    const savingsBalanceElement = document.getElementById("savings-balance");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalInput = document.getElementById("modal-input");
    const modalConfirm = document.getElementById("modal-confirm");
    const modalCancel = document.getElementById("modal-cancel");
    const notification = document.getElementById("notification");

    // Retrieve balances and settings from localStorage
    let accountBalance = parseFloat(localStorage.getItem("accountBalance")) || 0;
    let savingsBalance = parseFloat(localStorage.getItem("savingsBalance")) || 0;
    let savingsPercentage = parseInt(localStorage.getItem("savingsPercentage")) || 0;

    // Update UI with current values
    function updateUI() {
        accountBalanceElement.textContent = `$${accountBalance.toFixed(2)}`;
        savingsBalanceElement.textContent = `$${savingsBalance.toFixed(2)}`;
        localStorage.setItem("accountBalance", accountBalance.toFixed(2));
        localStorage.setItem("savingsBalance", savingsBalance.toFixed(2));
        localStorage.setItem("savingsPercentage", savingsPercentage.toString());
    }
    updateUI();

    // Show notification message
    function showNotification(message, type = "success") {
        notification.textContent = message;

        // Change notification color based on type
        if (type === "success") {
            notification.style.background = "#4caf50"; // Green
        } else if (type === "error") {
            notification.style.background = "#f44336"; // Red
        }

        notification.classList.remove("hidden");
        setTimeout(() => {
            notification.classList.add("hidden");
        }, 3000); // Hide after 3 seconds
    }

    // Show modal for user actions
    function showModal(title, callback, placeholder = "Enter amount") {
        modalTitle.textContent = title;
        modalInput.value = "";
        modalInput.placeholder = placeholder;
        modal.classList.remove("hidden");

        modalConfirm.onclick = () => {
            const value = parseFloat(modalInput.value);
            if (isNaN(value) || value <= 0) {
                showNotification("Please enter a valid number.", "error");
            } else {
                callback(value);
                modal.classList.add("hidden");
            }
        };

        modalCancel.onclick = () => {
            modal.classList.add("hidden");
        };
    }

    // Deposit action
    document.querySelector('[data-action="deposit"]').addEventListener("click", () => {
        showModal("Deposit Money", (amount) => {
            const toSavings = (amount * savingsPercentage) / 100;
            const toAccount = amount - toSavings;

            savingsBalance += toSavings;
            accountBalance += toAccount;

            updateUI();
            showNotification(
                `Deposited $${amount.toFixed(2)}. ` +
                `$${toSavings.toFixed(2)} to Savings, ` +
                `$${toAccount.toFixed(2)} to Account.`
            );
        });
    });

    // Withdraw action
    document.querySelector('[data-action="get-cash"]').addEventListener("click", () => {
        showModal("Withdraw Money", (amount) => {
            if (amount > accountBalance) {
                showNotification("Insufficient funds.", "error");
            } else {
                accountBalance -= amount;
                updateUI();
                showNotification(`Withdrew $${amount.toFixed(2)}.`);
            }
        });
    });

    // Settings action
    document.querySelector('[data-action="settings"]').addEventListener("click", () => {
        showModal(
            "Set Savings Percentage",
            (percentage) => {
                if (percentage > 100) {
                    showNotification("Percentage cannot exceed 100%.", "error");
                } else {
                    savingsPercentage = percentage;
                    updateUI();
                    showNotification(`Savings percentage set to ${savingsPercentage}%.`);
                }
            },
            "Enter percentage (0-100)"
        );
    });

    // Exit action
    document.querySelector('[data-action="exit"]').addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
