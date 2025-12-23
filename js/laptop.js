/*console.log('Professional laptop component initializing...');

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop for better performance
    if (window.innerWidth > 992) {
        initProfessionalLaptop();
    } else {
        // Show placeholder on mobile
        showMobilePlaceholder();
    }
});

function showMobilePlaceholder() {
    const container = document.getElementById('laptopModel');
    if (container) {
        container.innerHTML = `
            <div class="mobile-placeholder">
                <i class="fas fa-laptop-code"></i>
                <p>3D portfolio preview available on desktop</p>
            </div>
        `;
    }
}

async function initProfessionalLaptop() {
    console.log('Initializing professional laptop model...');
    
    const container = document.getElementById('laptopModel');
    if (!container) {
        console.error('Laptop container not found');
        return;
    }

    try {
        // Clear container first
        container.innerHTML = '';
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = null;
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            45, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        
        // Position camera to see the laptop well
        camera.position.set(0, 0, 5);
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.SRGBEncoding;
        container.appendChild(renderer.domElement);
        
        // Lighting - crucial for realistic models
        setupLighting(scene);
        
        // Load the laptop model
        const laptopModel = await loadLaptopModel(scene);
        
        // Create screen content display
        const screenContent = createScreenContent();
        scene.add(screenContent);
        
        // Add orbit controls for interaction
        const controls = setupControls(camera, renderer.domElement);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Gentle floating animation when not interacting
            if (!controls.autoRotate && !controls.enabled) {
                laptopModel.rotation.y += 0.001;
                laptopModel.position.y = 0.5 + Math.sin(Date.now() * 0.001) * 0.1;
            }
            
            controls.update();
            renderer.render(scene, camera);
        }
        
        animate();
        
        console.log('Professional laptop initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize laptop:', error);
        showFallbackContent(container);
    }
}

function setupLighting(scene) {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Fill light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0x888888, 0.5);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);
}

async function loadLaptopModel(scene) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        
        // Use working sample model URL
        const modelPath = window.portfolioConfig?.laptopModel?.path || 'https://cdn.shopify.com/s/files/1/0582/1558/2982/files/laptop_model.glb?v=1650301099';
        
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                
                // Apply configuration settings
                const config = window.portfolioConfig?.laptopModel || {};
                model.scale.set(config.scale || 1.2, config.scale || 1.2, config.scale || 1.2);
                model.position.set(config.position?.x || 0, config.position?.y || -1.5, config.position?.z || 0);
                model.rotation.y = config.rotation?.y || -0.3;
                
                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
                reject(error);
            }
        );
    });
}

function createScreenContent() {
    // Create a plane that will show the portfolio content
    const screenGeometry = new THREE.PlaneGeometry(1.8, 1.2);
    
    // Create a canvas to render the portfolio content
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Function to update the screen content
    window.updateLaptopScreenTexture = function() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get current section from virtual scroll
        const currentSection = (window.virtualScroll?.currentSection || 0);
        const currentSectionIndex = Math.round(currentSection);
        
        // Draw gradient background based on section
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        switch(currentSectionIndex) {
            case 0: // Hero/Home
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                break;
            case 1: // Portfolio
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#ee5a24');
                break;
            case 2: // About
                gradient.addColorStop(0, '#11998e');
                gradient.addColorStop(1, '#38ef7d');
                break;
            case 3: // Contact
                gradient.addColorStop(0, '#4facfe');
                gradient.addColorStop(1, '#00f2fe');
                break;
            default:
                gradient.addColorStop(0, '#6c63ff');
                gradient.addColorStop(1, '#4a45e6');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw portfolio content
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('My Portfolio', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '20px Poppins, sans-serif';
        ctx.fillText('Interactive 3D Experience', canvas.width / 2, canvas.height / 2 + 20);
        
        // Draw scroll progress
        const progress = currentSection % 1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(40, canvas.height - 60, canvas.width - 80, 12);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(40, canvas.height - 60, (canvas.width - 80) * progress, 12);
    };
    
    // Initial update
    if (window.updateLaptopScreenTexture) {
        window.updateLaptopScreenTexture();
    }
    
    // Create texture from canvas
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Create material with the texture
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        map: screenTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Create screen mesh
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    
    // Position the screen in front of the laptop screen
    screenMesh.position.set(0, 0.2, 2.5);
    screenMesh.rotation.y = Math.PI;
    
    return screenMesh;
}

function setupControls(camera, domElement) {
    const controls = new THREE.OrbitControls(camera, domElement);
    
    // Configure controls for better user experience
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.3;
    
    // Limit rotation angles
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Disable zoom for better UX
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 8;
    
    // Enable auto-rotation when not interacting
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Reset auto-rotate when user interacts
    domElement.addEventListener('mousedown', () => {
        controls.autoRotate = false;
    });
    
    domElement.addEventListener('touchstart', () => {
        controls.autoRotate = false;
    });
    
    domElement.addEventListener('mouseleave', () => {
        if (!controls.autoRotate) {
            setTimeout(() => {
                controls.autoRotate = true;
            }, 3000);
        }
    });
    
    return controls;
}

function showFallbackContent(container) {
    container.innerHTML = `
        <div class="fallback-content">
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>3D Laptop Loading Issue</h3>
                <p>Couldn't load the 3D model. This might be due to:</p>
                <ul>
                    <li>Network issues</li>
                    <li>Browser compatibility</li>
                </ul>
                <button class="btn-primary" onclick="location.reload()">Retry</button>
            </div>
        </div>
    `;
}

*/




