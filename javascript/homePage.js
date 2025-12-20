// Sample Data
const featuredLands = [
    {
        id: 1,
        title: "50-Acre Agricultural Paradise",
        price: "$750,000",
        location: "Central Valley, California",
        acres: 50,
        waterSource: "Well & Stream",
        soilType: "Fertile Loam",
        zoning: "Agricultural",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.9,
        featured: true,
        type: "agricultural"
    },
    {
        id: 2,
        title: "Mountain View Development Land",
        price: "$1,200,000",
        location: "Rocky Mountains, Colorado",
        acres: 25,
        waterSource: "Municipal",
        soilType: "Rocky",
        zoning: "Residential/Commercial",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.8,
        featured: true,
        type: "development"
    },
    {
        id: 3,
        title: "Riverfront Recreational Property",
        price: "$450,000",
        location: "Missouri River, Montana",
        acres: 15,
        waterSource: "River Frontage",
        soilType: "Sandy Loam",
        zoning: "Recreational",
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.7,
        featured: true,
        type: "recreational"
    },
    {
        id: 4,
        title: "Solar Farm Ready Land",
        price: "$950,000",
        location: "Mojave Desert, Nevada",
        acres: 100,
        waterSource: "Limited",
        soilType: "Sandy",
        zoning: "Energy/Industrial",
        image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.6,
        featured: false,
        type: "industrial"
    },
    {
        id: 5,
        title: "Timber Investment Property",
        price: "$650,000",
        location: "Pacific Northwest, Oregon",
        acres: 80,
        waterSource: "Multiple Streams",
        soilType: "Clay Loam",
        zoning: "Forestry",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.9,
        featured: true,
        type: "timber"
    },
    {
        id: 6,
        title: "Lakeside Vacation Plot",
        price: "$325,000",
        location: "Lake Tahoe, California",
        acres: 5,
        waterSource: "Lake Access",
        soilType: "Rocky/Sandy",
        zoning: "Residential",
        image: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
        rating: 4.8,
        featured: false,
        type: "residential"
    },
];

const testimonials = [
    {
        name: "James Wilson",
        text: "Found perfect 100-acre farmland with Garuda. Their expertise in agricultural zoning was invaluable.",
        role: "Farm Investor",
        rating: 5
    },
    {
        name: "Linda Martinez",
        text: "Purchased development land that doubled in value in 3 years. Excellent investment advice!",
        role: "Property Developer",
        rating: 5
    },
    {
        name: "Robert Chen",
        text: "Garuda helped us secure a beautiful lakeside property with all the necessary permits in place.",
        role: "Vacation Home Buyer",
        rating: 5
    }
];

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileMenu = document.getElementById('mobileMenu');
const navSignUp = document.getElementById('navSignUp');
const navSignIn = document.getElementById('navSignIn');
const mobileSignUp = document.getElementById('mobileSignUp');
const mobileSignIn = document.getElementById('mobileSignIn');
const ctaSignUp = document.getElementById('ctaSignUp');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeSignupModal = document.getElementById('closeSignupModal');
const openSignupFromLogin = document.getElementById('openSignupFromLogin');
const openLoginFromSignup = document.getElementById('openLoginFromSignup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const landsGrid = document.getElementById('landsGrid');
const testimonialText = document.getElementById('testimonialText');
const testimonialName = document.getElementById('testimonialName');
const testimonialRole = document.getElementById('testimonialRole');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const signupSubmitBtn = document.getElementById('signupSubmitBtn');
const signupBtnText = document.getElementById('signupBtnText');
const signupSpinner = document.getElementById('signupSpinner');

// State
let currentTestimonialIndex = 0;
let activeFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderLands();
    updateTestimonial();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu
    mobileMenuBtn.addEventListener('click', () => mobileMenu.style.display = 'block');
    closeMobileMenu.addEventListener('click', () => mobileMenu.style.display = 'none');
    
    // Modal Controls
    navSignUp.addEventListener('click', () => signupModal.style.display = 'flex');
    navSignIn.addEventListener('click', () => loginModal.style.display = 'flex');
    mobileSignUp.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        signupModal.style.display = 'flex';
    });
    mobileSignIn.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    ctaSignUp.addEventListener('click', () => signupModal.style.display = 'flex');
    
    // Close Modals
    closeLoginModal.addEventListener('click', () => loginModal.style.display = 'none');
    closeSignupModal.addEventListener('click', () => signupModal.style.display = 'none');
    
    // Modal Transitions
    openSignupFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    });
    
    openLoginFromSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    // Close modals when clicking outside
    [loginModal, signupModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Testimonials
    prevTestimonial.addEventListener('click', showPreviousTestimonial);
    nextTestimonial.addEventListener('click', showNextTestimonial);
    
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonialIndex = index;
            updateTestimonial();
        });
    });
    
    // Browse Lands buttons
    document.querySelectorAll('.browse-lands').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Browse Lands functionality would navigate to lands listing page');
            // In a real app: window.location.href = '/lands.html';
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.btn-outline-secondary').forEach(b => {
                b.classList.remove('btn-success');
                b.classList.add('btn-outline-secondary');
            });
            this.classList.remove('btn-outline-secondary');
            this.classList.add('btn-success');
            
            // Apply filter
            const filter = this.textContent.toLowerCase();
            activeFilter = filter === 'all' ? 'all' : filter;
            renderLands();
        });
    });
}

