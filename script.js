document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Active Link Switching based on Scroll Position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY || window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPosition >= (sectionTop - 220)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 2b. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates once for performance
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinksContainer) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const mobileLinks = navLinksContainer.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinksContainer.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    // 4. Portfolio Carousel Logic
    const carousel = document.getElementById('portfolioCarousel');
    const prevBtn = document.getElementById('portPrev');
    const nextBtn = document.getElementById('portNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (carousel && prevBtn && nextBtn) {
        const cards = carousel.querySelectorAll('.carousel-card');
        
        // Setup Dots
        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if(index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                const scrollPos = index * (cards[0].offsetWidth + 32);
                carousel.scrollTo({
                    left: scrollPos,
                    behavior: 'smooth'
                });
            });
            if(dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

        // Scroll event to update active dot
        carousel.addEventListener('scroll', () => {
            let index = Math.round(carousel.scrollLeft / (cards[0].offsetWidth + 32));
            if (index >= dots.length) index = dots.length - 1;
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        });

        // Next/Prev Buttons
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: cards[0].offsetWidth + 32, behavior: 'smooth' });
        });
        
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -(cards[0].offsetWidth + 32), behavior: 'smooth' });
        });

        // Mouse Drag to Scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.scrollSnapType = 'none'; // Disable snapping during drag
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            carousel.style.scrollSnapType = 'x mandatory';
            carousel.style.cursor = 'grab';
        });

        carousel.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            carousel.style.scrollSnapType = 'x mandatory';
            carousel.style.cursor = 'grab';
            
            // Snap to nearest card
            let index = Math.round(carousel.scrollLeft / (cards[0].offsetWidth + 32));
            const scrollPos = index * (cards[0].offsetWidth + 32);
            carousel.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll speed multiplier
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Set initial cursor style
        carousel.style.cursor = 'grab';
    }

    // 5. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check local storage for theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    if (themeToggle && sunIcon && moonIcon) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }
});
