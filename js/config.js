// config.js - All customizable settings in one file
window.portfolioConfig = {
  // Personal info
  name: "Your Name",
  title: "Web Developer & 3D Artist",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  
  // Social media
  social: {
    github: "yourusername",
    linkedin: "yourprofile",
    twitter: "yourhandle",
    instagram: "yourprofile"
  },
  
  // Theme colors
  colors: {
    primary: "#6c63ff",
    secondary: "#4a45e6",
    light: "#f8f9fa",
    dark: "#1a1a2e"
  },
  
  // Projects data
  projects: [
    {
      title: "Interactive Dashboard",
      description: "A modern analytics dashboard built with React and Three.js",
      imageGradient: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
      technologies: ["React", "Three.js", "GSAP"]
    },
    {
      title: "3D Portfolio",
      description: "This portfolio built with advanced animations and 3D elements",
      imageGradient: "linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%)",
      technologies: ["Three.js", "FullPage.js", "GSAP"]
    },
    {
      title: "Mobile App",
      description: "A responsive mobile application with dark mode support",
      imageGradient: "linear-gradient(45deg, #11998e 0%, #38ef7d 100%)",
      technologies: ["React Native", "Firebase", "GSAP"]
    }
  ],
  
  // About section
  about: {
    bio: "Hello! I'm a passionate web developer specializing in creating interactive and visually stunning web experiences.",
    skills: ["HTML5", "CSS3", "JavaScript", "Three.js", "GSAP", "FullPage.js"]
  },
  
  // Contact form settings
  contact: {
    successMessage: "Message sent successfully! I'll get back to you soon.",
    errorMessage: "Please fill in all fields and enter a valid email address."
  },
  
  // 3D Model settings
  laptopModel: {
    path: "assets/models/laptop.glb", // Working sample model
    scale: 1.2,
    position: { x: 0, y: -1.5, z: 0 },
    rotation: { x: 0, y: -0.3, z: 0 }
  },
  
  // Performance settings
  performance: {
    disable3DOnMobile: true,
    mobileScreenWidth: 768
  }
};