// Render Lands
function renderLands() {
    landsGrid.innerHTML = '';
    
    const filteredLands = activeFilter === 'all' 
        ? featuredLands 
        : featuredLands.filter(land => land.type === activeFilter);
    
    filteredLands.forEach(land => {
        const landCard = document.createElement('div');
        landCard.className = 'col-md-6 col-lg-4 mb-4';
        landCard.innerHTML = `
            <div class="land-card">
                <div class="position-relative">
                    <img src="${land.image}" class="land-card-img w-100" alt="${land.title}">
                    ${land.featured ? '<span class="land-card-badge">Featured</span>' : ''}
                    <span class="land-card-price">${land.price}</span>
                    <span class="land-card-acres">${land.acres} Acres</span>
                </div>
                <div class="p-4">
                    <h5 class="fw-bold mb-2">${land.title}</h5>
                    <div class="d-flex align-items-center text-muted mb-3">
                        <i class="bi bi-geo-alt me-2"></i>
                        <small class="text-truncate">${land.location}</small>
                    </div>
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <small class="d-flex align-items-center">
                                <i class="bi bi-droplet text-primary me-1"></i>
                                <span class="text-truncate">${land.waterSource}</span>
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="d-flex align-items-center">
                                <i class="bi bi-mountain text-success me-1"></i>
                                ${land.soilType}
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="d-flex align-items-center">
                                <i class="bi bi-building text-secondary me-1"></i>
                                ${land.zoning}
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="d-flex align-items-center">
                                <i class="bi bi-ruler text-success me-1"></i>
                                Surveyed
                            </small>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center border-top pt-3">
                        <div class="d-flex align-items-center">
                            ${Array(Math.floor(land.rating)).fill('<i class="bi bi-star-fill text-warning"></i>').join('')}
                            <span class="ms-1 fw-semibold">${land.rating}</span>
                        </div>
                        <button class="btn btn-success btn-sm">View Details</button>
                    </div>
                </div>
            </div>
        `;
        landsGrid.appendChild(landCard);
    });
}

// Testimonial Functions
function updateTestimonial() {
    const testimonial = testimonials[currentTestimonialIndex];
    testimonialText.textContent = `"${testimonial.text}"`;
    testimonialName.textContent = testimonial.name;
    testimonialRole.textContent = testimonial.role;
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonialIndex);
    });
}

function showPreviousTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
}

function showNextTestimonial() {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial();
}

// Auto-rotate testimonials
setInterval(showNextTestimonial, 5000);

// Form Handlers
async function handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/proxy?url=http://72.61.169.226/auth/login-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            loginModal.style.display = 'none';
            alert('Login successful! Redirecting to dashboard...');
            // In a real app: window.location.href = '/dashboard.html';
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (err) {
        console.error('Network error:', err);
        alert('Network error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!agreeTerms) {
        alert('Please agree to the Terms & Conditions');
        return;
    }
    
    // Show loading state
    signupBtnText.textContent = 'Processing...';
    signupSpinner.classList.remove('d-none');
    signupSubmitBtn.disabled = true;
    
    try {
        const response = await fetch('http://72.61.169.226/api/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ 
                name, 
                email, 
                phone, 
                password, 
                role: 'user'
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful!');
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
            signupForm.reset();
        } else {
            alert(`Error: ${data.error || 'Registration failed'}`);
        }
    } catch (err) {
        console.error('Network error:', err);
        alert('Network error. Please try again.');
    } finally {
        // Reset button state
        signupBtnText.textContent = 'CREATE ACCOUNT';
        signupSpinner.classList.add('d-none');
        signupSubmitBtn.disabled = false;
    }
}

// Initialize Bootstrap Tooltips (if needed)
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});