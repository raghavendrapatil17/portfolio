// Command Palette
function initializeCommandPalette() {
    const overlay = document.getElementById('cmdk');
    const input = document.getElementById('cmdkInput');
    const results = document.getElementById('cmdkResults');
    if (!overlay || !input || !results) return;

    const items = buildCommandItems();

    function openPalette() {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        input.value = '';
        renderResults(items);
        setTimeout(() => input.focus(), 10);
    }

    function closePalette() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function renderResults(list) {
        results.innerHTML = '';
        list.forEach((item, idx) => {
            const el = document.createElement('div');
            el.className = 'cmdk-item';
            el.setAttribute('role', 'option');
            el.setAttribute('data-index', idx);
            el.innerHTML = `<span>${item.icon || ''} ${item.label}</span><span class="meta">${item.meta}</span>`;
            el.addEventListener('click', () => selectItem(item));
            results.appendChild(el);
        });
        activeIndex = 0;
        highlightActive();
    }

    function selectItem(item) {
        closePalette();
        if (item.href) {
            if (item.href.startsWith('#')) {
                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.open(item.href, item.external ? '_blank' : '_self');
            }
        } else if (item.action) {
            item.action();
        }
    }

    function buildCommandItems() {
        const items = [
            { label: 'Go to Home', meta: 'Section', href: '#home', icon: '🏠' },
            { label: 'Go to About', meta: 'Section', href: '#about', icon: '👨‍💻' },
            { label: 'Go to Skills', meta: 'Section', href: '#skills', icon: '⚡' },
            { label: 'Go to Projects', meta: 'Section', href: '#projects', icon: '🚀' },
            { label: 'Go to Experience', meta: 'Section', href: '#experience', icon: '💼' },
            { label: 'Go to Contact', meta: 'Section', href: '#contact', icon: '📧' },
        ];
        document.querySelectorAll('.project-card .project-header h3').forEach(h3 => {
            const title = h3.textContent.trim();
            items.push({ label: `Open: ${title}`, meta: 'Project', href: '#projects', icon: '📁' });
        });
        return items;
    }

    let activeIndex = 0;
    function highlightActive() {
        const els = results.querySelectorAll('.cmdk-item');
        els.forEach(el => el.classList.remove('active'));
        if (els[activeIndex]) els[activeIndex].classList.add('active');
    }

    function onKeyDown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            overlay.classList.contains('active') ? closePalette() : openPalette();
        } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closePalette();
        } else if (overlay.classList.contains('active')) {
            if (e.key === 'ArrowDown') { activeIndex = Math.min(activeIndex + 1, results.children.length - 1); highlightActive(); }
            if (e.key === 'ArrowUp') { activeIndex = Math.max(activeIndex - 1, 0); highlightActive(); }
            if (e.key === 'Enter') {
                const item = buildCommandItems()[activeIndex] || items[activeIndex];
                const el = results.children[activeIndex];
                const label = el ? el.textContent : '';
                // Re-find item by label
                const selected = buildCommandItems().find(i => label && (label.includes(i.label)) ) || items[activeIndex];
                if (selected) selectItem(selected);
            }
        }
    }

    function onInput() {
        const q = input.value.trim().toLowerCase();
        const list = buildCommandItems().filter(i => i.label.toLowerCase().includes(q) || i.meta.toLowerCase().includes(q));
        renderResults(list);
    }

    document.addEventListener('keydown', onKeyDown);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });
    input.addEventListener('input', onInput);

    // Prefill initial
    renderResults(items);
}
// Mobile Navigation Toggle (guarded for legacy markup)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual email service)
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        this.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .nav-link.active {
        color: #2563eb;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .about-text, .contact-info');
    animateElements.forEach(el => observer.observe(el));
});

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Skill bars animation
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize skill bars animation when skills section is visible
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

// Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add any image URLs you want to preload
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Enhanced cursor follower functionality
const cursorFollower = document.querySelector('.cursor-follower');
if (cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// Interactive floating elements with tooltips
document.querySelectorAll('.floating-element').forEach(element => {
    element.addEventListener('mouseenter', () => {
        const tooltip = element.getAttribute('data-tooltip');
        if (tooltip) {
            showTooltip(element, tooltip);
        }
    });
    
    element.addEventListener('mouseleave', () => {
        hideTooltip();
    });
});

// Tooltip functionality
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Interactive tech badges
document.querySelectorAll('.tech-badge').forEach(badge => {
    badge.addEventListener('click', () => {
        const skill = badge.getAttribute('data-skill');
        showSkillInfo(skill);
    });
});

function showSkillInfo(skill) {
    const skillInfo = {
        'Python': 'Python is my primary programming language for data science and machine learning projects.',
        'ML': 'Machine Learning expertise includes supervised learning, unsupervised learning, and deep learning.',
        'React': 'Modern React development with hooks, context, and component-based architecture.',
        'AWS': 'Cloud computing experience with AWS services including EC2, S3, and Lambda.'
    };
    
    const info = skillInfo[skill] || `${skill} is one of my core technologies.`;
    showNotification(info, 'info');
}

// Profile image click animation
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    profileImage.addEventListener('click', () => {
        profileImage.style.animation = 'profileClick 0.6s ease';
        setTimeout(() => {
            profileImage.style.animation = '';
        }, 600);
    });
}

// Add profile click animation
const profileClickStyle = document.createElement('style');
profileClickStyle.textContent = `
    @keyframes profileClick {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(profileClickStyle);

// Enhanced scroll animations
const observerOptions2 = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Stagger animation for child elements
            const children = entry.target.querySelectorAll('.skill-item, .project-card, .timeline-item');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate-in');
                }, index * 100);
            });
        }
    });
}, observerOptions2);

// Enhanced animations for elements
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .about-text, .contact-info, .section-header');
    animateElements.forEach(el => enhancedObserver.observe(el));
});

// Add enhanced animation styles
const enhancedAnimationStyle = document.createElement('style');
enhancedAnimationStyle.textContent = `
    .skill-item,
    .project-card,
    .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .section-header,
    .about-text,
    .contact-info {
        opacity: 0;
        transform: translateX(-30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-header.animate-in,
    .about-text.animate-in,
    .contact-info.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    .skill-category {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .skill-category.animate-in {
        opacity: 1;
        transform: scale(1);
    }
`;
document.head.appendChild(enhancedAnimationStyle);

// Enhanced bubble interactions
function createInteractiveBubbles() {
    const bubbleContainer = document.querySelector('.bubble-container');
    if (!bubbleContainer) return;
    
    // Add click interaction to bubbles
    bubbleContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('bubble')) {
            // Create ripple effect
            createBubbleRipple(e.clientX, e.clientY);
            
            // Show random tech tip
            const techTips = [
                "Python is my favorite programming language!",
                "Machine Learning opens endless possibilities!",
                "Data Science helps solve real-world problems!",
                "Cloud computing scales everything!",
                "React makes web development fun!"
            ];
            const randomTip = techTips[Math.floor(Math.random() * techTips.length)];
            showNotification(randomTip, 'info');
        }
    });
    
    // Create floating particles on mouse move
    let mouseTrailTimeout;
    document.addEventListener('mousemove', (e) => {
        clearTimeout(mouseTrailTimeout);
        createFloatingParticle(e.clientX, e.clientY);
        
        mouseTrailTimeout = setTimeout(() => {
            // Create a burst of particles occasionally
            if (Math.random() < 0.1) {
                createParticleBurst(e.clientX, e.clientY);
            }
        }, 1000);
    });
}

function createBubbleRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${x - 25}px;
        top: ${y - 25}px;
        width: 50px;
        height: 50px;
        border: 2px solid rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: rippleEffect 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function createFloatingParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: floatParticle 2s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
}

function createParticleBurst(x, y) {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, rgba(251, 191, 36, 0.8), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: burstParticle 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            // Animate to end position
            setTimeout(() => {
                particle.style.left = endX + 'px';
                particle.style.top = endY + 'px';
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 50);
    }
}

// Add CSS animations for new effects
const bubbleAnimationStyle = document.createElement('style');
bubbleAnimationStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatParticle {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes burstParticle {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    .bubble:hover {
        background: rgba(255, 255, 255, 0.2) !important;
        transform: scale(1.2);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(bubbleAnimationStyle);

// Skills Tab Functionality
function initializeSkillsTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Animate skill bars when tab becomes active
            setTimeout(() => {
                animateSkillBars();
            }, 300);
        });
    });
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }, index * 200);
    });
}

// Animate stat numbers
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    statNumbers.forEach(stat => {
        // If already visible on load, animate immediately
        const rect = stat.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            const target = parseInt(stat.getAttribute('data-target'));
            animateNumber(stat, target);
        } else {
            observer.observe(stat);
        }
    });
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

// Animate progress bars in about section
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.stat-card .progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = width + '%';
                }, 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Experience filter functionality
function initializeExperienceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter timeline items
            timelineItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Enhanced hover effects for cards
function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.stat-card, .skill-category-card, .timeline-content');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Interactive tag effects
function initializeTagInteractions() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = tag.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (rect.height / 2 - size / 2) + 'px';
            
            tag.style.position = 'relative';
            tag.style.overflow = 'hidden';
            tag.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Show tooltip
            const tagText = tag.textContent;
            showNotification(`You clicked on ${tagText}!`, 'info');
        });
    });
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .fade-in-text {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
`;
document.head.appendChild(rippleStyle);

// Confetti
function triggerConfetti(){
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const count = 140;
    const particles = Array.from({length:count}).map(()=>({
        x: Math.random()*w,
        y: -10,
        r: 2 + Math.random()*3,
        c: `hsl(${Math.random()*360},90%,60%)`,
        s: 2 + Math.random()*3,
        a: Math.random()*Math.PI
    }));
    let frame = 0;
    function draw(){
        ctx.clearRect(0,0,w,h);
        particles.forEach(p=>{
            p.y += p.s;
            p.x += Math.cos(p.a+frame/20);
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle=p.c;
            ctx.fill();
        });
        frame++;
        if (frame < 180) requestAnimationFrame(draw); else ctx.clearRect(0,0,w,h);
    }
    draw();
}

// Scroll Progress Indicator
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Enhanced Navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.getElementById('themeToggle');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Floating Action Button
function initializeFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.querySelector('.fab-menu');
    
    fabMain.addEventListener('click', () => {
        fabMain.classList.toggle('active');
        fabMenu.classList.toggle('active');
    });
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.floating-action-btn')) {
            fabMain.classList.remove('active');
            fabMenu.classList.remove('active');
        }
    });
}

