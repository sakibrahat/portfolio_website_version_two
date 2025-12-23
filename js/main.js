// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const loadingScreen = document.querySelector('.loading-screen');

// Global variables for performance and state management
window.virtualScroll = {
    currentSection: 0,
    targetSection: 0,
    sections: [],
    totalSections: 4,
    scrollSpeed: 0.1,
    isScrolling: false,
    lastFrameTime: 0,
    fps: 0,
    memoryUsage: 'N/A'
};

// Initialize the app after loading
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio app initializing...');
    
    // Initialize performance monitoring first
    initPerformanceMonitoring();
    
    // Use dynamic loading instead of fixed timeout
    setTimeout(() => {
        // Hide loading screen
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // Initialize components
        initDarkMode();
        initFullpage();
        initAnimations();
        initForm();
        initNestedScrollAnimations();
        initMobileTouchScrolling();
        
        // Show elements after loading
        document.body.style.opacity = '1';
        
        console.log('All components initialized successfully');
    }, 800);
});

// Performance Monitoring System
function initPerformanceMonitoring() {
    // Create performance overlay
    const perfOverlay = document.querySelector('.performance-overlay .perf-stats');
    
    // FPS calculation
    let frameCount = 0;
    let lastTime = performance.now();
    
    function updateFPS() {
        frameCount++;
        const now = performance.now();
        const deltaTime = now - lastTime;
        
        if (deltaTime > 1000) {
            window.virtualScroll.fps = Math.round((frameCount * 1000) / deltaTime);
            frameCount = 0;
            lastTime = now;
            
            // Update memory usage if available
            if (window.performance && window.performance.memory) {
                window.virtualScroll.memoryUsage = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1) + 'MB';
            }
            
            // Update overlay
            const fpsElement = document.querySelector('.fps');
            const memElement = document.querySelector('.mem');
            
            if (fpsElement) {
                fpsElement.textContent = `FPS: ${window.virtualScroll.fps}`;
                fpsElement.parentElement.style.background = 
                    window.virtualScroll.fps < 30 ? 'rgba(255, 0, 0, 0.8)' : 
                    window.virtualScroll.fps < 50 ? 'rgba(255, 165, 0, 0.8)' : 
                    'rgba(0, 0, 0, 0.8)';
            }
            
            if (memElement && window.virtualScroll.memoryUsage) {
                memElement.textContent = `Memory: ${window.virtualScroll.memoryUsage}`;
            }
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    updateFPS();
    
    // Record load time
    window.addEventListener('load', () => {
        const loadTime = ((performance.now() - performance.timing.navigationStart) / 1000).toFixed(1);
        const loadElement = document.querySelector('.load');
        if (loadElement) {
            loadElement.textContent = `Load: ${loadTime}s`;
            window.virtualScroll.loadTime = loadTime;
        }
    });
}

// Dark Mode Functionality
function initDarkMode() {
    // Check if dark mode toggle exists
    if (!darkModeToggle) {
        console.warn('Dark mode toggle element not found');
        return;
    }
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        darkModeToggle.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        // Animate theme change
        gsap.to('body', {
            backgroundColor: newTheme === 'dark' ? '#1a1a2e' : '#f8f9fa',
            color: newTheme === 'dark' ? '#f8f9fa' : '#333',
            duration: 0.5,
            ease: 'power2.out'
        });
        
        // Update laptop screen content if available
        if (typeof updateLaptopScreenTexture === 'function') {
            setTimeout(updateLaptopScreenTexture, 300);
        }
    });
}

// Fullpage.js Initialization
function initFullpage() {
    try {
        if (typeof fullpage === 'undefined') {
            console.error('Fullpage.js library not loaded');
            initFallbackScrolling();
            return;
        }
        
        // Store reference to FullPage.js API
        window.fullpage_api = new fullpage('#fullpage', {
            licenseKey: '8KHTU-9Z5YV-3VJ3C-IK4XN', // Free development license
            autoScrolling: true,
            navigation: false, // Disable default dots since we have custom navigation
            scrollingSpeed: 700,
            easing: 'easeInOutCubic',
            loopBottom: false,
            loopTop: false,
            css3: true,
            paddingTop: '3em',
            paddingBottom: '70px', // Make room for navigation bar
            recordHistory: true,
            scrollBar: false,
            touchSensitivity: 15,
            normalScrollElements: '.contact-form, .section-navigation, .skills-grid, .projects-grid',
            
            // Callbacks
            afterLoad: (origin, destination, direction) => {
                const currentSection = document.querySelector(`.section:nth-child(${destination.index + 1})`);
                if (currentSection) {
                    animateSectionEntrance(currentSection);
                }
                syncLaptopScreenWithScroll(origin, destination);
                updateNavigationState(destination.index + 1); // Update navigation state
            },
            
            onLeave: (origin, destination, direction) => {
                const leavingSection = document.querySelector(`.section:nth-child(${origin.index + 1})`);
                if (leavingSection) {
                    resetSectionAnimations(leavingSection);
                }
                updatePerformanceIndicator();
            }
        });
        
        console.log('Fullpage.js initialized successfully with navigation support');
    } catch (error) {
        console.error('Fullpage.js initialization failed:', error);
        initFallbackScrolling();
    }
}

