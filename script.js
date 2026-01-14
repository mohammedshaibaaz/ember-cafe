/* ============================================================================
   EMBER CAFÉ – MICRO-INTERACTIONS & ANIMATIONS
   Calm, intentional, breathing-like motion
   ============================================================================ */

// ============================================================================
// 1. NAVIGATION SETTLING EFFECT
// ============================================================================

class NavigationController {
    constructor() {
        this.nav = document.getElementById('navigation');
        this.sections = document.querySelectorAll('section[id]');
        this.links = document.querySelectorAll('.nav__link');
        this.indicator = document.querySelector('.nav__indicator');
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll());
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.onLinkClick(e));
        });
    }

    onScroll() {
        // Scroll-linked navigation settling effect
        const scrollTop = window.scrollY;
        
        // Change nav background opacity based on scroll
        if (scrollTop > 100) {
            this.nav.classList.add('is-scrolled');
        } else {
            this.nav.classList.remove('is-scrolled');
        }

        // Update active section indicator
        this.updateActiveSection();
    }

    updateActiveSection() {
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active link
        this.links.forEach(link => {
            const href = link.getAttribute('href').slice(1);
            if (href === currentSection) {
                link.style.color = 'var(--color-primary-dark)';
            } else {
                link.style.color = '';
            }
        });
    }

    onLinkClick(e) {
        // Smooth scroll is handled by CSS scroll-behavior
        // but we can add haptic feedback if needed
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
}

// ============================================================================
// 2. SCROLL-LINKED "BREATHING" SECTIONS
// ============================================================================

class ScrollBreathingEffect {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Subtle padding expansion
                    entry.target.style.paddingTop = 
                        `calc(${entry.target.style.paddingTop || '3rem'} + 20px)`;
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => observer.observe(section));
    }
}

// ============================================================================
// 3. LIVING MENU INTERACTION
// ============================================================================

class MenuController {
    constructor() {
        this.tabs = document.querySelectorAll('.menu__tab');
        this.categories = document.querySelectorAll('.menu__category');
        
        this.init();
    }

    init() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                this.switchCategory(tab);
            });
        });
    }

    switchCategory(clickedTab) {
        const category = clickedTab.dataset.category;

        // Update active tab with smooth indicator and ARIA attributes
        this.tabs.forEach(tab => {
            tab.classList.remove('menu__tab--active');
            tab.setAttribute('aria-selected', 'false');
        });
        clickedTab.classList.add('menu__tab--active');
        clickedTab.setAttribute('aria-selected', 'true');

        // Update visible category with fade and ARIA hidden attribute
        this.categories.forEach(cat => {
            if (cat.dataset.category === category) {
                cat.classList.add('menu__category--active');
                cat.removeAttribute('hidden');
                // Re-trigger stagger animation
                this.staggerMenuItems(cat);
            } else {
                cat.classList.remove('menu__category--active');
                cat.setAttribute('hidden', '');
            }
        });

        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(15);
        }
    }

    staggerMenuItems(container) {
        const items = container.querySelectorAll('.menu__item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 50}ms`;
        });
    }
}

// ============================================================================
// 4. MOBILE MENU BUTTON PULSE (Only once on page load)
// ============================================================================

class MobileMenuButton {
    constructor() {
        this.btn = document.getElementById('mobileMenuBtn');
        this.init();
    }

    init() {
        // Pulse animation plays once on load (via CSS animation)
        this.btn.addEventListener('click', () => {
            this.openMenu();
        });
    }

    openMenu() {
        // Update aria-expanded attribute
        const isExpanded = this.btn.getAttribute('aria-expanded') === 'true';
        this.btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        
        // Smooth scroll to menu section
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
        
        // Reset aria-expanded after navigation
        setTimeout(() => {
            this.btn.setAttribute('aria-expanded', 'false');
        }, 1000);
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }
}

// ============================================================================
// 5. HOVER LIFT EFFECTS (Cards)
// ============================================================================

class HoverLiftEffect {
    constructor() {
        this.cards = document.querySelectorAll('.signature__card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// ============================================================================
// 6. PAGE-TURN IMAGE TRANSITIONS
// ============================================================================

class PageTurnTransition {
    constructor() {
        this.spaceImages = document.querySelectorAll('.space__image-wrapper');
        this.init();
    }

    init() {
        this.spaceImages.forEach(img => {
            img.addEventListener('mouseenter', () => {
                this.applyPageTurnEffect(img);
            });
        });
    }

    applyPageTurnEffect(element) {
        const image = element.querySelector('img');
        if (image) {
            image.style.transform = 'scale(1.03) rotate(1deg)';
            image.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
        }
    }
}

// ============================================================================
// 7. LAZY LOADING IMAGES WITH FADE-IN
// ============================================================================

class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '400px'
            });

