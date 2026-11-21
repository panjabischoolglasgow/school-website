/* =========================================================
   PHOTO LIBRARY ALBUM BUTTONS
   Clicking an album button shows only that album's photos.
   ========================================================= */
(function () {
    var buttons = document.querySelectorAll(".album-btn");
    var photos = document.querySelectorAll("#photo-grid .photo");

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var album = btn.getAttribute("data-filter");

            buttons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");

            photos.forEach(function (p) {
                var show = album === "all" || p.getAttribute("data-album") === album;
                p.style.display = show ? "" : "none";
            });
        });
    });
})();