// Project Filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Enhanced Project Cards
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        const actionButtons = card.querySelectorAll('.action-btn');
        
        card.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
        });
        
        card.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateY(20px)';
        });
        
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const project = button.getAttribute('data-project');
                const action = button.classList.contains('view-demo') ? 'demo' : 'code';
                
                // Create ripple effect
                createRippleEffect(button, e);
                
                // Show notification with project-specific messages
                let message = '';
                switch(project) {
                    case 'healify':
                        message = action === 'demo' ? 'Opening Dr HeAlify AI Medical Assistant...' : 'Viewing Dr HeAlify AI source code...';
                        break;
                    case 'plagiarism':
                        message = action === 'demo' ? 'Opening Plagiarism Checker ML tool...' : 'Viewing Plagiarism Checker source code...';
                        break;
                    case 'art-gallery':
                        message = action === 'demo' ? 'Opening Online Art Gallery...' : 'Viewing Art Gallery source code...';
                        break;
                    case 'flavorpoint':
                        message = action === 'demo' ? 'Opening FlavorPoint Restaurant Management...' : 'Viewing FlavorPoint source code...';
                        break;
                    default:
                        message = `Opening ${project} ${action}...`;
                }
                
                showNotification(message, 'info');
            });
        });
    });
}

// Enhanced Contact Form with EmailJS + mailto fallback
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Method tabs
    const tabsWrap = document.querySelector('.contact-tabs');
    let currentMethod = 'email';
    if (tabsWrap) {
        tabsWrap.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn');
            if (!btn) return;
            tabsWrap.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            currentMethod = btn.getAttribute('data-method');
            showNotification(`Using ${currentMethod} method`, 'info');
        });
    }

    // Draft autosave
    const draftKey = 'contact_draft_v1';
    const draft = JSON.parse(localStorage.getItem(draftKey) || '{}');
    if (draft.name) form.querySelector('#name').value = draft.name;
    if (draft.email) form.querySelector('#email').value = draft.email;
    if (draft.subject) form.querySelector('#subject').value = draft.subject;
    if (draft.message) form.querySelector('#message').value = draft.message;

    form.addEventListener('input', () => {
        const d = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            subject: form.querySelector('#subject').value,
            message: form.querySelector('#message').value
        };
        localStorage.setItem(draftKey, JSON.stringify(d));
    });

    // Character counters
    const counters = form.querySelectorAll('.char-counter');
    counters.forEach(counter => {
        const forId = counter.getAttribute('data-for');
        const input = form.querySelector('#' + forId);
        const max = Number(input.getAttribute('maxlength'));
        const update = () => counter.textContent = `${input.value.length}/${max}`;
        input.addEventListener('input', update);
        update();
    });

    // Preview modal wiring
    const previewBtn = document.getElementById('contactPreviewBtn');
    const pvModal = document.getElementById('contactPreview');
    const pvClose = document.getElementById('contactPreviewClose');
    const pvEdit = document.getElementById('pvEdit');
    const pvSend = document.getElementById('pvSend');
    const pvName = document.getElementById('pvName');
    const pvEmail = document.getElementById('pvEmail');
    const pvSubject = document.getElementById('pvSubject');
    const pvMessage = document.getElementById('pvMessage');

    function openPreview(){ pvModal?.classList.add('active'); pvModal?.setAttribute('aria-hidden','false'); }
    function closePreview(){ pvModal?.classList.remove('active'); pvModal?.setAttribute('aria-hidden','true'); }

    if (previewBtn) previewBtn.addEventListener('click', () => {
        if (!validateForm()) return;
        pvName && (pvName.textContent = form.querySelector('#name').value.trim());
        pvEmail && (pvEmail.textContent = form.querySelector('#email').value.trim());
        pvSubject && (pvSubject.textContent = form.querySelector('#subject').value.trim());
        pvMessage && (pvMessage.textContent = form.querySelector('#message').value.trim());
        openPreview();
    });
    if (pvClose) pvClose.addEventListener('click', closePreview);
    if (pvEdit) pvEdit.addEventListener('click', closePreview);

    // Honeypot
    const honey = form.querySelector('#website');

    // Form validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    // Initialize EmailJS once if available
    if (window.emailjs && window.EMAILJS_PUBLIC_KEY) {
        try { window.emailjs.init(window.EMAILJS_PUBLIC_KEY); } catch (_) {}
    }

    // Simple rate limiting (30s)
    const RATE_KEY = 'contact_last_submit_ts';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            if (honey && honey.value) { showNotification('Bot detected', 'error'); return; }
            const now = Date.now();
            const last = Number(localStorage.getItem(RATE_KEY) || 0);
            if (now - last < 30000) {
                const wait = Math.ceil((30000 - (now - last))/1000);
                showNotification(`Please wait ${wait}s before sending again.`, 'error');
                return;
            }
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnIcon.style.display = 'none';
            btnLoader.style.display = 'block';
            
            // Try EmailJS if configured
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const subject = form.querySelector('#subject').value.trim();
            const message = form.querySelector('#message').value.trim();

            const emailJsService = window.EMAILJS_SERVICE_ID;
            const emailJsTemplate = window.EMAILJS_TEMPLATE_ID;
            const ownerEmail = window.OWNER_EMAIL || 'raghupatil9036@gmail.com';

            const sendViaEmailJs = async (recaptchaToken) => {
                if (!emailJsService || !emailJsTemplate || !window.emailjs) return false;
                try {
                    await window.emailjs.send(emailJsService, emailJsTemplate, {
                        from_name: name,
                        from_email: email,
                        to_email: ownerEmail,
                        subject,
                        message,
                        'g-recaptcha-response': recaptchaToken || ''
                    });
                    return true;
                } catch (err) {
                    console.error('EmailJS error:', err);
                    return false;
                }
            };

            let sent = false;
            let recaptchaToken = null;
            try {
                recaptchaToken = await executeRecaptcha('contact_submit');
            } catch (_) { /* ignore token if not available */ }
            try {
                if (currentMethod === 'email') {
                    sent = await sendViaEmailJs(recaptchaToken);
                } else if (currentMethod === 'whatsapp') {
                    const number = (window.CONTACT_SETTINGS?.whatsappNumber || '').replace(/[+\s-]/g,'');
                    const name = form.querySelector('#name').value.trim();
                    const message = form.querySelector('#message').value.trim();
                    const url = `https://wa.me/${number}?text=${encodeURIComponent(`Hi, I'm ${name}.\n\n${message}`)}`;
                    window.open(url, '_blank');
                    sent = true;
                } else if (currentMethod === 'call') {
                    const tel = window.CONTACT_SETTINGS?.telNumber || '+919108969917';
                    window.location.href = `tel:${tel}`;
                    sent = true;
                }
            } catch (_) { sent = false; }

            if (!sent) {
                // Fallback to mailto
                const body = `From: ${name} <${email}>\n\nSubject: ${subject}\n\n${message}`;
                const mailto = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailto;
                sent = true; // assume user client opens mail app
            }

            // Complete UI flow
            showNotification(sent ? 'Message ready to send!' : 'Could not prepare email. Please email me directly.', sent ? 'success' : 'error');
            form.reset();
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnIcon.style.display = 'block';
            btnLoader.style.display = 'none';
            localStorage.removeItem(draftKey);
            if (sent) triggerConfetti();
            if (sent) localStorage.setItem(RATE_KEY, String(Date.now()));
        }
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: slideDown 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

