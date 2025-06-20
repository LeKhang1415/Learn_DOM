function Tabzy(selector, options = {}) {
    if (!selector) {
        throw new Error("Tabzy: selector is required");
    }
    this.selector = selector.replace(/[^a-zA-Z0-9]/g, "");

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
            onChange: null,
        },
        options
    );

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tabzy.prototype._init = function () {
    let activeTab = null;
    let params = new URLSearchParams(location.search);
    const activeTabId = params.get(this.selector);
    const selectorKey = this.selector;
    if (params.has(selectorKey) && this.opt.remember) {
        activeTab = this.tabs.find((tab) => {
            return (
                tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, "") ===
                activeTabId
            );
        });
    }
    this._currentActiveTab = activeTab;
    if (activeTab) {
        this._activeTab(activeTab, false);
    } else {
        this._activeTab(this.tabs[0], false);
    }

    this.tabs.forEach((tab) => {
        tab.onclick = (event) => {
            this._handleTabClick(event, tab);
        };
    });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
    event.preventDefault();
    if (this._currentActiveTab !== tab) {
        this._activeTab(tab);
        this._currentActiveTab = tab;
    }
};

Tabzy.prototype._activeTab = function (tab, triggerOnChange = true) {
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
        const tabId = tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, "");
        const selectorKey = this.selector;
        params.set(selectorKey, tabId);
        history.replaceState(null, "", `?${params.toString()}`);
    }
    if (typeof this.opt.onChange === "function" && triggerOnChange) {
        this.opt.onChange({
            tab,
            panel,
        });
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

    if (this._currentActiveTab !== tabToActive) {
        this._activeTab(tabToActive);
        this._currentActiveTab = tabToActive;
    }
};

Tabzy.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => {
        panel.hidden = false;
    });
    this.container = null;
    this.tabs = null;
    this.panels = null;
    this._currentActiveTab = null;
};
