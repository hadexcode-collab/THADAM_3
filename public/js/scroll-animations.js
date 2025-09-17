// Scroll Animations System (BOMBON.RS Style)
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.createObserver();
        this.bindScrollEvents();
        this.initializeParallax();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        this.observeElements();
    }

    observeElements() {
        // Wait for DOM to be fully loaded
        const checkAndObserve = () => {
            const elementsToObserve = [
                '.recipe-card',
                '.premium-cta',
                '.confidence-item',
                '.process-step',
                '.ingredient-item',
                '.instruction-item'
            ];

            elementsToObserve.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (!el.classList.contains('observed')) {
                        el.classList.add('observed');
                        this.observer.observe(el);
                    }
                });
            });
        };

        // Initial check
        checkAndObserve();

        // Re-check when new content is added (for dynamic content)
        const contentObserver = new MutationObserver(() => {
            setTimeout(checkAndObserve, 100);
        });

        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    animateElement(element) {
        // Add animation class
        element.classList.add('animate-in');

        // Add specific animations based on element type
        if (element.classList.contains('recipe-card')) {
            this.animateRecipeCard(element);
        } else if (element.classList.contains('premium-cta')) {
            this.animatePremiumCTA(element);
        } else if (element.classList.contains('process-step')) {
            this.animateProcessStep(element);
        }
    }

    animateRecipeCard(card) {
        // Staggered animation for recipe cards
        const cards = Array.from(document.querySelectorAll('.recipe-card'));
        const index = cards.indexOf(card);
        
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
            
            // Add a subtle bounce effect
            card.style.animation = 'cardBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, index * 100);
    }

    animatePremiumCTA(cta) {
        // Special animation for premium CTA
        cta.style.transform = 'translateY(0) scale(1)';
        cta.style.opacity = '1';
        cta.style.animation = 'ctaSlideUp 0.8s ease-out';
    }

    animateProcessStep(step) {
        // Progressive animation for process steps
        step.style.transform = 'translateX(0)';
        step.style.opacity = '1';
        
        // Animate progress bar if present
        const progressBar = step.querySelector('.progress');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 300);
        }
    }

    bindScrollEvents() {
        let ticking = false;

        const updateScrollEffects = () => {
            this.updateParallaxElements();
            this.updateFloatingElements();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    initializeParallax() {
        // Initialize parallax elements
        this.parallaxElements = document.querySelectorAll('.floating-elements, .background-motifs');
    }

    updateParallaxElements() {
        const scrollY = window.pageYOffset;
        
        this.parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateFloatingElements() {
        const scrollY = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-spice, .floating-leaf, .floating-vessel');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.05);
            const rotation = scrollY * 0.1;
            const yPos = Math.sin(scrollY * 0.01 + index) * 10;
            
            element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
    }

    // Smooth scroll to element
    scrollToElement(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Add entrance animation to new elements
    addEntranceAnimation(element, animationType = 'fadeInUp') {
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(animationType);
        
        // Trigger animation
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        }, 50);
    }

    getInitialTransform(animationType) {
        const transforms = {
            fadeInUp: 'translateY(30px)',
            fadeInDown: 'translateY(-30px)',
            fadeInLeft: 'translateX(-30px)',
            fadeInRight: 'translateX(30px)',
            scaleIn: 'scale(0.8)',
            rotateIn: 'rotate(-10deg) scale(0.9)'
        };

        return transforms[animationType] || transforms.fadeInUp;
    }

    // Create floating notification animation
    createFloatingNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `floating-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            color: 'white',
            fontFamily: 'var(--font-secondary)',
            fontWeight: '500',
            zIndex: '1001',
            transform: 'translateX(100%)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        });

        // Set background based on type
        const backgrounds = {
            success: 'linear-gradient(135deg, #22c55e, #16a34a)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)'
        };

        notification.style.background = backgrounds[type] || backgrounds.success;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 50);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 400);
        }, 3000);
    }

    // Stagger animation for multiple elements
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.addEntranceAnimation(element);
            }, index * delay);
        });
    }

    // Cleanup
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Add CSS animations
const animationStyles = `
@keyframes cardBounceIn {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
    }
    60% {
        opacity: 1;
        transform: translateY(-5px) scale(1.02);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes ctaSlideUp {
    0% {
        opacity: 0;
        transform: translateY(50px) scale(0.95);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulseGlow {
    0%, 100% {
        box-shadow: 0 0 20px rgba(15, 76, 58, 0.3);
    }
    50% {
        box-shadow: 0 0 40px rgba(15, 76, 58, 0.6);
    }
}

.floating-notification {
    animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize scroll animations when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});

// Export for use in other modules
window.ScrollAnimations = ScrollAnimations;