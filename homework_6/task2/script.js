const gallery = {
    selectedImage: null,

    settings: {
        gallerySelector: '.gallery',
        fullViewContainerClass: 'full-view-container',
        fullViewImageClass: 'full-view__image',
        fullViewPrevBtnClass: 'full-view__prev-btn',
        fullViewNextBtnClass: 'full-view__next-btn',
        fullViewCloseBtnClass: 'full-view__close-btn',
        fullViewBackSideClass: 'full-view__back-side',
        imageNotFoundUrl: 'img/not_found/1.jpg',
        imagePrevUrl: 'img/tools/prev.svg',
        imageNextUrl: 'img/tools/next.svg',
        imageCloseUrl: 'img/tools/close.svg',
    },

    init(settings) {
        this.settings = Object.assign(this.settings, settings);

        document.querySelector(this.settings.gallerySelector)
            .addEventListener('click', (event) => this.galleryClickHandler(event));
    },

    galleryClickHandler(event) {
        if (event.target.tagName !== 'IMG') return;

        this.selectedImage = event.target;

        this.openImage(event.target.dataset.full_img_url);
    },

    openImage(url) {
        // console.log(url);
        const fullViewImage = this.getFullImageContainer().querySelector(`.${this.settings.fullViewImageClass}`);
        const img = new Image();

        img.onload = () => fullViewImage.src = url;
        img.onerror = () => fullViewImage.src = this.settings.imageNotFoundUrl;
        img.src = url;
    },

    getFullImageContainer() {
        const fullViewContainer = document.querySelector(`.${this.settings.fullViewContainerClass}`);

        if (fullViewContainer) {
            return fullViewContainer;
        }

        return this.createFullViewContainer();
    },

    createFullViewContainer() {
        const fullViewContainer = document.createElement('div');
        fullViewContainer.classList.add(this.settings.fullViewContainerClass);

        const prevBtn = new Image();
        prevBtn.classList.add(this.settings.fullViewPrevBtnClass);
        prevBtn.src = this.settings.imagePrevUrl;
        fullViewContainer.appendChild(prevBtn);

        prevBtn.addEventListener('click', () => {
            this.selectedImage = this.getPrevImage();
            this.openImage(this.selectedImage.dataset.full_img_url);
        });

        const nextBtn = new Image();
        nextBtn.classList.add(this.settings.fullViewNextBtnClass);
        nextBtn.src = this.settings.imageNextUrl;
        fullViewContainer.appendChild(nextBtn);

        nextBtn.addEventListener('click', () => {
            this.selectedImage = this.getNextImage();
            this.openImage(this.selectedImage.dataset.full_img_url);
        });

        const fullViewBackSide = document.createElement('div');
        fullViewBackSide.classList.add(this.settings.fullViewBackSideClass);
        fullViewContainer.appendChild(fullViewBackSide);

        const closeBtn = new Image();
        closeBtn.classList.add(this.settings.fullViewCloseBtnClass);
        closeBtn.src = this.settings.imageCloseUrl;
        fullViewContainer.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => this.close());

        const fullViewImg = new Image();
        fullViewImg.classList.add(this.settings.fullViewImageClass);
        fullViewContainer.appendChild(fullViewImg);

        document.body.appendChild(fullViewContainer);

        return fullViewContainer;
    },

    getNextImage() {
        const nextImage = this.selectedImage.nextElementSibling;

        return nextImage ? nextImage : this.selectedImage.parentElement.firstElementChild;
    },

    getPrevImage() {
        const prevImage = this.selectedImage.previousElementSibling;

        return prevImage ? prevImage : this.selectedImage.parentElement.lastElementChild;
    },

    close() {
        document.querySelector(`.${this.settings.fullViewContainerClass}`).remove();
    },
};

window.onload = () => gallery.init({});
