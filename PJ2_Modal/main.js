function Model() {
    this.openModal = (content) => {
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
        modalContent.innerHTML = content;

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

        backdrop.onclick = (event) => {
            // Close modal if clicked outside the content area
            if (event.target === backdrop) {
                this.closeModal(backdrop);
            }
        };

        document.addEventListener("keydown", (event) => {
            // Close modal on Escape key press
            if (event.key === "Escape") {
                this.closeModal(backdrop);
            }
        });
    };

    this.closeModal = (backdrop) => {
        if (backdrop) {
            backdrop.classList.remove("show");
            // Wait for the transition to end before removing the backdrop
            backdrop.ontransitionend = () => {
                backdrop.remove();
            };
        }
    };
}

// Usage example
const model = new Model();
const btn1 = document.querySelector("#modal-1");

console.log(btn1);
btn1.onclick = () => {
    model.openModal(`
        <h2>Modal Title</h2>
        <p>This is the content of the modal.</p>
        <p>You can add any HTML content here.</p>
    `);
};
