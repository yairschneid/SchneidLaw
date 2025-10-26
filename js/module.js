// Import translations
import translations from './translations.js';

// Set default language to Hebrew
let currentLang = 'he';

// Make translations available globally
window.translations = translations;

// Function to apply translations
function applyTranslations() {
    const body = document.body;
    
    // Set direction and font based on language
    if (currentLang === 'he') {
        body.setAttribute('dir', 'rtl');
        body.style.fontFamily = "'Noto Sans Hebrew', Arial, sans-serif";
    } else {
        body.setAttribute('dir', 'ltr');
        body.style.fontFamily = currentLang === 'ru' ? "'Arial', sans-serif" : "'Georgia', serif";
    }

    // Update all text content using translations
    document.querySelectorAll('[data-trans-key]').forEach(element => {
        const key = element.getAttribute('data-trans-key');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Update elements with data-en/data-he/data-ru attributes
    document.querySelectorAll('[data-' + currentLang + ']').forEach(element => {
        const content = element.getAttribute('data-' + currentLang);
        element.textContent = content;
    });
}

// Mobile Menu Toggle
export function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    toggle.innerHTML = mobileMenu.classList.contains('active') ? '✕' : '☰';
}

export function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
    
    const toggle = document.querySelector('.mobile-menu-toggle');
    toggle.innerHTML = '☰';
}

// Helper functions to get flag SVGs
function getAmericanFlag() {
    return `<svg class="flag-icon" width="24" height="16" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#fff"/>
        <g fill="#bf0a30">
            <rect y="0" width="24" height="1.23"/>
            <rect y="2.46" width="24" height="1.23"/>
            <rect y="4.92" width="24" height="1.23"/>
            <rect y="7.38" width="24" height="1.23"/>
            <rect y="9.84" width="24" height="1.23"/>
            <rect y="12.3" width="24" height="1.23"/>
            <rect y="14.76" width="24" height="1.24"/>
        </g>
        <rect width="12" height="8.615" fill="#002868"/>
        <g fill="#fff">
            <circle cx="2.4" cy="1.8" r=".5"/>
            <circle cx="4.8" cy="1.8" r=".5"/>
            <circle cx="7.2" cy="1.8" r=".5"/>
            <circle cx="9.6" cy="1.8" r=".5"/>
            <circle cx="3.6" cy="3.4" r=".5"/>
            <circle cx="6" cy="3.4" r=".5"/>
            <circle cx="8.4" cy="3.4" r=".5"/>
            <circle cx="2.4" cy="5" r=".5"/>
            <circle cx="4.8" cy="5" r=".5"/>
            <circle cx="7.2" cy="5" r=".5"/>
            <circle cx="9.6" cy="5" r=".5"/>
            <circle cx="3.6" cy="6.6" r=".5"/>
            <circle cx="6" cy="6.6" r=".5"/>
            <circle cx="8.4" cy="6.6" r=".5"/>
        </g>
    </svg>`;
}

function getIsraeliFlag() {
    return `<svg class="flag-icon" width="24" height="16" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#fff"/>
        <rect y="2" width="24" height="3" fill="#0038b8"/>
        <rect y="11" width="24" height="3" fill="#0038b8"/>
        <path d="M12 4.5L9 9.5h6z" fill="#0038b8"/>
        <path d="M12 11.5L9 6.5h6z" fill="#0038b8"/>
    </svg>`;
}

function getRussianFlag() {
    return `<svg class="flag-icon" width="24" height="16" viewBox="0 0 24 16">
        <rect width="24" height="16" fill="#fff"/>
        <rect y="5.33" width="24" height="5.33" fill="#0039A6"/>
        <rect y="10.66" width="24" height="5.33" fill="#D52B1E"/>
    </svg>`;
}

// Language Toggle Function
export function changeLanguage(lang) {
    currentLang = lang;
    
    // Update UI based on language
    const body = document.body;
    const selectedFlag = document.getElementById('selectedFlag');
    
    // Update language-specific settings
    switch(lang) {
        case 'en':
            body.setAttribute('dir', 'ltr');
            body.style.fontFamily = "'Georgia', serif";
            selectedFlag.innerHTML = getIsraeliFlag();
            break;
            
        case 'he':
            body.setAttribute('dir', 'rtl');
            body.style.fontFamily = "'Noto Sans Hebrew', Arial, sans-serif";
            selectedFlag.innerHTML = getAmericanFlag();
            break;
            
        case 'ru':
            body.setAttribute('dir', 'ltr');
            body.style.fontFamily = "'Arial', sans-serif";
            selectedFlag.innerHTML = getRussianFlag();
            break;
    }

    // Apply translations
    applyTranslations();
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Close dropdown
    document.getElementById('languageOptions').style.display = 'none';
}

// Dropdown functionality
export function toggleDropdown(event) {
    event.stopPropagation();
    const options = document.getElementById('languageOptions');
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

// Scroll reveal animation
function revealOnScroll() {
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('revealed');
        }
    });
}

// Event listeners setup
export function initializeModule() {
    // Set default language to Hebrew
    currentLang = 'he';
    
    // Set initial Hebrew language properties
    const body = document.body;
    body.setAttribute('dir', 'rtl');
    body.style.fontFamily = "'Noto Sans Hebrew', Arial, sans-serif";
    
    // Set initial flag to American flag since we're in Hebrew mode
    const selectedFlag = document.getElementById('selectedFlag');
    if (selectedFlag) {
        selectedFlag.innerHTML = getAmericanFlag();
    }

    // Apply initial translations
    applyTranslations();

    // Run other initializations
    revealOnScroll();
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && savedLang !== 'he') {
        changeLanguage(savedLang);
    }

    // Add scroll event listener
    window.addEventListener('scroll', revealOnScroll);

    // Close dropdown if clicked outside
    window.addEventListener('click', function() {
        const options = document.getElementById('languageOptions');
        if (options) {
            options.style.display = 'none';
        }
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}