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
            speed: 300,
            nav: true,
            controls: true,
            controlsText: ["<", ">"],
            prevButton: null,
            nextButton: null,
            slideBy: 1, // Can be a number or "page"
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

    this._createContent();
    this._createTrack();

    if (this.opt.controls) {
        this._createControls();
    }

    if (this.opt.nav) {
        this._createNavigation();
    }
};

Slidezy.prototype._createContent = function () {
    this.content = document.createElement("div");
    this.content.className = "slidezy-content";
    this.container.appendChild(this.content);
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

    this.content.appendChild(this.track);
};

Slidezy.prototype._createControls = function () {
    this._createPrevButton();
    this._createNextButton();
};

Slidezy.prototype._createPrevButton = function () {
    const stepSlideBy =
        this.opt.slideBy === "page" ? this.opt.items : this.opt.slideBy;
    if (this.opt.prevButton) {
        this.btnPrev = document.querySelector(this.opt.prevButton);
        if (!this.btnPrev) {
            throw new Error(`Prev button not found: ${this.opt.prevButton}`);
        }
        this.btnPrev.onclick = () => {
            this._moveSlice(-stepSlideBy);
        };
        return;
    }
    this.btnPrev = document.createElement("button");
    this.btnPrev.textContent = this.opt.controlsText[0];
    this.btnPrev.classList.add("slidezy-prev");
    this.content.appendChild(this.btnPrev);
    this.btnPrev.onclick = () => {
        this._moveSlice(-stepSlideBy);
    };
};

Slidezy.prototype._createNextButton = function () {
    const stepSlideBy =
        this.opt.slideBy === "page" ? this.opt.items : this.opt.slideBy;

    if (this.opt.nextButton) {
        this.btnNext = document.querySelector(this.opt.nextButton);
        if (!this.btnNext) {
            throw new Error(`Next button not found: ${this.opt.nextButton}`);
        }
        this.btnNext.onclick = () => {
            this._moveSlice(stepSlideBy);
        };
        return;
    }
    this.btnNext = document.createElement("button");
    this.btnNext.textContent = this.opt.controlsText[1];
    this.btnNext.classList.add("slidezy-next");
    this.content.appendChild(this.btnNext);
    this.btnNext.onclick = () => {
        this._moveSlice(stepSlideBy);
    };
};

Slidezy.prototype._createNavigation = function () {
    if (this.opt.nav) {
        this.navWrapper = document.createElement("div");
        this.navWrapper.classList.add("slidezy-nav");

        const slideCount =
            this._slides.length - (this.opt.loop ? this.opt.items * 2 : 0);

        const pageCount = Math.ceil(slideCount / this.opt.items);

        for (let i = 0; i < pageCount; i++) {
            const navDot = document.createElement("button");
            navDot.classList.add("slidezy-dot");

            if (i === 0) {
                navDot.classList.add("slidezy-active");
            }

            navDot.onclick = () => {
                this._currentIndex = this.opt.loop
                    ? i * this.opt.items + this.opt.items
                    : i * this.opt.items;

                this._updatePosition();
            };

            this.navWrapper.appendChild(navDot);
        }

        this.container.appendChild(this.navWrapper);
    }
};

Slidezy.prototype._moveSlice = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;

    const maxIndex = this._slides.length - this.opt.items;

    this._currentIndex = Math.min(
        Math.max(this._currentIndex + step, 0),
        maxIndex
    );

    setTimeout(() => {
        if (this.opt.loop) {
            if (this._currentIndex <= 0) {
                this._currentIndex = maxIndex - this.opt.items;
                this._updatePosition(true);
            } else if (this._currentIndex >= maxIndex) {
                this._currentIndex = this.opt.items;
                this._updatePosition(true);
            }
        }
        this._isAnimating = false;
    }, this.opt.speed);

    this._updatePosition();
};

Slidezy.prototype._updateNavigation = function () {
    let reactiveIndex = this._currentIndex;

    if (this.opt.loop) {
        const slideCount = this._slides.length - this.opt.items * 2;
        reactiveIndex =
            (this._currentIndex - this.opt.items + slideCount) % slideCount;
    }

    let activeDot = Math.floor(reactiveIndex / this.opt.items);
    const dots = Array.from(this.navWrapper.children);

    dots.forEach((dot, index) => {
        dot.classList.toggle("slidezy-active", index === activeDot);
    });
    console.log(activeDot);
};

Slidezy.prototype._updatePosition = function (instant = false) {
    this.track.style.transition = instant
        ? "none"
        : `transform ${this.opt.speed}ms ease-in-out`;
    this.offset = -(this._currentIndex * (100 / this.opt.items));
    this.track.style.transform = `translateX(${this.offset}%)`;

    if (this.opt.nav && !instant) {
        this._updateNavigation();
    }
};