function validateForm() {
    const inputs = document.querySelectorAll('#contactForm input[required], #contactForm textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Contact Item Interactions
function initializeContactItems() {
    const contactItems = document.querySelectorAll('.contact-item[data-tooltip]');
    
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            const tooltip = item.getAttribute('data-tooltip');
            const contactValue = item.querySelector('.contact-value').textContent;
            
            if (tooltip.includes('copy')) {
                navigator.clipboard.writeText(contactValue).then(() => {
                    showNotification(`${contactValue} copied to clipboard!`, 'success');
                }).catch(() => {
                    showNotification('Failed to copy to clipboard', 'error');
                });
            }
            
            // Create ripple effect
            createRippleEffect(item, { clientX: 0, clientY: 0 });
        });
    });
}

// Ripple Effect Function
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX ? event.clientX - rect.left - size / 2 : size / 2;
    const y = event.clientY ? event.clientY - rect.top - size / 2 : size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    createInteractiveBubbles();
    initializeSkillsTabs();
    animateStatNumbers();
    animateProgressBars();
    initializeExperienceFilters();
    initializeCardHoverEffects();
    initializeTagInteractions();
    initializeScrollProgress();
    initializeNavigation();
    initializeFAB();
    initializeProjectFilters();
    initializeProjectCards();
    initializeContactForm();
    initializeContactItems();
    initializeCertificatesLightbox();
    initializeCommandPalette();
    initializeThemeCustomizer();
    initializeProjectQuickView();
    initializeCardTilt();
    initializeRecaptchaIfConfigured();
    
    // Add loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class after everything is loaded
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });
});

