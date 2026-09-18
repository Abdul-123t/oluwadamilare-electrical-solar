document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // 2. Footer Copyright Year Dynamic Update
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Intersection Observer Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Project Portfolio Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 5. Project Lightbox Modal Handler
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    const modalDesc = document.getElementById('modalDesc');

    if (projectModal && galleryCards.length > 0) {
        galleryCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.getAttribute('data-title') || '';
                const desc = card.getAttribute('data-desc') || '';
                const img = card.getAttribute('data-img') || '';
                const category = card.querySelector('.gallery-tag')?.textContent || 'Project';

                modalImg.src = img;
                modalImg.alt = title;
                modalTitle.textContent = title;
                modalTag.textContent = category;
                modalDesc.textContent = desc;

                projectModal.classList.add('active');
                projectModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 6. Robust Video Component Player Handler
    const playVideoBtn = document.getElementById('playVideoBtn');
    const siteVideo = document.getElementById('siteVideo');
    const videoOverlay = document.getElementById('videoOverlay');

    if (playVideoBtn && siteVideo && videoOverlay) {
        playVideoBtn.addEventListener('click', () => {
            videoOverlay.classList.add('hidden');
            siteVideo.play().catch(err => {
                console.log('Video play error or missing MP4 source:', err);
                // Graceful fallback to poster overlay
                videoOverlay.classList.remove('hidden');
            });
        });

        siteVideo.addEventListener('play', () => {
            videoOverlay.classList.add('hidden');
        });

        siteVideo.addEventListener('pause', () => {
            if (siteVideo.currentTime === 0 || siteVideo.ended) {
                videoOverlay.classList.remove('hidden');
            }
        });

        siteVideo.addEventListener('ended', () => {
            videoOverlay.classList.remove('hidden');
        });
    }

    // 7. FormSubmit Lead Form Submission Handler (AJAX)
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;

            submitBtn.textContent = 'Sending Quote Request...';
            submitBtn.style.opacity = '0.85';
            submitBtn.disabled = true;

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
            .then(res => {
                if (res.success === "true" || res.success === true) {
                    submitBtn.textContent = 'Quote Request Sent Successfully!';
                    submitBtn.style.backgroundColor = '#25D366';
                    submitBtn.style.borderColor = '#25D366';
                    submitBtn.style.color = '#FFFFFF';
                    contactForm.reset();
                } else {
                    console.error('Submission returned status:', res);
                    submitBtn.textContent = 'Activation Required: Check Email';
                    submitBtn.style.backgroundColor = '#DC2626';
                    submitBtn.style.borderColor = '#DC2626';

                    if (res.message && res.message.includes('activate')) {
                        alert("Please check your email and click 'Activate Form' from FormSubmit to enable submissions.");
                    }
                }

                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 6000);
            })
            .catch(err => {
                console.error('Form submission error:', err);
                submitBtn.textContent = 'Submission Failed. Try Again';
                submitBtn.style.backgroundColor = '#DC2626';

                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 5000);
            });
        });
    }

});
