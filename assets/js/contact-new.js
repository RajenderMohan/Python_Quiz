document.addEventListener('DOMContentLoaded', function () {
    // Contact method interactions (for email/whatsapp/phone in contact section)
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('click', function (e) {
            if (this.tagName === 'A') return;

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

    // Contact form validation
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

            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});