// Certificates Lightbox
function initializeCertificatesLightbox() {
    const grid = document.querySelector('.certificates-grid');
    const overlay = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const close = overlay ? overlay.querySelector('.lightbox-close') : null;
    if (!grid || !overlay || !img || !close) return;

    grid.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.tagName === 'IMG') {
            img.src = target.src;
            overlay.classList.add('active');
            overlay.setAttribute('aria-hidden', 'false');
        }
    });

    function hideLightbox() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        img.src = '';
    }

    close.addEventListener('click', hideLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) hideLightbox();
    });
}

// Theme Customizer
function initializeThemeCustomizer() {
    const fab = document.getElementById('themeFab');
    const panel = document.getElementById('themePanel');
    const close = document.getElementById('themeClose');
    const primary = document.getElementById('themePrimary');
    const radius = document.getElementById('themeRadius');
    const radiusValue = document.getElementById('radiusValue');
    const motion = document.getElementById('themeMotion');
    const reset = document.getElementById('themeReset');
    const save = document.getElementById('themeSave');
    if (!fab || !panel) return;

    function applyTheme(cfg){
        if (cfg.primary) document.documentElement.style.setProperty('--primary', cfg.primary);
        if (typeof cfg.radius === 'number') document.documentElement.style.setProperty('--radius', cfg.radius + 'px');
        document.body.classList.toggle('reduce-motion', !!cfg.reduceMotion);
    }

    function loadTheme(){
        const stored = localStorage.getItem('theme_cfg');
        return stored ? JSON.parse(stored) : { primary: '#2563eb', radius: 12, reduceMotion: false };
    }

    function openPanel(){ panel.classList.add('active'); panel.setAttribute('aria-hidden','false'); }
    function closePanel(){ panel.classList.remove('active'); panel.setAttribute('aria-hidden','true'); }

    const cfg = loadTheme();
    applyTheme(cfg);
    if (primary) primary.value = cfg.primary;
    if (radius) { radius.value = cfg.radius; if (radiusValue) radiusValue.textContent = cfg.radius + 'px'; }
    if (motion) motion.checked = cfg.reduceMotion;

    fab.addEventListener('click', openPanel);
    if (close) close.addEventListener('click', closePanel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('active')) closePanel(); });
    panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });

    if (primary) primary.addEventListener('input', () => applyTheme({ primary: primary.value }));
    if (radius) radius.addEventListener('input', () => { if (radiusValue) radiusValue.textContent = radius.value + 'px'; applyTheme({ radius: Number(radius.value) }); });
    if (motion) motion.addEventListener('change', () => applyTheme({ reduceMotion: motion.checked }));
    if (reset) reset.addEventListener('click', () => { const d={ primary:'#2563eb', radius:12, reduceMotion:false }; applyTheme(d); if(primary) primary.value=d.primary; if(radius){radius.value=d.radius; if(radiusValue) radiusValue.textContent=d.radius+'px';} if(motion) motion.checked=d.reduceMotion; localStorage.removeItem('theme_cfg'); });
    if (save) save.addEventListener('click', () => { const c={ primary: primary?.value || '#2563eb', radius: Number(radius?.value || 12), reduceMotion: !!motion?.checked }; localStorage.setItem('theme_cfg', JSON.stringify(c)); showNotification('Theme saved', 'success'); closePanel(); });
}

