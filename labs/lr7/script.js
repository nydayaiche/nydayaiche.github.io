window.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const track = document.getElementById("gallery-track");
    const slides = Array.from(track.children);
    const previous = document.getElementById("previous");
    const next = document.getElementById("next");
    const pager = document.getElementById("pager");
    const wideScreen = window.matchMedia("(min-width: 600px)");
    let page = 0;
    let firstSlide = 0;

    function slidesPerPage() {
        return (
            wideScreen.matches
            ? 3
            : 1
        );
    }

    function render(requestedPage) {
        const count = slidesPerPage();
        const total = Math.ceil(slides.length / count);

        page = Math.max(0, Math.min(requestedPage, total - 1));
        firstSlide = Math.min(page * count, slides.length - count);

        const shift = firstSlide * -100 / count;
        track.style.transform = "translateX(" + shift + "%)";
        slides.forEach(function (slide, index) {
            const hidden = index < firstSlide || index >= firstSlide + count;
            slide.setAttribute("aria-hidden", String(hidden));
        });

        previous.setAttribute("aria-disabled", String(page === 0));
        next.setAttribute("aria-disabled", String(page === total - 1));
        pager.textContent = "Страница " + (page + 1) + " из " + total;
    }

    previous.addEventListener("click", function () {
        render(page - 1);
    });
    next.addEventListener("click", function () {
        render(page + 1);
    });
    wideScreen.addEventListener("change", function () {
        const count = slidesPerPage();
        if (firstSlide >= slides.length - count) {
            render(Math.ceil(slides.length / count) - 1);
            return;
        }
        render(Math.floor(firstSlide / count));
    });

    render(0);
});