console.log('Professional laptop component initializing...');

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop for better performance
    if (window.innerWidth > 992 && isWebGLSupported()) {
        initProfessionalLaptop();
    } else {
        // Show placeholder on mobile
        showMobilePlaceholder();
    }
});

// Check WebGL support
function isWebGLSupported() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
                 (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function showMobilePlaceholder() {
    const container = document.getElementById('laptopModel');
    if (container) {
        container.innerHTML = `
            <div class="mobile-placeholder">
                <i class="fas fa-laptop-code"></i>
                <p>3D portfolio preview available on desktop</p>
                <small>(WebGL required)</small>
            </div>
        `;
        
        // Add basic styling if not already present
        if (!document.querySelector('#mobile-placeholder-style')) {
            const style = document.createElement('style');
            style.id = 'mobile-placeholder-style';
            style.innerHTML = `
                .mobile-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: var(--secondary-color);
                    background: rgba(108, 99, 255, 0.1);
                    border-radius: var(--border-radius-lg);
                    padding: 20px;
                    text-align: center;
                }
                .mobile-placeholder i {
                    font-size: 3rem;
                    margin-bottom: 15px;
                }
                .mobile-placeholder p {
                    font-size: 1rem;
                    opacity: 0.8;
                }
                .mobile-placeholder small {
                    font-size: 0.8rem;
                    opacity: 0.6;
                    margin-top: 5px;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

async function initProfessionalLaptop() {
    console.log('Initializing professional laptop model...');
    
    const container = document.getElementById('laptopModel');
    if (!container) {
        console.error('Laptop container not found');
        return;
    }

    try {
        // Clear container first
        container.innerHTML = '';
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
        
        // Create scene
        const scene = new THREE.Scene();
        scene.background = null;
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            45, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        
        // Position camera to see the laptop well
        camera.position.set(0, 0, 6);
        camera.lookAt(0, 0, 0);
        
        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);
        
        // Add resize observer for better responsiveness
        const resizeObserver = new ResizeObserver(() => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        resizeObserver.observe(container);
        
        // Lighting - crucial for realistic models
        setupLighting(scene);
        
        // Load the laptop model
        const laptopModel = await loadLaptopModel(scene);
        
        // Create screen content display
        const screenContent = createScreenContent(laptopModel);
        scene.add(screenContent);
        
        // Setup controls - try OrbitControls first, fallback to simple mouse control
        let controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = setupOrbitControls(camera, renderer.domElement, laptopModel);
            console.log('OrbitControls initialized successfully');
        } else {
            controls = setupSimpleMouseControls(camera, renderer.domElement, laptopModel, scene);
            console.log('Simple mouse controls initialized as fallback');
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // Animation loop
        let lastFrameTime = performance.now();
        let frameCount = 0;
        let fps = 0;
        
        function animate() {
            requestAnimationFrame(animate);
            
            // Calculate FPS
            const now = performance.now();
            frameCount++;
            if (now - lastFrameTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastFrameTime = now;
                window.virtualScroll = window.virtualScroll || {};
                window.virtualScroll.laptopFPS = fps;
            }
            
            // Performance-based animations
            const animationSpeed = Math.min(fps / 60, 1);
            
            // Gentle floating animation when not interacting
            if (controls && !controls.autoRotate && !controls.enabled) {
                laptopModel.rotation.y += 0.001 * animationSpeed;
                laptopModel.position.y = 0.5 + Math.sin(Date.now() * 0.0005 * animationSpeed) * 0.1;
            }
            
            // Update screen texture
            if (typeof window.updateLaptopScreenTexture === 'function') {
                window.updateLaptopScreenTexture();
            }
            
            if (controls) {
                controls.update?.(); // Optional chaining for simple controls
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        console.log('Professional laptop initialized successfully!');
        return { scene, camera, renderer, laptopModel, controls };
        
    } catch (error) {
        console.error('Failed to initialize laptop:', error);
        showFallbackContent(container, error.message || 'Unknown error occurred');
    }
}

function setupLighting(scene) {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    // Fill light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);
}

async function loadLaptopModel(scene) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        
        // Multiple fallback model options - FIXED URLS
        const modelOptions = [
            'assets/models/laptop.glb',
            'https://cdn.shopify.com/s/files/1/0582/1558/2982/files/laptop_model.glb?v=1650301099', // FIXED: removed trailing space
            'https://storage.googleapis.com/leonardo-ai-cdn/a881685f-b7c0-4a86-b9d0-f0d6ce9664f8/8c169b96-1430-45bb-8a72-d0c9be677974/3d_model.glb',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb'
        ];
        
        let currentModelIndex = 0;
        
        function attemptLoad(modelPath) {
            console.log(`Attempting to load model: ${modelPath}`);
            
            loader.load(
                modelPath,
                (gltf) => {
                    const model = gltf.scene;
                    
                    // Scale and position the laptop
                    model.scale.set(1.2, 1.2, 1.2);
                    model.position.set(0, -1.2, 0);
                    model.rotation.y = -0.3; // Slight viewing angle
                    
                    scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    if (xhr.lengthComputable) {
                        const percentComplete = xhr.loaded / xhr.total * 100;
                        console.log(`Loading model: ${percentComplete.toFixed(0)}%`);
                    }
                },
                (error) => {
                    console.error(`Error loading model ${modelPath}:`, error);
                    
                    // Try next model option
                    currentModelIndex++;
                    if (currentModelIndex < modelOptions.length) {
                        console.log(`Trying fallback model ${currentModelIndex + 1}/${modelOptions.length}`);
                        attemptLoad(modelOptions[currentModelIndex]);
                    } else {
                        reject(new Error('All model loading attempts failed'));
                    }
                }
            );
        }
        
        // Start with first model
        attemptLoad(modelOptions[0]);
    });
}

function createScreenContent(laptopModel) {
    // Create canvas for screen texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create texture and material
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        map: screenTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    // Create screen geometry and mesh
    const screenGeometry = new THREE.PlaneGeometry(1.8, 1.2);
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.name = 'laptopScreenContent';
    
    // Position the screen in front of the laptop
    screenMesh.position.set(0, 0.2, 2.5);
    screenMesh.rotation.y = Math.PI;
    
    // Function to update the screen texture
    window.updateLaptopScreenTexture = function() {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get current section from virtual scroll
        const currentSection = (window.virtualScroll?.currentSection || 0);
        const currentSectionIndex = Math.round(currentSection);
        const progress = currentSection % 1;
        
        // Draw background gradient based on section
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        switch(currentSectionIndex) {
            case 0: // Hero/Home
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                break;
            case 1: // Portfolio
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#ee5a24');
                break;
            case 2: // About
                gradient.addColorStop(0, '#11998e');
                gradient.addColorStop(1, '#38ef7d');
                break;
            case 3: // Contact
                gradient.addColorStop(0, '#4facfe');
                gradient.addColorStop(1, '#00f2fe');
                break;
            default:
                gradient.addColorStop(0, '#6c63ff');
                gradient.addColorStop(1, '#4a45e6');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw content
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('My Portfolio', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '20px Poppins, sans-serif';
        ctx.fillText('Interactive 3D Experience', canvas.width / 2, canvas.height / 2 + 20);
        
        // Draw progress indicator
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(40, canvas.height - 60, canvas.width - 80, 12);
        
        ctx.fillStyle = 'white';
        ctx.fillRect(40, canvas.height - 60, (canvas.width - 80) * progress, 12);
        
        // Add laptop bezel shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, canvas.width, 30);
        
        // Update texture
        screenTexture.needsUpdate = true;
    };
    
    // Initial update
    if (window.updateLaptopScreenTexture) {
        window.updateLaptopScreenTexture();
    }
    
    // Update texture periodically
    setInterval(() => {
        if (window.updateLaptopScreenTexture) {
            window.updateLaptopScreenTexture();
        }
    }, 100);
    
    return screenMesh;
}

// Setup OrbitControls (if available)
function setupOrbitControls(camera, domElement, laptopModel) {
    const controls = new THREE.OrbitControls(camera, domElement);
    
    // Configure controls for optimal laptop interaction
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.4;
    controls.zoomSpeed = 0.6;
    controls.panSpeed = 0.3;
    
    // Limit rotation angles for better UX
    controls.minPolarAngle = Math.PI / 6; // 30 degrees from top
    controls.maxPolarAngle = Math.PI / 2.2; // About 80 degrees from top
    
    // Distance limits
    controls.minDistance = 4;
    controls.maxDistance = 10;
    
    // Enable auto-rotation
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    
    // Interaction event handlers
    domElement.addEventListener('mousedown', () => {
        controls.autoRotate = false;
    });
    
    domElement.addEventListener('touchstart', () => {
        controls.autoRotate = false;
    });
    
    domElement.addEventListener('wheel', (e) => {
        // Reduce zoom speed for better control
        e.deltaY *= 0.5;
    });
    
    domElement.addEventListener('mouseleave', () => {
        if (!controls.autoRotate) {
            setTimeout(() => {
                if (!controls.enabled) {
                    controls.autoRotate = true;
                }
            }, 3000);
        }
    });
    
    // Add double-click to reset view
    domElement.addEventListener('dblclick', () => {
        gsap.to(controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
            ease: "power2.out"
        });
        gsap.to(camera.position, {
            x: 0,
            y: 0,
            z: 6,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => camera.lookAt(controls.target)
        });
    });
    
    return controls;
}

// Simple mouse control fallback (no OrbitControls needed)
function setupSimpleMouseControls(camera, domElement, laptopModel, scene) {
    console.log('Using simple mouse controls');
    
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const rotationSpeed = 0.01;
    const maxRotation = Math.PI / 4; // 45 degrees
    
    // Mouse down event
    domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        domElement.style.cursor = 'grabbing';
    });
    
    // Mouse up event
    window.addEventListener('mouseup', () => {
        isDragging = false;
        domElement.style.cursor = 'grab';
    });
    
    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            // Rotate laptop model (not camera)
            laptopModel.rotation.y += deltaMove.x * rotationSpeed;
            laptopModel.rotation.x += deltaMove.y * rotationSpeed * 0.5;
            
            // Limit rotation angles
            laptopModel.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, laptopModel.rotation.x));
            laptopModel.rotation.y = Math.max(-maxRotation * 2, Math.min(maxRotation * 2, laptopModel.rotation.y));
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
    
    // Touch events for mobile
    domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    });
    
    domElement.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    domElement.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };
            
            laptopModel.rotation.y += deltaMove.x * rotationSpeed * 0.5;
            laptopModel.rotation.x += deltaMove.y * rotationSpeed * 0.25;
            
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            
            e.preventDefault();
        }
    }, { passive: false });
    
    // Auto rotation when not dragging
    let lastInteractionTime = Date.now();
    
    function updateAutoRotation() {
        if (!isDragging && Date.now() - lastInteractionTime > 3000) {
            laptopModel.rotation.y += 0.001;
        }
        requestAnimationFrame(updateAutoRotation);
    }
    
    domElement.addEventListener('mousedown', () => {
        lastInteractionTime = Date.now();
    });
    
    domElement.addEventListener('touchstart', () => {
        lastInteractionTime = Date.now();
    });
    
    updateAutoRotation();
    
    // Return object with update method for animation loop compatibility
    return {
        enabled: true,
        autoRotate: true,
        update: function() {
            // No-op, handled by animation loop
        }
    };
}

function showFallbackContent(container, errorMessage = '') {
    if (!container) return;
    
    container.innerHTML = `
        <div class="fallback-content">
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>3D Laptop Loading Issue</h3>
                <p>Couldn't load the 3D model. This might be due to:</p>
                <ul>
                    <li>Network connectivity issues</li>
                    <li>Browser WebGL support</li>
                    <li>Cached files preventing load</li>
                    ${errorMessage ? `<li>Specific error: ${errorMessage}</li>` : ''}
                </ul>
                <div class="fallback-buttons">
                    <button class="btn-primary" onclick="location.reload()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                    <button class="btn-secondary" onclick="showMobilePlaceholder()">
                        <i class="fas fa-mobile-alt"></i> Mobile View
                    </button>
                </div>
                <small class="troubleshooting">
                    Troubleshooting: Try updating your browser, enabling WebGL, or checking your internet connection.
                </small>
            </div>
        </div>
    `;
    
    // Add fallback styling
    if (!document.querySelector('#fallback-style')) {
        const style = document.createElement('style');
        style.id = 'fallback-style';
        style.innerHTML = `
            .fallback-content {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }
            .error-message {
                text-align: center;
                padding: 30px;
                background: var(--card-bg);
                border-radius: var(--border-radius-lg);
                border: 2px solid var(--border-color);
                max-width: 500px;
                width: 90%;
            }
            .error-message i {
                font-size: 3rem;
                color: #ff6b6b;
                margin-bottom: 15px;
            }
            .error-message h3 {
                color: var(--primary-color);
                margin-bottom: 10px;
            }
            .error-message p {
                margin-bottom: 15px;
                color: var(--text-color);
                opacity: 0.9;
            }
            .error-message ul {
                text-align: left;
                margin-bottom: 20px;
                color: var(--text-color);
                padding-left: 20px;
            }
            .error-message li {
                margin-bottom: 8px;
                line-height: 1.4;
            }
            .fallback-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin: 20px 0;
                flex-wrap: wrap;
            }
            .fallback-buttons button {
                padding: 10px 20px;
                font-size: 0.9rem;
            }
            .troubleshooting {
                display: block;
                margin-top: 15px;
                font-size: 0.8rem;
                color: var(--text-color);
                opacity: 0.7;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }
}

// Performance optimization for mobile and visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Pause animations when tab is not visible
    }
});

console.log('Laptop component ready with simple mouse interaction');