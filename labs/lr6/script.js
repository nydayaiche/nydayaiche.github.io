window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("order-form");
    const quantityField = document.getElementById("quantity");
    const paperGroup = document.getElementById("paper-group");
    const paper = document.getElementById("paper");
    const coverGroup = document.getElementById("cover-group");
    const cover = document.getElementById("cover");
    const result = document.getElementById("result");

    function showError(message) {
        quantityField.setAttribute("aria-invalid", "true");
        result.value = message;
    }

    function updateCost() {
        const service = form.querySelector("input[name=service]:checked");
        const hasPaper = service.value === "color";
        const hasCover = service.value === "binding";

        paperGroup.hidden = !hasPaper;
        paper.disabled = !hasPaper;
        coverGroup.hidden = !hasCover;
        cover.disabled = !hasCover;

        if (!(/^[0-9]+$/).test(quantityField.value)) {
            showError("Введите цифры без пробелов.");
            return;
        }

        const quantity = parseInt(quantityField.value, 10);
        let price = Number(service.dataset.price);

        if (hasPaper) {
            price += Number(paper.value);
        }
        if (hasCover && cover.checked) {
            price += Number(cover.dataset.price);
        }

        const total = quantity * price;
        if (!Number.isSafeInteger(total)) {
            showError("Количество слишком большое.");
            return;
        }

        quantityField.removeAttribute("aria-invalid");
        result.value = "Стоимость услуги: " + total + " руб.";
    }

    quantityField.addEventListener("input", updateCost);
    form.addEventListener("change", updateCost);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    updateCost();
});
