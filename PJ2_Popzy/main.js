Popzy.elements = [];

function Popzy(options = {}) {
    if (!options.content && !options.templateId) {
        console.error("You must provide one of 'content' or 'templateId'.");
        return;
    }

    if (options.content && options.templateId) {
        options.templateId = null;
        console.warn(
            "Both 'content' and 'templateId' are specified. 'content' will take precedence, and 'templateId' will be ignored."
        );
    }

    if (options.templateId) {
        this.template = document.querySelector(`#${options.templateId}`);

        if (!this.template) {
            console.error(`#${options.templateId} does not exist!`);
            return;
        }
    }

    this.opt = Object.assign(
        {
            enableScrollLock: true,
            destroyOnClose: true,
            footer: false,
            cssClass: [],
            closeMethods: ["button", "overlay", "escape"],
            scrollLockTarget: () => document.body,
        },
        options
    );

    this.content = this.opt.content;
    const { closeMethods } = this.opt;
    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");

    this._footerButtons = [];

    this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Popzy.prototype._build = function () {
    const contentNode = this.content
        ? document.createElement("div")
        : this.template.content.cloneNode(true);

    if (this.content) {
        contentNode.innerHTML = this.content;
    }

    // Create modal elements
    this._backdrop = document.createElement("div");
    this._backdrop.className = "popzy__backdrop";

    const container = document.createElement("div");
    container.className = "popzy__container";

    this.opt.cssClass.forEach((className) => {
        if (typeof className === "string") {
            container.classList.add(className);
        }
    });

    if (this._allowButtonClose) {
        const closeBtn = this._createButton("&times;", "popzy__close", () =>
            this.close()
        );
        container.append(closeBtn);
    }

    this._modalContent = document.createElement("div");
    this._modalContent.className = "popzy__content";

    // Append content and elements
    this._modalContent.append(contentNode);
    container.append(this._modalContent);

    if (this.opt.footer) {
        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "popzy__footer";

        this._renderFooterContent();
        this._renderFooterButtons();

        container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
};

Popzy.prototype.setContent = function (content) {
    this.content = content;
    if (this._modalContent) {
        this._modalContent.innerHTML = this.content;
    }
};

Popzy.prototype.setFooterContent = function (html) {
    this._footerContent = html;
    this._renderFooterContent();
};

Popzy.prototype.addFooterButton = function (title, cssClass, callback) {
    const button = this._createButton(title, cssClass, callback);
    this._footerButtons.push(button);
    this._renderFooterButtons();
};

Popzy.prototype._renderFooterContent = function () {
    if (this._modalFooter && this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
    }
};

Popzy.prototype._renderFooterButtons = function () {
    if (this._modalFooter) {
        this._footerButtons.forEach((button) => {
            this._modalFooter.append(button);
        });
    }
};

Popzy.prototype._createButton = function (title, cssClass, callback) {
    const button = document.createElement("button");
    button.className = cssClass;
    button.innerHTML = title;
    button.onclick = callback;

    return button;
};

Popzy.prototype.open = function () {
    Popzy.elements.push(this);

    if (!this._backdrop) {
        this._build();
    }

    setTimeout(() => {
        this._backdrop.classList.add("popzy--show");
    }, 0);

    if (this.opt.enableScrollLock) {
        const scrollLockTarget = this.opt.scrollLockTarget();
        if (this._hasScrollbar(scrollLockTarget)) {
            // Disable scrolling
            scrollLockTarget.classList.add("popzy--no-scroll");
            const targetPaddingRight = parseInt(
                getComputedStyle(scrollLockTarget).paddingRight
            );
            scrollLockTarget.style.paddingRight =
                targetPaddingRight + this._getScrollbarWidth() + "px";
        }
    }

    // Attach event listeners
    if (this._allowBackdropClose) {
        this._backdrop.onclick = (e) => {
            if (e.target === this._backdrop) {
                this.close();
            }
        };
    }

    if (this._allowEscapeClose) {
        document.addEventListener("keydown", this._handleEscapeKey);
    }

    this._onTransitionEnd(this.opt.onOpen);

    return this._backdrop;
};

Popzy.prototype._handleEscapeKey = function (e) {
    const lastModal = Popzy.elements[Popzy.elements.length - 1];
    if (e.key === "Escape" && this === lastModal) {
        this.close();
    }
};

Popzy.prototype._hasScrollbar = function (target) {
    if ([document.documentElement, document.body].includes(target)) {
        return (
            document.documentElement.scrollHeight >
                document.documentElement.clientHeight ||
            document.body.scrollHeight > document.body.clientHeight
        );
    }

    return target.scrollHeight > target.clientHeight;
};

Popzy.prototype._onTransitionEnd = function (callback) {
    this._backdrop.ontransitionend = (e) => {
        if (e.propertyName !== "transform") return;
        if (typeof callback === "function") callback();
    };
};

Popzy.prototype.close = function (destroy = this.opt.destroyOnClose) {
    Popzy.elements.pop();

    this._backdrop.classList.remove("popzy--show");

    if (this._allowEscapeClose) {
        document.removeEventListener("keydown", this._handleEscapeKey);
    }

    this._onTransitionEnd(() => {
        if (this._backdrop && destroy) {
            this._backdrop.remove();
            this._backdrop = null;
            this._modalFooter = null;
        }

        // Enable scrolling
        if (!Popzy.elements.length && this.opt.enableScrollLock) {
            const scrollLockTarget = this.opt.scrollLockTarget();
            scrollLockTarget.classList.remove("popzy--no-scroll");
            scrollLockTarget.style.paddingRight = "";
        }

        if (typeof this.opt.onClose === "function") this.opt.onClose();
    });
};

Popzy.prototype.destroy = function () {
    this.close(true);
};

Popzy.prototype._getScrollbarWidth = function () {
    if (this._scrollbarWidth) return this._scrollbarWidth;

    const div = document.createElement("div");
    Object.assign(div.style, {
        overflow: "scroll",
        position: "absolute",
        top: "-9999px",
    });

    document.body.appendChild(div);
    this._scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return this._scrollbarWidth;
};
const modal1 = new Popzy({
    templateId: "modal-1",
    destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 opened");
    },
    onClose: () => {
        console.log("Modal 1 closed");
    },
});

document.querySelector("#open-modal-1").onclick = () => {
    modal1.open();
};

const modal2 = new Popzy({
    templateId: "modal-2",
    // closeMethods: ['button', 'overlay', 'escape'],
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("Modal 2 opened");
    },
    onClose: () => {
        console.log("Modal 2 closed");
    },
});

document.querySelector("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

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

const modal3 = new Popzy({
    templateId: "modal-3",
    closeMethods: ["escape"],
    footer: true,
    onOpen: () => {
        console.log("Modal 3 opened");
    },
    onClose: () => {
        console.log("Modal 3 closed");
    },
});

// modal3.setFooterContent("<h2>Footer content</h2>");

modal3.addFooterButton(
    "Danger",
    "popzy__btn popzy__btn--danger popzy__btn--pull-left",
    (e) => {
        alert("Danger clicked!");
    }
);

modal3.addFooterButton("Cancel", "popzy__btn", (e) => {
    modal3.close();
});

modal3.addFooterButton(
    "<span>Agree</span>",
    "popzy__btn popzy__btn--primary",
    (e) => {
        // Something...
        modal3.close();
    }
);

document.querySelector("#open-modal-3").onclick = () => {
    modal3.open();
};
