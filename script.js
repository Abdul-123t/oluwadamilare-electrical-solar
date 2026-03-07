document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // 2. Sticky Header on Scroll
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Current Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. Form Submission Handling (FormSubmit AJAX)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get button to show loading state
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    // Check for both string "true" and boolean true
                    if (data.success === "true" || data.success === true) {
                        btn.textContent = 'Quote Request Sent!';
                        btn.style.backgroundColor = '#25D366'; // WhatsApp green for success
                        btn.style.color = '#fff';
                        contactForm.reset();
                    } else {
                        console.error('Submission failed:', data);
                        btn.textContent = 'Action Required: Check Email';
                        btn.style.backgroundColor = '#ff4b2b';
                        const originalBtnText = originalText;
                        // Provide more context if it's an activation issue
                        if (data.message && data.message.includes('activate')) {
                            alert("Please check your email and click the 'Activate Form' button from FormSubmit to enable the form!");
                        }
                    }

                    // Revert button back after 6 seconds
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                    }, 6000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    btn.textContent = 'Submission Failed';
                    btn.style.backgroundColor = '#ff4b2b';

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.opacity = '1';
                        btn.disabled = false;
                    }, 5000);
                });
        });
    }

});
