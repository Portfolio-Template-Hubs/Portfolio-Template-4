// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.glass-nav');
let lastScroll = 0;

// Check if mobile device
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
};

// Adjust scroll offset for mobile
const getScrollOffset = () => {
    return isMobile() ? 70 : 100;
};

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = getScrollOffset();
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking a link
            if (navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Header scroll effect
// Remove header scroll effect
// window.addEventListener('scroll', () => {
//     const currentScroll = window.pageYOffset;
    
//     // Add/remove scrolled class
//     if (currentScroll > 50) {
//         header.classList.add('scrolled');
//     } else {
//         header.classList.remove('scrolled');
//     }
    
//     // Hide/show header on scroll
//     if (currentScroll > lastScroll && currentScroll > 100) {
//         header.style.transform = 'translateY(-100%)';
//     } else {
//         header.style.transform = 'translateY(0)';
//     }
    
//     lastScroll = currentScroll;
// });

// Mobile menu toggle with animation
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-menu-toggle') && !e.target.closest('.nav-links')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced scroll animations with stagger effect
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Trigger animations when element is intersecting or when scrolling up past it
        if (entry.isIntersecting || 
            entry.boundingClientRect.top < window.innerHeight ||
            entry.boundingClientRect.bottom > 0) {
            entry.target.classList.add('visible');
            
            // Add stagger effect to child elements
            if (entry.target.classList.contains('skills-grid') || 
                entry.target.classList.contains('projects-grid')) {
                const cards = entry.target.querySelectorAll('.skill-card, .project-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                        // Add bounce effect for project cards
                        if (card.classList.contains('project-card')) {
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6)';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        }
                    }, index * 150);
                });
            }
            
            // Add new animation effects for other elements
            if (entry.target.classList.contains('hero-text')) {
                entry.target.style.animation = 'slide-in-left 0.8s ease forwards';
            }
            if (entry.target.classList.contains('hero-image')) {
                entry.target.style.animation = 'zoom-in 0.8s ease forwards';
            }
            if (entry.target.classList.contains('about-text')) {
                entry.target.style.animation = 'fade-in 0.8s ease forwards';
            }
            if (entry.target.classList.contains('about-stats')) {
                entry.target.style.animation = 'slide-in-right 0.8s ease forwards';
            }
        }
    });
}, observerOptions);

// Add hover/touch tilt effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    function handleTilt(e) {
        const rect = card.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
        card.style.boxShadow = `0 ${Math.abs(angleY)*2}px ${Math.abs(angleX)*3}px rgba(0,0,0,0.2)`;
        card.style.filter = `brightness(${1 + (Math.abs(angleX)+Math.abs(angleY))/100})`;
    }
    
    function resetTilt() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow-lg)';
        card.style.filter = 'brightness(1)';
        card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
    
    // Mouse events
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    
    // Touch events
    card.addEventListener('touchmove', handleTilt);
    card.addEventListener('touchend', resetTilt);
});

// Observe all sections and cards
document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('skills') && !section.classList.contains('projects')) {
        section.classList.add('fade-in');
        
        // Special handling for contact section
        if (section.classList.contains('contact')) {
            const contactForm = section.querySelector('.contact-form');
            const contactInfo = section.querySelector('.contact-info');
            
            observer.observe(section);
            
            // Add visible class when section comes into view
            section.addEventListener('animationend', () => {
                if (contactForm) {
                    contactForm.classList.add('visible');
                    contactForm.style.opacity = '1';
                    contactForm.style.visibility = 'visible';
                }
                if (contactInfo) {
                    contactInfo.classList.add('visible');
                    contactInfo.style.opacity = '1';
                    contactInfo.style.visibility = 'visible';
                }
            }, { once: true });
        }
        
        // Add specific animations for each section
        if (section.classList.contains('hero')) {
            section.querySelector('.hero-text')?.classList.add('slide-in-left');
            section.querySelector('.hero-image')?.classList.add('zoom-in');
        }
        if (section.classList.contains('about')) {
            section.querySelector('.about-text')?.classList.add('fade-in');
            section.querySelector('.about-stats')?.classList.add('slide-in-right');
        }
        if (section.classList.contains('contact')) {
            section.querySelector('.contact-form')?.classList.add('float-in');
            section.querySelector('.contact-info')?.classList.add('glow-in');
        }
    }
    observer.observe(section);
});

// Make skills and projects sections immediately visible
document.querySelectorAll('.skills, .projects').forEach(section => {
    section.style.opacity = '1';
    section.style.visibility = 'visible';
});

document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.style.opacity = '1';
    card.style.visibility = 'visible';
});

// Enhanced skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    bar.style.width = '0';
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    bar.style.width = progress;
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                }, 200);
                skillObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillObserver.observe(bar);
});

// Enhanced typing effect for hero section
const heroTitle = document.querySelector('.gradient-text');
const originalText = heroTitle.textContent;
heroTitle.textContent = '';

let charIndex = 0;
function typeText() {
    if (charIndex < originalText.length) {
        heroTitle.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 100);
    }
}

// Start typing effect when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        typeText();
        heroObserver.disconnect();
    }
}, observerOptions);

heroObserver.observe(document.querySelector('.hero'));

// Enhanced form validation and submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    // Add input focus effects
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // Add floating label effect
    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('has-value');
        }
        input.addEventListener('input', () => {
            input.parentElement.classList.toggle('has-value', input.value.trim() !== '');
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const formData = new FormData(contactForm);
        let isValid = true;
        
        formData.forEach((value, key) => {
            if (!value.trim()) {
                isValid = false;
                const input = contactForm.querySelector(`[name="${key}"]`);
                input.classList.add('error');
                input.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            }
        });
        
        if (isValid) {
            // Add loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!';
                submitButton.classList.add('success');
                contactForm.reset();
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('success');
                }, 2000);
            }, 1500);
        }
    });
    
    // Remove error class on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });
    });
}

// Enhanced parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        
        // Add subtle rotation to blob shape
        const blob = hero.querySelector('.blob-shape');
        if (blob) {
            blob.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.05}deg)`;
        }
    }
});

// Add active class to current navigation link
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Add scroll progress bar
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Animation triggers
const animateOnScroll = () => {
    const elements = document.querySelectorAll('[class*="fade-in"], [class*="slide-in"], [class*="zoom-in"], [class*="rotate-in"], [class*="bounce-in"], [class*="flip-in"]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);