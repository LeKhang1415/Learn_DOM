function Modal(options = {}) {
    const {
        templateId,
        closeMethods = ["button", "overlay", "escape"],
        destroyOnClose = true,
        cssClass = [],
        footer = false,
        onOpen = () => {},
        onClose = () => {},
    } = options;
    const template = document.querySelector(`#${templateId}`);

    if (!template) {
        console.error("Template not found:", templateId);
        return;
    }

    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");
    this._allowButtonClose = closeMethods.includes("button");

    function getScrollBarWidth() {
        // Create a temporary element to measure scrollbar width
        const scrollDiv = document.createElement("div");
        scrollDiv.style.overflow = "scroll";
        scrollDiv.style.width = "100px";
        scrollDiv.style.height = "100px";
        document.body.appendChild(scrollDiv);

        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);

        return scrollbarWidth;
    }

    const scrollBarWidth = getScrollBarWidth();

    this._build = () => {
        const content = template.content.cloneNode(true);

        // Create  modal elements
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");

        container.className = "modal-container";
        // Add custom CSS classes if provided
        cssClass.forEach((cls) => {
            if (cls && typeof cls === "string") {
                container.classList.add(cls);
            }
        });
        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;"; // Close button symbol
            container.append(closeBtn);

            closeBtn.onclick = () => this.close();
        }

        if (footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";
            if (typeof this._footerContent === "string") {
                this._modalFooter.innerHTML = this._footerContent;
            }
            container.append(this._modalFooter);
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        // Append content to modal
        modalContent.append(content);

        // Append elements to the container
        container.append(modalContent);
        // Append container to backdrop
        this._backdrop.append(container);
        // Append backdrop to body
        document.body.append(this._backdrop);
    };

    this.open = () => {
        if (!this._backdrop) {
            this._build();
        }

        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 10);

        if (this._allowBackdropClose) {
            this._backdrop.onclick = (event) => {
                // Close modal if clicked outside the content area
                if (event.target === this._backdrop) {
                    this.close();
                }
            };
        }

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    this.close();
                }
            });
        }

        // Disable scrolling on the body when modal is open
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        this._onTransitionEnd(() => {
            if (typeof onOpen === "function") {
                onOpen();
            }
        });
        return this._backdrop;
    };

    this._onTransitionEnd = (callback) => {
        if (typeof callback === "function") {
            callback();
        }
    };

    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");

        this._onTransitionEnd(() => {
            // Wait for the transition to end before removing the backdrop
            this._backdrop.ontransitionend = (e) => {
                if (e.propertyName !== "transform") return;

                if (destroy) {
                    this._backdrop.remove();
                    this._backdrop = null;
                    this._modalFooter = null;
                }

                document.body.classList.remove("no-scroll");
                document.body.style.paddingRight = "";
            };

            if (typeof onClose === "function") {
                onClose();
            }
        });
    };

    this.destroy = () => {
        this.close(true);
    };

    this.setFooterContent = (content) => {
        this._footerContent = content;
        if (this._modalFooter) {
            if (typeof content === "string") {
                this._modalFooter.innerHTML = content;
            }
        }
    };
}
// Usage example
const modal1 = new Modal({
    templateId: "modal-1",
});
const modal2 = new Modal({
    templateId: "modal-2",
});
const btn1 = document.querySelector("#modal-btn-1");
const btn2 = document.querySelector("#modal-btn-2");

btn1.onclick = () => {
    modal1.open();
};

btn2.onclick = () => {
    modal2.open();
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
