function Slidezy(selector, options = {}) {
    if (typeof selector !== "string") {
        throw new Error("Selector must be a string");
    }
    this.container = document.querySelector(selector);

    if (!this.container) {
        throw new Error(`Element not found for selector: ${selector}`);
    }

    this.opt = Object.assign(
        {
            items: 1,
            loop: false,
        },
        options
    );
    this._slides = Array.from(this.container.children);
    this._currentIndex = this.opt.loop ? this.opt.items : 0;

    this._originalHTML = this.container.innerHTML;

    this._init();
    this._updatePosition();
}

Slidezy.prototype._init = function () {
    this.container.classList.add("slidezy-wrapper");

    this._createTrack();
    this._createNavigation();
};

Slidezy.prototype._createTrack = function () {
    this.track = document.createElement("div");
    this.track.classList.add("slidezy-track");

    const cloneHead = this._slides
        .slice(-this.opt.items)
        .map((node) => node.cloneNode(true));
    const cloneTail = this._slides
        .slice(0, this.opt.items)
        .map((node) => node.cloneNode(true));

    this._slides = cloneHead.concat(this._slides.concat(cloneTail));

    this._slides.forEach((slide) => {
        slide.classList.add("slidezy-slide");
        slide.style.flexBasis = `${100 / this.opt.items}%`;
        this.track.appendChild(slide);
    });

    this.container.append(this.track);
};

Slidezy.prototype._createNavigation = function () {
    this.btnPrev = document.createElement("button");
    this.btnNext = document.createElement("button");

    this.btnPrev.textContent = "<";
    this.btnNext.textContent = ">";

    this.btnNext.classList.add("slidezy-next");
    this.btnPrev.classList.add("slidezy-prev");

    this.container.append(this.btnPrev, this.btnNext);

    this.btnNext.onclick = () => {
        this._moveSlice(1);
    };
    this.btnPrev.onclick = () => {
        this._moveSlice(-1);
    };
};

Slidezy.prototype._moveSlice = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;
    if (this.opt.loop) {
        this._currentIndex =
            (this._currentIndex + step + this._slides.length) %
            this._slides.length;
        this.track.ontransitionend = () => {
            const maxIndex = this._slides.length - this.opt.items;
            if (this._currentIndex <= 0) {
                this._currentIndex = maxIndex - this.opt.items;
            } else if (this._currentIndex >= maxIndex) {
                this._currentIndex = this.opt.items;
            }

            this._updatePosition(true);
            this._isAnimating = false;
        };
    } else {
        this._currentIndex = Math.min(
            Math.max(this._currentIndex + step, 0),
            this._slides.length - this.opt.items
        );
    }
    this._updatePosition();
};

Slidezy.prototype._updatePosition = function (instant = false) {
    this.track.style.transition = instant
        ? "none"
        : "transform 0.3s ease-in-out";
    this.offset = -(this._currentIndex * (100 / this.opt.items));
    this.track.style.transform = `translateX(${this.offset}%)`;
};
