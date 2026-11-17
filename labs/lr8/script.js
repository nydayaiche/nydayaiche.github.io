window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const popupHash = "#feedback";
    const draftKey = "lr8-feedback-draft";
    const dialog = document.getElementById("feedback-dialog");
    const openButton = document.getElementById("open-feedback");
    const closeButton = document.getElementById("close-feedback");
    const form = document.getElementById("feedback-form");
    const fields = document.getElementById("feedback-fields");
    const status = document.getElementById("feedback-status");

    function syncDialog() {
        if (window.location.hash === popupHash) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else if (dialog.open) {
            dialog.close();
        }
    }

    function closeDialog() {
        if (window.history.state?.lr8Feedback === true) {
            window.history.back();
            return;
        }

        const url = window.location.pathname + window.location.search;
        window.history.replaceState(window.history.state, "", url);
        syncDialog();
    }

    function saveDraft() {
        try {
            const values = Object.fromEntries(new FormData(form));
            window.localStorage.setItem(draftKey, JSON.stringify(values));
        } catch {
            return;
        }
    }

    function restoreDraft() {
        try {
            const draft = window.localStorage.getItem(draftKey);
            const values = JSON.parse(draft) ?? {};

            form.querySelectorAll("[name]").forEach(function (field) {
                const value = values[field.name];
                if (field.type === "checkbox") {
                    field.checked = value === field.value;
                } else if (typeof value === "string") {
                    field.value = value;
                }
            });
        } catch {
            return;
        }
    }

    function clearDraft() {
        try {
            window.localStorage.removeItem(draftKey);
        } catch {
            return;
        }
    }

    function showStatus(message, state) {
        status.textContent = message;
        status.dataset.state = state;
    }

    async function sendForm(event) {
        event.preventDefault();

        if (fields.disabled) {
            return;
        }
        if (!form.dataset.endpoint) {
            showStatus("Адрес для отправки не настроен.", "error");
            return;
        }

        const errorMessage = "Не удалось отправить. Попробуйте ещё раз.";
        const data = new FormData(form);
        fields.disabled = true;
        showStatus("Отправляем сообщение…", "pending");

        try {
            const response = await window.fetch(form.dataset.endpoint, {
                body: data,
                headers: {Accept: "application/json"},
                method: "POST",
                signal: window.AbortSignal.timeout(15000)
            });
            const result = await response.json();

            if (!response.ok || result.code !== 200) {
                showStatus(errorMessage, "error");
                return;
            }

            form.reset();
            clearDraft();
            showStatus("Сообщение отправлено.", "success");
        } catch {
            showStatus(errorMessage, "error");
        } finally {
            fields.disabled = false;
        }
    }

    openButton.addEventListener("click", function () {
        window.history.pushState({lr8Feedback: true}, "", popupHash);
        syncDialog();
    });
    closeButton.addEventListener("click", closeDialog);
    dialog.addEventListener("cancel", function (event) {
        event.preventDefault();
        closeDialog();
    });
    window.addEventListener("popstate", syncDialog);
    form.addEventListener("input", saveDraft);
    form.addEventListener("submit", sendForm);

    restoreDraft();
    syncDialog();
});