// Update navigation state
function updateNavigationState(sectionNumber) {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        const buttonSection = parseInt(button.getAttribute('data-section'));
        if (buttonSection === sectionNumber) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update progress bar
    const progress = ((sectionNumber - 1) / 3) * 100;
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
}

// Fallback scrolling if FullPage.js fails
function initFallbackScrolling() {
    console.log('Initializing fallback scrolling...');
    
    // Enable regular scrolling
    document.body.style.overflowY = 'auto';
    document.getElementById('fullpage').style.height = 'auto';
    
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update navigation state
                const sectionIndex = Array.from(document.querySelectorAll('.section')).indexOf(targetElement);
                if (sectionIndex >= 0) {
                    updateNavigationState(sectionIndex + 1);
                }
            }
        });
    });
    
    // Section change detection for fallback mode
    let lastSectionIndex = 1;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const scrollPosition = window.scrollY;
            const sections = document.querySelectorAll('.section');
            const windowHeight = window.innerHeight;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionMiddle = sectionTop + (sectionHeight / 2);
                
                // Check if this section is most visible
                if (scrollPosition + (windowHeight / 2) >= sectionMiddle - 100 && 
                    scrollPosition + (windowHeight / 2) < sectionMiddle + 100) {
                    
                    if (index + 1 !== lastSectionIndex) {
                        lastSectionIndex = index + 1;
                        updateNavigationState(lastSectionIndex);
                    }
                }
            });
        }, 100);
    });
}

// Sync laptop screen with main scroll
function syncLaptopScreenWithScroll(origin, destination) {
    if (window.virtualScroll && window.virtualScroll.sections) {
        const targetSection = destination.index;
        gsap.to(window.virtualScroll, {
            targetSection: targetSection,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: function() {
                if (typeof updateLaptopScreenTexture === 'function') {
                    updateLaptopScreenTexture();
                }
            }
        });
    }
}

// Reset section animations
function resetSectionAnimations(section) {
    gsap.set(section, { opacity: 1, y: 0, scale: 1 });
}

// Update performance indicator
function updatePerformanceIndicator() {
    const perfElement = document.querySelector('.performance-overlay .perf-stats');
    if (perfElement && window.virtualScroll) {
        const currentSection = window.fullpage_api?.getActiveSection()?.index + 1 || 1;
        perfElement.innerHTML = `
            <span class="fps">FPS: ${window.virtualScroll.fps || 0}</span><br>
            <span class="mem">Memory: ${window.virtualScroll.memoryUsage || 'N/A'}</span><br>
            <span class="section">Section: ${currentSection}</span>
        `;
    }
}

