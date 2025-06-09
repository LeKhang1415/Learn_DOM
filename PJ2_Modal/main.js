const allBtnsModal = document.querySelectorAll("[data-modal]");
const allBtnsClose = document.querySelectorAll(".modal-close");
const allModals = document.querySelectorAll(".modal-backdrop");

allBtnsModal.forEach((btn) => {
    btn.onclick = function () {
        const modalId = this.getAttribute("data-modal");
        const modal = document.querySelector(modalId);
        if (modal) {
            modal.classList.add("show");
        } else {
            console.error(`Modal with ID ${modalId} not found.`);
        }
    };
});

allBtnsClose.forEach((btn) => {
    btn.onclick = function () {
        const modal = this.closest(".modal-backdrop");
        if (modal) {
            modal.classList.remove("show");
        } else {
            console.error("No modal found to close.");
        }
    };
});

allModals.forEach((modal) => {
    modal.onclick = function (event) {
        if (event.target === this) {
            this.classList.remove("show");
        }
    };
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        allModals.forEach((modal) => {
            if (modal.classList.contains("show")) {
                modal.classList.remove("show");
            }
        });
    }
});