            this.images.forEach(img => observer.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        // Check if image is already loaded (cached or local)
        if (img.complete && img.naturalHeight !== 0) {
            // Image already loaded, show immediately
            img.style.opacity = '1';
        } else {
            // Image not loaded yet, fade in when ready
            img.style.opacity = '0';
            img.style.transition = 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
            
            img.onerror = () => {
                // Fallback image on load error
                img.style.opacity = '0.5';
            };
        }
    }
}

// ============================================================================
// 8. SMOOTH SCROLL WITH INTENTIONAL PAUSES
// ============================================================================

class ScrollPaceController {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        // CSS scroll-behavior: smooth handles most of this
        // This adds subtle detection for momentum scrolling pauses
        
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            document.body.style.scrollBehavior = 'auto';
            
            scrollTimeout = setTimeout(() => {
                document.body.style.scrollBehavior = 'smooth';
            }, 150);
        });
    }
}

// ============================================================================
// 9. TYPOGRAPHY MICRO-DETAILS
// ============================================================================

class TypographyEffects {
    constructor() {
        this.titles = document.querySelectorAll('h2');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('title-active');
                }
            });
        }, {
            threshold: 0.5
        });

        this.titles.forEach(title => {
            observer.observe(title);
        });
    }
}

// ============================================================================
// 10. TOUCH INTERACTIONS FOR MOBILE
// ============================================================================

class TouchInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.signature__card');
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);
    }

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        
        // Left swipe
        if (Math.abs(diff) > 50) {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }
}

// ============================================================================
// 11. REDUCED MOTION DETECTION
// ============================================================================

class ReducedMotionHandler {
    constructor() {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.prefersReducedMotion) {
            this.disableAnimations();
        }
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================================================
// 12. ACCESSIBILITY FOCUS MANAGEMENT
// ============================================================================

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Show focus outline on keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
}

// ============================================================================
// 13. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all controllers
    new NavigationController();
    new ScrollBreathingEffect();
    new MenuController();
    new MobileMenuButton();
    new HoverLiftEffect();
    new PageTurnTransition();
    new LazyLoadImages();
    new ScrollPaceController();
    new TypographyEffects();
    new TouchInteractions();
    new ReducedMotionHandler();
    new AccessibilityManager();
    new ContactFormController();

    // Log initialization (development only)
    console.log('✨ Ember Café – Micro-interactions initialized');
});

// ============================================================================
// 14. PERFORMANCE OPTIMIZATION
// ============================================================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for high-frequency events
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

/* ============================
   CONTACT FORM HANDLER
   ============================ */

class ContactFormController {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.inquiryInput = document.getElementById('inquiry-type');
        this.messageInput = document.getElementById('message');
        this.submitBtn = document.getElementById('submit-btn');
        this.formMessage = document.getElementById('form-message');
        this.charCount = document.getElementById('char-count');
        
        this.nameError = document.getElementById('name-error');
        this.emailError = document.getElementById('email-error');
        this.inquiryError = document.getElementById('inquiry-error');
        this.messageError = document.getElementById('message-error');
        
