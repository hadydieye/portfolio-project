/* ========================================
   JAVASCRIPT - Portfolio Mohamed Hady Diallo
   ======================================== */

/* ========== LUCIDE ICONS INITIALIZATION ==========  */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/* ========== THEME MANAGEMENT ==========  */
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        this.loadTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.prefersDark.addEventListener('change', (e) => this.setTheme(e.matches ? 'dark' : 'light'));
    }

    loadTheme() {
        const saved = localStorage.getItem('theme');
        const theme = saved || (this.prefersDark.matches ? 'dark' : 'light');
        this.setTheme(theme);
    }

    setTheme(theme) {
        const body = document.body;
        body.classList.remove('dark-mode', 'light-mode');
        body.classList.add(`${theme}-mode`);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon(theme);
    }

    updateToggleIcon(theme) {
        // Supprimer l'ancienne icône
        const oldIcon = this.themeToggle.querySelector('[data-lucide]');
        if (oldIcon) {
            oldIcon.remove();
        }
        
        // Créer la nouvelle icône
        const iconName = theme === 'dark' ? 'sun' : 'moon';
        const newIcon = document.createElement('i');
        newIcon.setAttribute('data-lucide', iconName);
        this.themeToggle.appendChild(newIcon);
        
        // Réinitialiser Lucide pour la nouvelle icône
        initLucideIcons();
    }

    toggleTheme() {
        const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
    }
}

/* ========== NAVIGATION ACTIVE LINK ==========  */
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            
            if (href === current || (current === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
}

/* ========== PROJECT FILTER ==========  */
class ProjectFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        if (this.filterBtns.length > 0) {
            this.init();
        }
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });
    }

    handleFilter(btn) {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        this.animateProjects(filter);
    }

    animateProjects(filter) {
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'grid';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 10);
                }, 100);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

/* ========== FORM VALIDATION & SUBMISSION ==========  */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.validateField(input));
        });
    }

    validateField(field) {
        const group = field.closest('.form-group');
        const value = field.value.trim();
        let isValid = true;
        let errorMsg = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMsg = 'Ce champ est obligatoire';
        } else if (field.type === 'email' && value) {
            isValid = this.validateEmail(value);
            if (!isValid) errorMsg = 'Email invalide';
        } else if (field.type === 'tel' && value) {
            isValid = this.validatePhone(value);
            if (!isValid) errorMsg = 'Numéro de téléphone invalide';
        }

        if (isValid) {
            group.classList.remove('error');
            group.querySelector('.form-error').textContent = '';
        } else {
            group.classList.add('error');
            group.querySelector('.form-error').textContent = errorMsg;
        }

        return isValid;
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validatePhone(phone) {
        const regex = /^[\d\s\-\+\(\)]+$/;
        return regex.test(phone) && phone.replace(/\D/g, '').length >= 7;
    }

    handleSubmit(e) {
        e.preventDefault();

        const inputs = this.form.querySelectorAll('[required], [type="email"], [type="tel"]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        const consentCheckbox = this.form.querySelector('input[name="consent"]');
        if (!consentCheckbox.checked) {
            const group = consentCheckbox.closest('.form-group');
            group.classList.add('error');
            group.querySelector('.form-error').textContent = 'Vous devez accepter les conditions';
            isFormValid = false;
        }

        if (isFormValid) {
            this.submitForm();
        }
    }

    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Simulation d'envoi (En production, utiliser fetch/axios)
        console.log('Formulaire soumis:', data);

        // Afficher le message de succès
        const messageDiv = document.getElementById('formMessage');
        messageDiv.textContent = '✓ Message envoyé avec succès ! Je vous répondrai bientôt.';
        messageDiv.classList.add('success');
        messageDiv.classList.remove('error');
        messageDiv.style.display = 'block';

        // Réinitialiser le formulaire
        setTimeout(() => {
            this.form.reset();
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

/* ========== SMOOTH SCROLL ==========  */
class SmoothScroll {
    constructor() {
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

/* ========== SCROLL ANIMATIONS ==========  */
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(
            '.stat-card, .project-card, .about-text, .cert-column, .contact-info, .contact-form-wrapper'
        );
        
        if ('IntersectionObserver' in window) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

/* ========== NAVBAR BACKGROUND ON SCROLL ==========  */
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateNavbar());
    }

    updateNavbar() {
        if (window.scrollY > 50) {
            this.navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            this.navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            this.navbar.style.boxShadow = 'none';
        }
    }
}

/* ========== DYNAMIC BACKGROUND ==========  */
class DynamicBackground {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    }
}

/* ========== PAGE TRANSITIONS ==========  */
class PageTransitions {
    constructor() {
        this.setupPageTransitions();
    }

    setupPageTransitions() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href') && !link.getAttribute('target')) {
                const href = link.getAttribute('href');
                
                if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                    return;
                }

                if (!href.startsWith('#')) {
                    e.preventDefault();
                    this.transitionTo(href);
                }
            }
        });
    }

    transitionTo(url) {
        // Animation de fade out
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
}

/* ========== PERFORMANCE OPTIMIZATION ==========  */
class PerformanceOptimizations {
    constructor() {
        this.optimizeImages();
        this.lazyLoadContent();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    lazyLoadContent() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('[data-lazy]').forEach(el => {
            observer.observe(el);
        });
    }
}

/* ========== INITIALIZATION ==========  */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les icônes Lucide
    initLucideIcons();
    
    // Initialiser tous les modules
    new ThemeManager();
    new NavigationManager();
    new ProjectFilter();
    new ContactForm();
    new SmoothScroll();
    new ScrollAnimations();
    new NavbarScroll();
    new DynamicBackground();
    new PageTransitions();
    new PerformanceOptimizations();

    console.log('✓ Portfolio initialized successfully');
});

/* ========== HELPER FUNCTIONS ==========  */

// Fonction pour débounce (utility)
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Fonction pour throttle (utility)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Réinitialiser les animations et icônes au changement de page
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        new ScrollAnimations();
        new NavbarScroll();
        initLucideIcons();
    }
});

// Gestion de la visibilité de la page
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page cachée');
    } else {
        console.log('Page visible');
    }
});

// Analytics simple (optionnel)
window.addEventListener('load', () => {
    console.log('Portfolio fully loaded at:', new Date().toLocaleTimeString());
});
