/* =========================================================
   CLICK A PICTURE TO SEE IT BIGGER
   Any <img> with class="zoomable" opens large when clicked.
   If there are several pictures together (e.g. Photo Library),
   use the arrows or the keyboard left/right keys to move
   between them. Click outside, press Esc or tap X to close.
   ========================================================= */
(function () {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-prev" aria-label="Previous photo">&#10094;</button>' +
        '<img alt="">' +
        '<button class="lightbox-next" aria-label="Next photo">&#10095;</button>' +
        '<div class="lightbox-count"></div>';
    document.body.appendChild(overlay);

    var big = overlay.querySelector("img");
    var prev = overlay.querySelector(".lightbox-prev");
    var next = overlay.querySelector(".lightbox-next");
    var count = overlay.querySelector(".lightbox-count");
    var group = [];
    var index = 0;

    function visibleInGroup(img) {
        var box = img.closest("#photo-grid, .results-row") || document.body;
        return Array.prototype.filter.call(
            box.querySelectorAll("img.zoomable"),
            function (i) { return i.offsetParent !== null; }
        );
    }

    function show(i) {
        index = (i + group.length) % group.length;
        big.src = group[index].src;
        big.alt = group[index].alt;
        var many = group.length > 1;
        prev.style.display = next.style.display = many ? "" : "none";
        count.textContent = many ? (index + 1) + " / " + group.length : "";
    }

    function close() {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    document.querySelectorAll("img.zoomable").forEach(function (img) {
        img.addEventListener("click", function () {
            group = visibleInGroup(img);
            show(group.indexOf(img));
            overlay.classList.add("open");
            document.body.style.overflow = "hidden";
        });
    });

    prev.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
    next.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });
    big.addEventListener("click", function (e) { e.stopPropagation(); if (group.length > 1) show(index + 1); });
    overlay.addEventListener("click", close);

    document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft" && group.length > 1) show(index - 1);
        if (e.key === "ArrowRight" && group.length > 1) show(index + 1);
    });
})();
