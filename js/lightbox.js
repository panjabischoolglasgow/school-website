/* =========================================================
   CLICK A PICTURE TO SEE IT BIGGER
   Any <img> with class="zoomable" opens full size when clicked.
   Click anywhere, press Esc, or tap the X to close.
   ========================================================= */
(function () {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<img alt="">';
    document.body.appendChild(overlay);

    var big = overlay.querySelector("img");

    function close() {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    document.querySelectorAll("img.zoomable").forEach(function (img) {
        img.addEventListener("click", function () {
            big.src = img.src;
            big.alt = img.alt;
            overlay.classList.add("open");
            document.body.style.overflow = "hidden";
        });
    });

    overlay.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
    });
})();