// Nested Scroll Animation System
function initNestedScrollAnimations() {
    console.log('Initializing nested scroll animations...');
    
    // Get screen sections
    window.virtualScroll.sections = document.querySelectorAll('.screen-section');
    
    // Create virtual scroll controller
    window.syncLaptopScreenWithScroll = function(origin, destination) {
        // Map fullpage section index to laptop screen section
        const sectionMap = {
            0: 0, // Home -> Hero screen
            1: 1, // Portfolio -> Projects screen  
            2: 2, // About -> About screen
            3: 3  // Contact -> Contact screen
        };
        
        const targetSection = sectionMap[destination.index] || 0;
        
        // Smooth transition to target section
        gsap.to(window.virtualScroll, {
            targetSection: targetSection,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: updateLaptopScreenContent
        });
    };
    
    // Update the content displayed on the laptop screen
    function updateLaptopScreenContent() {
        window.virtualScroll.currentSection += (window.virtualScroll.targetSection - window.virtualScroll.currentSection) * window.virtualScroll.scrollSpeed;
        
        // Find the current section based on scroll position
        const currentSectionIndex = Math.round(window.virtualScroll.currentSection);
        
        // Update all sections with scroll progress
        window.virtualScroll.sections.forEach((section, index) => {
            const distance = Math.abs(index - window.virtualScroll.currentSection);
            const progress = 1 - Math.min(1, distance);
            
            // Apply animations based on scroll progress
            animateScreenSection(section, progress, index === currentSectionIndex);
        });
        
        // Update the 3D laptop screen texture if laptop.js is loaded
        if (typeof updateLaptopScreenTexture === 'function') {
            updateLaptopScreenTexture();
        }
    }
    
    // Animate individual screen sections
    function animateScreenSection(section, progress, isActive) {
        // Base animation for all sections
        gsap.to(section, {
            opacity: progress * 0.3 + 0.7, // Always somewhat visible
            y: (1 - progress) * 50, // Move up when not active
            scale: isActive ? 1 : 0.95,
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Special animations for different elements
        if (isActive) {
            // Animate title when section is active
            const title = section.querySelector('h1, h2');
            if (title) {
                gsap.fromTo(title,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
                );
            }
        }
    }
    
    // Initialize the nested scroll system
    function initializeNestedScroll() {
        // Initial sync
        if (window.fullpage_api) {
            const activeSection = window.fullpage_api.getActiveSection();
            if (activeSection) {
                window.syncLaptopScreenWithScroll({index: 0}, {index: activeSection.index});
            }
        }
        
        // Start animation loop
        function animationLoop() {
            if (Math.abs(window.virtualScroll.currentSection - window.virtualScroll.targetSection) > 0.01) {
                updateLaptopScreenContent();
            }
            requestAnimationFrame(animationLoop);
        }
        
        animationLoop();
        
        console.log('Nested scroll system initialized');
    }
    
    // Start the nested scroll system if sections exist
    if (window.virtualScroll.sections.length > 0) {
        initializeNestedScroll();
    } else {
        console.warn('No laptop screen sections found for nested scroll');
    }
}

// GSAP Animations
function initAnimations() {
    // Animate elements on page load
    gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-buttons', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out'
    });
    
    console.log('GSAP animations initialized');
}

// Section entrance animations
function animateSectionEntrance(section) {
    // Fade in the section
    gsap.to(section, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
    });
}

// Contact Form Functionality
function initForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = form.querySelector('input[type="text"]')?.value;
            const email = form.querySelector('input[type="email"]')?.value;
            const message = form.querySelector('textarea')?.value;
            
            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                setTimeout(() => {
                    showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 1500);
            }
        });
    }
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Form message display
function showFormMessage(message, type) {
    let existingMessage = document.querySelector('.form-message');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Animate in
    setTimeout(() => {
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            messageElement.remove();
        }, 300);
    }, 3000);
}

// Mobile touch scrolling initialization
function initMobileTouchScrolling() {
    // Allow touch scrolling on mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('Mobile device detected - enabling touch scrolling');
        
        // Add touch scrolling to sections that need it
        const scrollableElements = document.querySelectorAll('.contact-form, .skills-grid, .projects-grid, .about-text');
        
        scrollableElements.forEach(element => {
            if (element) {
                element.style.overflowY = 'auto';
                element.style.touchAction = 'pan-y';
                element.style.webkitOverflowScrolling = 'touch';
                element.style.maxHeight = '80vh';
            }
        });
        
        // Prevent FullPage.js from blocking touch events on mobile
        if (window.fullpage_api) {
            window.fullpage_api.setAllowScrolling(true, 'down, up');
            window.fullpage_api.setKeyboardScrolling(true);
            
            // Add touch event listeners for better mobile experience
            document.addEventListener('touchstart', handleTouchStart, false);
            document.addEventListener('touchmove', handleTouchMove, false);
        }
    }
}

// Touch event handlers for mobile
let touchStartY = 0;
let touchCurrentY = 0;
let isScrolling = false;

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    isScrolling = true;
}

function handleTouchMove(e) {
    if (!isScrolling) return;
    
    touchCurrentY = e.touches[0].clientY;
    const touchDiff = touchCurrentY - touchStartY;
    
    // If scrolling vertically and in a scrollable area, prevent FullPage.js from taking over
    const scrollableElement = e.target.closest('.contact-form, .skills-grid, .projects-grid, .about-text');
    if (scrollableElement && Math.abs(touchDiff) > 10) {
        e.stopPropagation();
    }
    
    touchStartY = touchCurrentY;
}

// Cleanup function for touch events
window.addEventListener('touchend', () => {
    isScrolling = false;
});

// Initialize mobile touch events
document.addEventListener('DOMContentLoaded', () => {
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('touch-device');
    }
});

console.log('Main.js initialization complete');