function Tabzy(selector, options = {}) {
    if (!selector) {
        throw new Error("Tabzy: selector is required");
    }

    this.container = document.querySelector(selector);

    if (!this.container) {
        throw new Error(`Tabzy: Element with id ${selector} not found`);
    }

    this.tabs = Array.from(this.container.querySelectorAll(`li a`));

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                throw new Error(
                    `Tabzy: Panel with id ${tab.getAttribute("href")} not found`
                );
            }
            return panel;
        })
        .filter(Boolean);

    if (this.tabs.length === 0 || this.panels.length === 0) {
        return;
    }

    this._init();
}

Tabzy.prototype._init = function () {
    const tabActive = this.tabs[0];
    tabActive.closest("li").classList.add("tabzy--active");

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            this._handleTabClick(event, tab);
        };
    });

    const panelActive = this.panels[0];
    panelActive.hidden = false;
};

Tabzy.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    console.log(event, tab);

    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });
    tab.closest("li").classList.add("tabzy--active");

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });
    const panelId = tab.getAttribute("href");
    const panel = document.querySelector(panelId);
    panel.hidden = false;
};

Tabzy.prototype.switch = function (selector) {
    // tab element or panel element
    const tab = this.container.querySelector(selector);
    if (!tab) {
        throw new Error(`Tabzy: Element with selector ${selector} not found`);
    }
};
