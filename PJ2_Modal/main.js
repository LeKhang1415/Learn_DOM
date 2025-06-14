function Modal() {
    this.openModal = (options = {}) => {
        const { templateId, allowBackdropClose = true } = options;
        const template = document.querySelector(templateId);

        if (!template) {
            console.error("Template not found:", templateId);
            return;
        }

        const content = template.content.cloneNode(true);

        // Create  modal elements
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = "&times;"; // Close button

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content to modal
        modalContent.append(content);

        // Append elements to the container
        container.append(closeBtn, modalContent);
        // Append container to backdrop
        backdrop.append(container);
        // Append backdrop to body
        document.body.append(backdrop);

        closeBtn.onclick = () => {
            this.closeModal(backdrop);
        };

        setTimeout(() => {
            backdrop.classList.add("show");
        }, 10);

        if (allowBackdropClose) {
            backdrop.onclick = (event) => {
                // Close modal if clicked outside the content area
                if (event.target === backdrop) {
                    this.closeModal(backdrop);
                }
            };
        }

        document.addEventListener("keydown", (event) => {
            // Close modal on Escape key press
            if (event.key === "Escape") {
                this.closeModal(backdrop);
            }
        });

        // Disable scrolling on the body when modal is open
        document.body.classList.add("no-scroll");

        return backdrop;
    };

    this.closeModal = (backdrop) => {
        if (backdrop) {
            backdrop.classList.remove("show");
            // Wait for the transition to end before removing the backdrop
            backdrop.ontransitionend = () => {
                backdrop.remove();
            };
            document.body.classList.remove("no-scroll");
        }
    };
}

// Usage example
const modal = new Modal();
const btn1 = document.querySelector("#modal-btn-1");
const btn2 = document.querySelector("#modal-btn-2");

btn1.onclick = () => {
    modal.openModal({
        templateId: "#modal-1",
    });
};

btn2.onclick = () => {
    const modalElement = modal.openModal({
        templateId: "#modal-2",
        allowBackdropClose: false,
    });

    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };

            console.log(formData);
        };
    }
};

console.log(btn2);
