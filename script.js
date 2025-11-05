// script.js

// ================================
// THEME TOGGLE
// ================================
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ================================
// PRINT BUTTON
// ================================
const printBtn = document.getElementById('print-btn');
printBtn.addEventListener('click', () => {
    window.print();
});

// ================================
// SECTION TOGGLE (FOR MOBILE VIEW)
// ================================
const sectionToggles = document.querySelectorAll('.section-toggle');

sectionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        const contentId = toggle.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const icon = toggle.querySelector('.toggle-icon');

        toggle.setAttribute('aria-expanded', !isExpanded);
        content.setAttribute('aria-hidden', isExpanded);
        icon.textContent = isExpanded ? '+' : '−';

        if (isExpanded) {
            content.style.maxHeight = content.scrollHeight + 'px';
            requestAnimationFrame(() => {
                content.style.maxHeight = '0';
            });
        } else {
            content.style.maxHeight = '0';
            requestAnimationFrame(() => {
                content.style.maxHeight = content.scrollHeight + 'px';
            });

            setTimeout(() => {
                content.style.maxHeight = 'none';
            }, 300);
        }
    });
});

// ================================
// INITIALIZE SECTIONS FOR MOBILE
// ================================
function initializeSections() {
    const isMobile = window.innerWidth <= 768;
    const contents = document.querySelectorAll('.section-content');

    contents.forEach(content => {
        const toggle = content.parentElement.querySelector('.section-toggle');
        if (!toggle) return; // skip if missing

        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        if (isMobile) {
            if (!isExpanded) {
                content.setAttribute('aria-hidden', 'true');
                content.style.maxHeight = '0';
                content.style.overflow = 'hidden';
            } else {
                content.setAttribute('aria-hidden', 'false');
                content.style.maxHeight = 'none';
            }
        } else {
            content.setAttribute('aria-hidden', 'false');
            content.style.maxHeight = 'none';
            content.style.overflow = 'visible';
        }
    });
}

initializeSections();

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initializeSections();
        createExpandCollapseAll();
    }, 250);
});

// ================================
// SMOOTH FADE-IN FOR SECTIONS
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ================================
// KEYBOARD SHORTCUTS
// ================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
    }

    // Ctrl/Cmd + D to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
});

// ================================
// EXPAND / COLLAPSE ALL (MOBILE)
// ================================
function createExpandCollapseAll() {
    const isMobile = window.innerWidth <= 768;
    const existingControl = document.getElementById('expand-collapse-all');

    if (isMobile && sectionToggles.length > 0) {
        if (existingControl) return;

        const control = document.createElement('button');
        control.id = 'expand-collapse-all';
        control.textContent = 'Expand All';
        control.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-family: var(--font-primary);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            z-index: 999;
            transition: var(--transition-base);
        `;

        let allExpanded = false;

        control.addEventListener('click', () => {
            allExpanded = !allExpanded;
            control.textContent = allExpanded ? 'Collapse All' : 'Expand All';

            sectionToggles.forEach(toggle => {
                const currentState = toggle.getAttribute('aria-expanded') === 'true';
                if (currentState !== allExpanded) {
                    toggle.click();
                }
            });
        });

        document.body.appendChild(control);
    } else if (existingControl) {
        existingControl.remove();
    }
}

createExpandCollapseAll();
