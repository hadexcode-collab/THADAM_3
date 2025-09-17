// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = 'veg';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const radioButtons = themeToggle.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        this.switchTheme(e.target.value);
                    }
                });
            });
        }
    }

    switchTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('veg-theme', 'nonveg-theme');
        
        // Add new theme class
        body.classList.add(`${theme}-theme`);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Save theme preference
        localStorage.setItem('preferred-theme', theme);
        
        // Update theme-specific elements
        this.updateThemeElements(theme);
        
        // Trigger theme change event
        this.dispatchThemeChangeEvent(theme);
    }

    updateThemeElements(theme) {
        // Update floating elements colors based on theme
        const floatingElements = document.querySelectorAll('.floating-spice, .floating-leaf, .floating-vessel');
        floatingElements.forEach(element => {
            if (theme === 'nonveg') {
                element.style.filter = 'hue-rotate(30deg) saturate(1.2)';
            } else {
                element.style.filter = 'none';
            }
        });

        // Update background motifs
        const motifs = document.querySelectorAll('.kolam-pattern, .mandala-pattern, .paisley-pattern');
        motifs.forEach(motif => {
            if (theme === 'nonveg') {
                motif.style.background = '#7c2d12';
            } else {
                motif.style.background = '#0f4c3a';
            }
        });

        // Update hero content colors
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            if (theme === 'nonveg') {
                heroTitle.style.color = '#7c2d12';
            } else {
                heroTitle.style.color = '#0f4c3a';
            }
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('preferred-theme');
        if (savedTheme && (savedTheme === 'veg' || savedTheme === 'nonveg')) {
            // Update radio button
            const radioButton = document.getElementById(`${savedTheme}-theme`);
            if (radioButton) {
                radioButton.checked = true;
            }
            
            // Apply theme
            this.switchTheme(savedTheme);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);
    }

    // Get theme-specific colors
    getThemeColors() {
        const themes = {
            veg: {
                primary: '#0f4c3a',
                background: '#ffffff',
                backgroundSecondary: '#fefdf8',
                accent: '#f59e0b',
                textPrimary: '#111827',
                textSecondary: '#4b5563',
                cardBg: '#ecfdf5',
                border: '#e5e7eb',
                success: '#22c55e'
            },
            nonveg: {
                primary: '#7c2d12',
                background: '#fffbf0',
                backgroundSecondary: '#fef3c7',
                accent: '#d97706',
                textPrimary: '#1f2937',
                textSecondary: '#374151',
                cardBg: '#fed7d7',
                border: '#fde68a',
                success: '#ea580c'
            }
        };

        return themes[this.currentTheme];
    }

    // Apply theme to dynamic elements
    applyThemeToElement(element, properties) {
        const colors = this.getThemeColors();
        
        Object.keys(properties).forEach(prop => {
            const colorKey = properties[prop];
            if (colors[colorKey]) {
                element.style[prop] = colors[colorKey];
            }
        });
    }

    // Theme-aware gradient generator
    generateGradient(type = 'primary') {
        const colors = this.getThemeColors();
        
        const gradients = {
            primary: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            secondary: `linear-gradient(135deg, ${colors.backgroundSecondary}, ${colors.cardBg})`,
            success: `linear-gradient(135deg, ${colors.success}, ${colors.primary})`
        };

        return gradients[type] || gradients.primary;
    }

    // Update CSS custom properties dynamically
    updateCSSProperties() {
        const colors = this.getThemeColors();
        const root = document.documentElement;

        Object.keys(colors).forEach(key => {
            const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVar, colors[key]);
        });
    }
}

// Initialize theme manager when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize uploadHandler if it doesn't exist to prevent errors
    if (!window.uploadHandler) {
        window.uploadHandler = {};
    }
    
    // Add updateTheme function to uploadHandler
    window.uploadHandler.updateTheme = function(theme) {
        console.log("Theme updated to:", theme);
        document.documentElement.setAttribute("data-theme", theme);
        
        // Update any upload-specific theme elements if needed
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            if (theme === 'nonveg') {
                uploadArea.style.borderColor = '#fde68a';
            } else {
                uploadArea.style.borderColor = '#e5e7eb';
            }
        }
    };
    
    window.themeManager = new ThemeManager();
    
    // Listen for theme changes
    document.addEventListener('themeChanged', (e) => {
        console.log(`Theme changed to: ${e.detail.theme}`);
        
        // Update any theme-dependent components
        if (window.uploadHandler) {
            window.uploadHandler.updateTheme(e.detail.theme);
        }
    });
});

// Export for use in other modules
window.ThemeManager = ThemeManager;