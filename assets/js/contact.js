document.addEventListener('DOMContentLoaded', function () {
    // Contact method interactions
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('click', function (e) {
            if (this.tagName === 'A') return; // Let anchor tags handle their own navigation

            const platform = this.dataset.platform;
            let actionUrl = '';
            let message = '';

            switch (platform) {
                case 'email':
                    actionUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=contact@pythonquiz.com';
                    message = 'Opening Gmail...';
                    break;
                case 'whatsapp':
                    actionUrl = 'https://wa.me/15551234567';
                    message = 'Opening WhatsApp...';
                    break;
                case 'phone':
                    actionUrl = 'tel:+15559876543';
                    message = 'Dialing phone number...';
                    break;
            }

            if (actionUrl) {
                alert(message);
                window.open(actionUrl, '_blank');
            }
        });
    });

    // Form validation
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Form submission logic would go here
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Carousel functionality
    const slides = document.querySelectorAll('.contact-slide');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    let currentIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Initialize carousel
    if (slides.length > 0) {
        showSlide(currentIndex);
        startAutoSlide();

        // Manual controls
        nextBtn?.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });

        prevBtn?.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });

        // Pause on hover
        const carousel = document.querySelector('.contact-carousel');
        carousel?.addEventListener('mouseenter', stopAutoSlide);
        carousel?.addEventListener('mouseleave', startAutoSlide);
    }
});