// Project Quick View
function initializeProjectQuickView(){
    const modal = document.getElementById('quickView');
    const close = document.getElementById('quickViewClose');
    const title = document.getElementById('qvTitle');
    const badge = document.getElementById('qvBadge');
    const desc = document.getElementById('qvDesc');
    const tech = document.getElementById('qvTech');
    const actions = document.getElementById('qvActions');
    if (!modal || !title) return;

    function open(){ modal.classList.add('active'); modal.setAttribute('aria-hidden','false'); }
    function closeM(){ modal.classList.remove('active'); modal.setAttribute('aria-hidden','true'); }

    if (close) close.addEventListener('click', closeM);
    modal.addEventListener('click', e => { if (e.target === modal) closeM(); });
    document.addEventListener('keydown', e => { if (e.key==='Escape' && modal.classList.contains('active')) closeM(); });

    document.querySelectorAll('.project-card').forEach(card => {
        const header = card.querySelector('.project-header h3');
        const cat = card.getAttribute('data-category') || '';
        const description = card.querySelector('.project-description')?.textContent.trim() || '';
        const techTags = [...card.querySelectorAll('.project-tech .tech-tag')].map(t=>t.textContent.trim());
        const links = [...card.querySelectorAll('.project-links a')];
        const actionsWrap = card.querySelector('.project-actions');
        if (!actionsWrap) return;
        const quickBtn = document.createElement('button');
        quickBtn.className = 'action-btn';
        quickBtn.innerHTML = '<i class="fas fa-bolt"></i> Quick View';
        actionsWrap.appendChild(quickBtn);
        quickBtn.addEventListener('click', e => {
            e.preventDefault();
            if (title) title.textContent = header?.textContent.trim() || 'Project';
            if (badge) { badge.textContent = cat.toUpperCase(); }
            if (desc) desc.textContent = description;
            if (tech) { tech.innerHTML = techTags.map(t=>`<span class="tech-tag">${t}</span>`).join(''); }
            if (actions) { actions.innerHTML = links.map(a=>`<a href="${a.href}" target="_blank" class="project-link ${a.classList.contains('primary')?'primary':'secondary'}">${a.innerHTML}</a>`).join(''); }
            open();
        });
    });
}

// Card Tilt Effect
function initializeCardTilt(){
    const cards = document.querySelectorAll('.project-card');
    const maxTilt = 8; // degrees
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
            card.classList.add('tilt');
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.classList.remove('tilt');
        });
    });
}

// Theme toggle functionality (if you want to add dark mode later)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Smooth reveal animation for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.section-header, .about-content, .skills-grid, .projects-grid, .timeline, .contact-content');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize reveal animation
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
});

// Add active class styles
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .section-header,
    .about-content,
    .skills-grid,
    .projects-grid,
    .timeline,
    .contact-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section-header.active,
    .about-content.active,
    .skills-grid.active,
    .projects-grid.active,
    .timeline.active,
    .contact-content.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(revealStyle);

// reCAPTCHA loader and executor
function initializeRecaptchaIfConfigured(){
    const siteKey = window.RECAPTCHA_SITE_KEY;
    if (!siteKey) return;
    if (document.getElementById('grecaptcha-lib')) return;
    const s = document.createElement('script');
    s.id = 'grecaptcha-lib';
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    document.head.appendChild(s);
}

function executeRecaptcha(action){
    return new Promise((resolve, reject) => {
        const siteKey = window.RECAPTCHA_SITE_KEY;
        if (!siteKey || !window.grecaptcha) return resolve(null);
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(siteKey, { action }).then(resolve).catch(()=>resolve(null));
        });
    });
}
