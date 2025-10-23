// Accessibility widget functionality
class AccessibilityWidget {
    constructor() {
        this.init();
        this.fontSizeLevel = 0; // Track font size level: -2 to 2
        this.isHighContrast = false;
        this.isLinksHighlighted = false;
        this.isDyslexicFont = false;
        this.isFocusMode = false;
    }

    init() {
        this.menu = document.querySelector('.accessibility-menu');
        this.toggle = document.querySelector('.accessibility-toggle');
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Load saved preferences
        this.loadSavedPreferences();
    }

    initializeEventListeners() {
        // Toggle menu
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
            // Alt + A to toggle accessibility menu
            if (e.altKey && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                this.toggleMenu();
            }
        });

        // Menu keyboard navigation
        this.menu.addEventListener('keydown', (e) => {
            const focusableElements = this.menu.querySelectorAll('button:not([disabled])');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    toggleMenu() {
        const isOpen = this.menu.getAttribute('aria-hidden') === 'false';
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menu.setAttribute('aria-hidden', 'false');
        this.toggle.setAttribute('aria-expanded', 'true');
        this.menu.style.animation = 'menuFadeIn 0.3s ease forwards';
    }

    closeMenu() {
        this.menu.style.animation = 'menuFadeOut 0.3s ease forwards';
        setTimeout(() => {
            this.menu.setAttribute('aria-hidden', 'true');
            this.toggle.setAttribute('aria-expanded', 'false');
        }, 290);
    }

    adjustFontSize(direction) {
        // Limit font size adjustments between -2 and 2
        if ((direction > 0 && this.fontSizeLevel < 2) || (direction < 0 && this.fontSizeLevel > -2)) {
            this.fontSizeLevel += direction;
            const newSize = 16 * (1 + (this.fontSizeLevel * 0.15)); // 15% change per level
            document.documentElement.style.setProperty('--base-font-size', `${newSize}px`);
            this.savePreferences();
        }

        // Update button states
        const increaseBtn = document.querySelector('[data-action="increase-font"]');
        const decreaseBtn = document.querySelector('[data-action="decrease-font"]');
        
        if (increaseBtn) increaseBtn.disabled = this.fontSizeLevel >= 2;
        if (decreaseBtn) decreaseBtn.disabled = this.fontSizeLevel <= -2;
    }

    toggleHighContrast() {
        this.isHighContrast = !this.isHighContrast;
        document.body.classList.toggle('high-contrast', this.isHighContrast);
        this.savePreferences();
    }

    toggleLinks() {
        this.isLinksHighlighted = !this.isLinksHighlighted;
        document.body.classList.toggle('highlight-links', this.isLinksHighlighted);
        this.savePreferences();
    }

    toggleDyslexiaFont() {
        this.isDyslexicFont = !this.isDyslexicFont;
        document.body.classList.toggle('dyslexia-font', this.isDyslexicFont);
        this.savePreferences();
    }

    toggleFocusMode() {
        this.isFocusMode = !this.isFocusMode;
        document.body.classList.toggle('focus-mode', this.isFocusMode);
        this.savePreferences();
    }

    savePreferences() {
        const preferences = {
            fontSizeLevel: this.fontSizeLevel,
            isHighContrast: this.isHighContrast,
            isLinksHighlighted: this.isLinksHighlighted,
            isDyslexicFont: this.isDyslexicFont,
            isFocusMode: this.isFocusMode
        };
        localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
    }

    loadSavedPreferences() {
        const saved = localStorage.getItem('accessibilityPreferences');
        if (saved) {
            const preferences = JSON.parse(saved);
            
            // Apply saved font size
            if (preferences.fontSizeLevel) {
                this.fontSizeLevel = preferences.fontSizeLevel;
                const newSize = 16 * (1 + (this.fontSizeLevel * 0.15));
                document.documentElement.style.setProperty('--base-font-size', `${newSize}px`);
            }
            
            // Apply other preferences
            if (preferences.isHighContrast) this.toggleHighContrast();
            if (preferences.isLinksHighlighted) this.toggleLinks();
            if (preferences.isDyslexicFont) this.toggleDyslexiaFont();
            if (preferences.isFocusMode) this.toggleFocusMode();
        }
    }

    getTooltipText(action, lang) {
        const tooltips = {
            menu: {
                en: 'Accessibility Menu (Alt + A)',
                he: 'תפריט נגישות (Alt + A)',
                ru: 'Меню доступности (Alt + A)'
            },
            increaseFont: {
                en: 'Increase Font Size',
                he: 'הגדל גודל טקסט',
                ru: 'Увеличить размер шрифта'
            },
            decreaseFont: {
                en: 'Decrease Font Size',
                he: 'הקטן גודל טקסט',
                ru: 'Уменьшить размер шрифта'
            },
            contrast: {
                en: 'Toggle High Contrast',
                he: 'החלף ניגודיות גבוהה',
                ru: 'Переключить высокий контраст'
            },
            links: {
                en: 'Highlight Links',
                he: 'הדגש קישורים',
                ru: 'Выделить ссылки'
            },
            dyslexia: {
                en: 'Toggle Dyslexia Font',
                he: 'החלף גופן דיסלקציה',
                ru: 'Переключить шрифт для дислексии'
            },
            focus: {
                en: 'Toggle Focus Mode',
                he: 'החלף מצב מיקוד',
                ru: 'Переключить режим фокусировки'
            }
        };

        return tooltips[action][lang] || tooltips[action]['en'];
    }
}

// Initialize the widget when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityWidget = new AccessibilityWidget();
});