        this.init();
    }
    
    init() {
        
        emailjs.init('a671ed45-5144-4f14-bb0d-6de13b4f77b44');
        
        // Character counter for message field
        this.messageInput.addEventListener('input', () => {
            this.charCount.textContent = this.messageInput.value.length;
        });
        
        // Real-time validation on blur for Name field
        this.nameInput.addEventListener('blur', () => {
            if (!this.nameInput.value.trim()) {
                this.showError(this.nameInput, this.nameError, '✕ Name is required');
            } else {
                this.clearError(this.nameInput, this.nameError);
            }
        });
        
        this.nameInput.addEventListener('input', () => {
            if (this.nameInput.value.trim() && this.nameInput.classList.contains('error')) {
                this.clearError(this.nameInput, this.nameError);
            }
        });
        
        // Real-time validation on blur for Email field
        this.emailInput.addEventListener('blur', () => {
            if (!this.emailInput.value) {
                this.showError(this.emailInput, this.emailError, '✕ Email is required');
            } else if (!this.validateEmail(this.emailInput.value)) {
                this.showError(this.emailInput, this.emailError, '✕ Enter a valid email (e.g., user@example.com)');
            } else {
                this.clearError(this.emailInput, this.emailError);
            }
        });
        
        this.emailInput.addEventListener('input', () => {
            if (this.validateEmail(this.emailInput.value) && this.emailInput.classList.contains('error')) {
                this.clearError(this.emailInput, this.emailError);
            }
        });
        
        // Real-time validation for inquiry type dropdown
        this.inquiryInput.addEventListener('change', () => {
            if (this.inquiryInput.value) {
                this.clearError(this.inquiryInput, this.inquiryError);
            }
        });
        
        // Real-time validation for message field
        this.messageInput.addEventListener('blur', () => {
            if (!this.messageInput.value.trim()) {
                this.showError(this.messageInput, this.messageError, '✕ Message is required');
            } else if (this.messageInput.value.trim().length < 10) {
                this.showError(this.messageInput, this.messageError, '✕ Message must be at least 10 characters');
            } else {
                this.clearError(this.messageInput, this.messageError);
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            const value = this.messageInput.value.trim();
            if (value && value.length >= 10 && this.messageInput.classList.contains('error')) {
                this.clearError(this.messageInput, this.messageError);
            }
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    validateEmail(email) {
        return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    validateForm() {
        let isValid = true;
        
        // Name validation
        if (!this.nameInput.value.trim()) {
            this.showError(this.nameInput, this.nameError, '✕ Name is required');
            isValid = false;
        } else {
            this.clearError(this.nameInput, this.nameError);
        }
        
        // Email validation
        if (!this.emailInput.value.trim()) {
            this.showError(this.emailInput, this.emailError, '✕ Email is required');
            isValid = false;
        } else if (!this.validateEmail(this.emailInput.value)) {
            this.showError(this.emailInput, this.emailError, '✕ Enter a valid email address');
            isValid = false;
        } else {
            this.clearError(this.emailInput, this.emailError);
        }
        
        // Inquiry type validation
        if (!this.inquiryInput.value) {
            this.showError(this.inquiryInput, this.inquiryError, '✕ Please select an inquiry type');
            isValid = false;
        } else {
            this.clearError(this.inquiryInput, this.inquiryError);
        }
        
        // Message validation
        if (!this.messageInput.value.trim()) {
            this.showError(this.messageInput, this.messageError, '✕ Message is required');
            isValid = false;
        } else if (this.messageInput.value.trim().length < 10) {
            this.showError(this.messageInput, this.messageError, '✕ Message must be at least 10 characters');
            isValid = false;
        } else {
            this.clearError(this.messageInput, this.messageError);
        }
        
        // Scroll to first error if validation fails
        if (!isValid) {
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
        
        return isValid;
    }
    
    showError(input, errorElement, message) {
        input.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    clearError(input, errorElement) {
        input.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    async handleSubmit() {
        // Hide any previous messages
        this.formMessage.style.display = 'none';
        this.formMessage.classList.remove('success', 'error');
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Send email via EmailJS
            const templateParams = {
                from_name: this.nameInput.value.trim(),
                from_email: this.emailInput.value.trim(),
                phone: this.phoneInput.value.trim() || 'Not provided',
                inquiry_type: this.inquiryInput.options[this.inquiryInput.selectedIndex].text,
                message: this.messageInput.value.trim()
            };
            
            const response = await emailjs.send(
                'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
                templateParams
            );
            
            // Track successful submission in GA4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    event_category: 'Contact',
                    event_label: templateParams.inquiry_type,
                    value: 1
                });
            }
            
            // Show success message
            this.showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            this.form.reset();
            this.charCount.textContent = '0';
            
        } catch (error) {
            console.error('EmailJS error:', error);
            
            // Track error in GA4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_error', {
                    event_category: 'Contact',
                    event_label: error.text || 'Unknown error',
                    value: 0
                });
            }
            
            // Show error message
            this.showMessage('Oops! Something went wrong. Please try again or email us directly at hello@embercafe.com', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.textContent = 'Sending...';
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.textContent = 'Send Message';
            this.submitBtn.disabled = false;
        }
    }
    
    showMessage(text, type) {
        this.formMessage.textContent = text;
        this.formMessage.classList.add(type);
        this.formMessage.style.display = 'block';
        
        // Scroll to message
        this.formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}


