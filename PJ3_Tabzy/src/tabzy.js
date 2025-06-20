function Tabzy(selector, options = {}) {
    if (!selector) {
        throw new Error("Tabzy: selector is required");
    }
    this.selector = selector;

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

    this.opt = Object.assign(
        {
            remember: false,
        },
        options
    );

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tabzy.prototype._init = function () {
    let activeTab = null;
    let params = new URLSearchParams(location.search);
    const selectorKey = this.selector.startsWith("#")
        ? this.selector.substring(1)
        : this.selector;
    if (params.has(selectorKey) && this.opt.remember) {
        activeTab = this.tabs.find((tab) => {
            return tab.getAttribute("href") === `#${params.get(selectorKey)}`;
        });
    }
    if (activeTab) {
        this._activeTab(activeTab);
    } else {
        this._activeTab(this.tabs[0]);
    }

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            this._handleTabClick(event, tab);
        };
    });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    this._activeTab(tab);
};

Tabzy.prototype._activeTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabzy--active");
    });
    tab.closest("li").classList.add("tabzy--active");

    const panel = document.querySelector(tab.getAttribute("href"));
    this.panels.forEach((panel) => {
        panel.hidden = true;
    });
    panel.hidden = false;

    if (this.opt.remember) {
        const params = new URLSearchParams(location.search);
        const tabId = tab.getAttribute("href").substring(1);
        const selectorKey = this.selector.startsWith("#")
            ? this.selector.substring(1)
            : this.selector;
        params.set(selectorKey, tabId);
        history.replaceState(null, "", `?${params.toString()}`);
    }
};

Tabzy.prototype.switch = function (input) {
    const tabToActive = null;

    if (typeof input === "string") {
        const tabToActive = this.tabs.find((tab) => {
            return tab.getAttribute("href") === input;
        });
        if (!tabToActive) {
            throw new Error(`Tabzy: Tab with href ${input} not found`);
        }
    } else if (this.tabs.includes(input)) {
        tabToActive = input;
    }

    if (!tabToActive) {
        throw new Error("Tabzy: Invalid input for switch method");
    }

    this._activeTab(tabToActive);
};

Tabzy.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => {
        panel.hidden = false;
    });
    this.container = null;
    this.tabs = null;
    this.panels = null;
};
