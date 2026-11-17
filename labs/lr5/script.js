window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("order-form");
    const quantityField = document.getElementById("quantity");
    const productField = document.getElementById("product");
    const result = document.getElementById("result");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!(/^[0-9]+$/).test(quantityField.value)) {
            quantityField.setAttribute("aria-invalid", "true");
            result.textContent = "Введите цифры без пробелов.";
            return;
        }

        const quantity = parseInt(quantityField.value, 10);
        const price = parseInt(productField.value, 10);
        const total = quantity * price;

        if (!Number.isSafeInteger(total)) {
            quantityField.setAttribute("aria-invalid", "true");
            result.textContent = "Количество слишком большое.";
            return;
        }

        quantityField.removeAttribute("aria-invalid");
        result.textContent = "Стоимость заказа: " + total + " руб.";
    });
});
