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
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');

const userProfileDropdown = document.getElementById('userProfileDropdown');
const userInitials = document.getElementById('userInitials');
const userImage = document.getElementById('userImage');
const dropdownUserImage = document.getElementById('dropdownUserImage');
const dropdownUserName = document.getElementById('dropdownUserName');
const dropdownUserRole = document.getElementById('dropdownUserRole');
const editProfileBtn = document.getElementById('editProfileBtn');
const landHistoryBtn = document.getElementById('landHistoryBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authButtons = document.getElementById('authButtons');
const authButtons2 = document.getElementById('authButtons2');
const mobileAuthButtons = document.getElementById('mobileAuthButtons');
const mobileUserProfile = document.getElementById('mobileUserProfile');
const mobileUserInitials = document.getElementById('mobileUserInitials');
const mobileUserName = document.getElementById('mobileUserName');
const mobileUserRole = document.getElementById('mobileUserRole');
const mobileEditProfileBtn = document.getElementById('mobileEditProfileBtn');
const mobileLandHistoryBtn = document.getElementById('mobileLandHistoryBtn');
const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

let activeFilter = 'all';
let currentUser = null;
let lands = [];
let filteredLands = [];
let testimonials = [];
let currentTestimonialIndex = 0;


const base_url= '/api/proxy?url=http://72.61.169.226';

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkAuthStatus();
    fetchLands();
    updateTestimonial();
    loadHeroBanner();
    fetchTestimonials();
});

function getFallbackLands() {
    return [
        {
            id: 1,
            title: "50-Acre Agricultural Paradise",
            price: "₹750,000",
            location: "Central Valley, California",
            acres: 50,
            waterSource: "Well & Stream",
            type: "agricultural", // Make sure this is set
            landType: "agricultural", // Add this
            zoning: "Agricultural",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
            rating: 4.9,
            featured: true
        },
        // ... other fallback lands with landType property
    ];
}

async function fetchTestimonials() {
    try {
        const response = await fetch(`${base_url}/user/review`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.message && data.data) {
            testimonials = data.data.map(review => ({
                id: review.id,
                name: review.name,
                text: review.description,
                role: review.location,
                rating: parseInt(review.rating),
                image: proxyUrl(review.image),
                createdAt: review.created_at
            }));
            
            if (testimonials.length > 0) {
                currentTestimonialIndex = 0;
                updateTestimonial();
                setupTestimonialNavigation();
                startTestimonialRotation();
                createTestimonialDots();
            } else {
                testimonials = getFallbackTestimonials();
                createTestimonialDots();
                updateTestimonial();
                setupTestimonialNavigation();
                startTestimonialRotation();
            }
        }
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        testimonials = getFallbackTestimonials();
        createTestimonialDots();
        updateTestimonial();
        setupTestimonialNavigation();
        startTestimonialRotation();
    }
}

function setupTestimonialNavigation() {
    if (prevTestimonial) {
        prevTestimonial.addEventListener('click', showPreviousTestimonial);
    }
    
    if (nextTestimonial) {
        nextTestimonial.addEventListener('click', showNextTestimonial);
    }
}

function showPreviousTestimonial() {
    if (testimonials.length === 0) return;
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
    resetTestimonialRotation(); // Reset timer when manually navigating
}

function showNextTestimonial() {
    if (testimonials.length === 0) return;
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial();
    resetTestimonialRotation(); // Reset timer when manually navigating
}

function resetTestimonialRotation() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
    startTestimonialRotation();
}

function getFallbackTestimonials() {
    return [
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
}

function createTestimonialDots() {
    const dotsContainer = document.querySelector('.testimonial-dot-container');
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            currentTestimonialIndex = index;
            updateTestimonial();
            resetTestimonialRotation();
        });
        dotsContainer.appendChild(dot);
    });
}

function updateTestimonial() {
    if (!testimonialText || !testimonialName || !testimonialRole || testimonials.length === 0) return;
    
    const testimonial = testimonials[currentTestimonialIndex];
    
    testimonialText.textContent = `"${testimonial.text}"`;
    testimonialName.textContent = testimonial.name;
    testimonialRole.textContent = testimonial.role;
    
    updateRatingStars(testimonial.rating);
    
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonialIndex);
    });
    
    updateTestimonialImage(testimonial);
}

function updateRatingStars(rating) {
    const starsContainer = document.querySelector('.testimonial-stars');
    if (!starsContainer) {
        const testimonialCard = document.querySelector('.testimonial-card .text-center');
        if (testimonialCard) {
            const starsDiv = document.createElement('div');
            starsDiv.className = 'text-center mb-4 testimonial-stars';
            starsDiv.innerHTML = generateStarsHTML(rating);
            testimonialCard.prepend(starsDiv);
        }
    } else {
        starsContainer.innerHTML = generateStarsHTML(rating);
    }
}

function generateStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="bi bi-star-fill text-warning fs-5"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            starsHTML += '<i class="bi bi-star-half text-warning fs-5"></i>';
        } else {
            starsHTML += '<i class="bi bi-star text-warning fs-5"></i>';
        }
    }
    return starsHTML;
}

let testimonialInterval;
function startTestimonialRotation() {
    if (testimonials.length > 1) {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(showNextTestimonial, 5000);
    }
}

function updateTestimonialImage(testimonial) {
    const imageContainer = document.querySelector('.testimonial-image');
    
    if (testimonial.image) {
        if (!imageContainer) {
            const testimonialContent = document.querySelector('.testimonial-card > div');
            if (testimonialContent) {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'testimonial-image mb-4 text-center';
                imgDiv.innerHTML = `
                    <img src="${testimonial.image}" 
                         alt="${testimonial.name}" 
                         class="rounded-circle"
                         style="width: 80px; height: 80px; object-fit: cover; border: 3px solid #059669;"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=059669&color=fff&size=80'">
                `;
                testimonialContent.prepend(imgDiv);
            }
        } else {
            const img = imageContainer.querySelector('img');
            if (img) {
                img.src = testimonial.image;
                img.alt = testimonial.name;
                img.onerror = function() {
                    this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=059669&color=fff&size=80`;
                };
            }
        }
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserProfile(token);
    }
}

async function loadHeroBanner() {
    try {
        const response = await fetch(`${base_url}/user/banner`);
        const data = await response.json();

        if (data.data.image) {
            const heroSection = document.querySelector('.hero-section');
            heroSection.style.backgroundImage = 
                `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${proxyUrl(data.data.image)}')`;
        }
    } catch (error) {
        console.error("Failed to load banner image:", error);
    }
}

function resetFilters() {
    activeFilter = 'all';
    
    const filterButtons = document.querySelectorAll('.land-filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('btn-success', 'active');
        btn.classList.add('btn-outline-secondary');
        
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.remove('btn-outline-secondary');
            btn.classList.add('btn-success', 'active');
        }
    });
    
    const dropdown = document.getElementById('landTypeFilter');
    if (dropdown) {
        dropdown.value = 'all';
    }
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    filterLands();
}

async function fetchUserProfile(token) {
    try {
        const response = await fetch(`${base_url}/user/details`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data;
            showUserProfile(data.user);
        } else {
            localStorage.removeItem('token');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

function proxyUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
}

function createLandTypeFilters(landTypes) {
    const filtersContainer = document.getElementById('landFiltersContainer');
    if (!filtersContainer) return;
    
    filtersContainer.innerHTML = '';
    
    const allButton = document.createElement('button');
    allButton.className = 'btn btn-success btn-sm rounded-pill land-filter-btn active';
    allButton.textContent = 'All';
    allButton.setAttribute('data-filter', 'all');
    filtersContainer.appendChild(allButton);
    
    const addedFilters = new Set();
    
    landTypes.forEach(landType => {
        const normalizedType = landType.toLowerCase().trim();
        
        if (!normalizedType || addedFilters.has(normalizedType)) {
            return;
        }
        
        addedFilters.add(normalizedType);
        
        const filterButton = document.createElement('button');
        filterButton.className = 'btn btn-outline-secondary btn-sm rounded-pill land-filter-btn';
        filterButton.textContent = capitalizeFirstLetter(landType); // No count display
        filterButton.setAttribute('data-filter', normalizedType);
        filtersContainer.appendChild(filterButton);
    });
    
    setupFilterButtons();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function fetchLands() {
    try {
        let response;
        const token = localStorage.getItem('token');
            response = await fetch(`${base_url}/user/verified/land`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.message && data.data) {
            const landTypesSet = new Set();
            
            lands = data.data.map((land, index) => {
                const landType = (land.land_details.land_type || 'Other').trim();
                
                if (landType) {
                    landTypesSet.add(landType);
                }
                
                const acres = parseInt(land.land_details.land_area) || 0;
                
                const getImage = () => {
                    if (land.document_media?.land_photo?.length > 0) {
                        return proxyUrl(land.document_media.land_photo[0]);
                    }
                    const defaultImages = {
                        'agricultural': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600',
                        'residential': 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600',
                        'timber': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600',
                        'industrial': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&auto=format&fit=crop&w=600',
                        'development': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600',
                        'recreational': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600'
                    };
                    return defaultImages['agricultural'];
                };

                const formatLocation = () => {
                    const loc = land.land_location;
                    return `${loc.village}, ${loc.mandal}, ${loc.district}, ${loc.state}`;
                };

                return {
                    id: land.land_id,
                    title: land.land_details.land_area + " Acres Land",
                    price: formatPrice(land.land_details.total_land_price),
                    originalPrice: land.land_details.total_land_price,
                    location: formatLocation(),
                    acres: acres,
                    waterSource: land.land_details.water_source || 'Not specified',
                    type: landType,
                    landType: landType,
                    zoning: landType.charAt(0).toUpperCase() + landType.slice(1),
                    image: getImage(),
                    verified: land.land_location.verification,
                    rating: 4.5 + (Math.random() * 0.5),
                    featured: index < 3,
                    apiData: land
                };
            });
            
            const landTypes = Array.from(landTypesSet).filter(type => type && type.trim() !== '');
            landTypes.sort((a, b) => a.localeCompare(b));
            
            createLandTypeFilters(landTypes);
            populateLandTypeDropdown(landTypes);
            
            filteredLands = [...lands];
            renderLands();
        }
    } catch (error) {
        console.error('Error fetching lands:', error);
        lands = getFallbackLands();
        const landTypesSet = new Set(lands.map(land => land.type));
        const landTypes = Array.from(landTypesSet).filter(type => type && type.trim() !== '');
        landTypes.sort((a, b) => a.localeCompare(b));
        createLandTypeFilters(landTypes);
        populateLandTypeDropdown(landTypes);
        filteredLands = [...lands];
        renderLands();
    }
}

function populateLandTypeDropdown(landTypes) {
    const dropdown = document.getElementById('landTypeFilter');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="all">All Land Types</option>';
    
    const addedOptions = new Set();
    
    landTypes.forEach(landType => {
        const normalizedType = landType.toLowerCase().trim();
        
        if (!normalizedType || addedOptions.has(normalizedType)) {
            return;
        }
        
        addedOptions.add(normalizedType);
        
        const option = document.createElement('option');
        option.value = normalizedType;
        option.textContent = capitalizeFirstLetter(landType);
        dropdown.appendChild(option);
    });
    
    const newDropdown = dropdown.cloneNode(true);
    dropdown.parentNode.replaceChild(newDropdown, dropdown);
    
    const updatedDropdown = document.getElementById('landTypeFilter');
    if (updatedDropdown) {
        updatedDropdown.addEventListener('change', function() {
            activeFilter = this.value === 'all' ? 'all' : this.value;
            
            const filterButtons = document.querySelectorAll('.land-filter-btn');
            filterButtons.forEach(btn => {
                const btnFilter = btn.getAttribute('data-filter');
                if (btnFilter === activeFilter || (btnFilter === 'all' && activeFilter === 'all')) {
                    filterButtons.forEach(b => {
                        b.classList.remove('btn-success', 'active');
                        b.classList.add('btn-outline-secondary');
                    });
                    btn.classList.remove('btn-outline-secondary');
                    btn.classList.add('btn-success', 'active');
                }
            });
            
            filterLands();
        });
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.land-filter-btn');
    
    filterButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    document.querySelectorAll('.land-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const allButtons = document.querySelectorAll('.land-filter-btn');
            allButtons.forEach(b => {
                b.classList.remove('btn-success', 'active');
                b.classList.add('btn-outline-secondary');
            });
            
            this.classList.remove('btn-outline-secondary');
            this.classList.add('btn-success', 'active');
            
            const filter = this.getAttribute('data-filter');
            activeFilter = filter === 'all' ? 'all' : filter;
            
            const dropdown = document.getElementById('landTypeFilter');
            if (dropdown) {
                dropdown.value = activeFilter;
            }
            
            filterLands();
        });
    });
}

function getLandType(type) {
    const typeMap = {
        'agri': 'agricultural',
        'residential': 'residential',
        'commercial': 'development',
        'forest': 'timber',
        'industrial': 'industrial',
        'recreational': 'recreational'
    };
    return typeMap[type] || 'agricultural';
}

function formatPrice(price) {
    return `₹${parseInt(price).toLocaleString('en-IN')}`;
}

function getFallbackLands() {
    return [
        {
            id: 1,
            title: "50-Acre Agricultural Paradise",
            price: "₹750,000",
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
            price: "₹1,200,000",
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
            price: "₹450,000",
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
            price: "₹950,000",
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
            price: "₹650,000",
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
            price: "₹325,000",
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
}

function showUserProfile(user) {
    if (authButtons) authButtons.style.display = 'none';
    if (authButtons2) authButtons2.style.display = 'none';
    if (mobileAuthButtons) mobileAuthButtons.style.display = 'none';
    
    if (userProfileDropdown) userProfileDropdown.style.display = 'block';
    if (mobileUserProfile) mobileUserProfile.style.display = 'block';
    
    const initials = getInitials(user.name);
    
    if (userInitials) {
        userInitials.textContent = initials;
        userInitials.style.display = 'flex';
    }
    if (mobileUserInitials) {
        mobileUserInitials.textContent = initials;
        mobileUserInitials.style.display = 'flex';
    }
    if (dropdownUserImage) {
        dropdownUserImage.textContent = initials;
        dropdownUserImage.style.display = 'flex';
    }
    
    if (dropdownUserName) dropdownUserName.textContent = user.name;
    if (dropdownUserRole) dropdownUserRole.textContent = user.role || 'User';
    if (mobileUserName) mobileUserName.textContent = user.name;
    if (mobileUserRole) mobileUserRole.textContent = user.role || 'User';
    
    if (user.image || user.photo) {
        const imageUrl = proxyUrl(user.image || user.photo);
        
        const img = new Image();
        img.onload = () => {
            if (userInitials) userInitials.style.display = 'none';
            if (userImage) {
                userImage.style.display = 'block';
                userImage.innerHTML = `<img src="${imageUrl}" class="user-profile-image" alt="${user.name}" onerror="handleProfileImageError(this, '${initials}')">`;
            }
            
            const profileImages = document.querySelectorAll('.user-profile-image');
            profileImages.forEach(imgElement => {
                imgElement.src = imageUrl;
            });
        };
        
        img.onerror = () => {
            console.warn('Failed to load profile image, showing initials instead');
        };
        
        img.src = imageUrl;
    }
}

function handleProfileImageError(imgElement, initials) {
    console.warn('Profile image failed to load:', imgElement.src);
    // You could hide the image and show initials instead
    imgElement.style.display = 'none';
    const parent = imgElement.parentElement;
    if (parent) {
        const initialsElement = parent.querySelector('.user-initials-circle');
        if (initialsElement) {
            initialsElement.style.display = 'flex';
            initialsElement.textContent = initials;
        }
    }
}

function getInitials(name) {
    return name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function setupEventListeners() {
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.style.display = 'block';
        });
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.style.display = 'none';
        });
    }
    
    if (navSignUp) navSignUp.addEventListener('click', () => signupModal.style.display = 'flex');
    if (navSignIn) navSignIn.addEventListener('click', () => loginModal.style.display = 'flex');
    
    if (mobileSignUp) {
        mobileSignUp.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            signupModal.style.display = 'flex';
        });
    }
    
    if (mobileSignIn) {
        mobileSignIn.addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    
    if (ctaSignUp) ctaSignUp.addEventListener('click', () => signupModal.style.display = 'flex');
    
    if (closeLoginModal) closeLoginModal.addEventListener('click', () => loginModal.style.display = 'none');
    if (closeSignupModal) closeSignupModal.addEventListener('click', () => signupModal.style.display = 'none');
    
    if (openSignupFromLogin) {
        openSignupFromLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
        });
    }
    
    if (openLoginFromSignup) {
        openLoginFromSignup.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    
    [loginModal, signupModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    
    if (document.getElementById('landFiltersContainer')) {
        
    }
    
    if (editProfileBtn) editProfileBtn.addEventListener('click', openEditProfileModal);
    if (mobileEditProfileBtn) mobileEditProfileBtn.addEventListener('click', openEditProfileModal);
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterLands(e.target.value.toLowerCase());
        });
    }
    
    const findLandBtn = document.getElementById('findLandBtn') || document.querySelector('a.btn-success[href="landPage.html"]');
    if (findLandBtn) {
        findLandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const searchTerm = searchInput ? searchInput.value : '';
            const landTypeFilter = document.getElementById('landTypeFilter') ? document.getElementById('landTypeFilter').value : 'all';
            
            if (searchTerm) {
                localStorage.setItem('searchTerm', searchTerm);
            }
            if (landTypeFilter && landTypeFilter !== 'all') {
                localStorage.setItem('landTypeFilter', landTypeFilter);
            }
            
            window.location.href = 'html/landPage.html';
        });
    }
    
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userProfileBtn && bootstrap) {
        new bootstrap.Dropdown(userProfileBtn);
    }
}

function filterLands(searchTerm = '') {
    const searchInput = document.getElementById('searchInput');
    const currentSearch = searchTerm || (searchInput ? searchInput.value.toLowerCase().trim() : '');
    
    filteredLands = lands.filter(land => {
        const landType = land.landType ? land.landType.toLowerCase().trim() : '';
        
        const matchesSearch = !currentSearch || 
            (land.title && land.title.toLowerCase().includes(currentSearch)) ||
            (land.location && land.location.toLowerCase().includes(currentSearch)) ||
            (landType && landType.includes(currentSearch));
        
        let matchesFilter = true;
        if (activeFilter !== 'all') {
            matchesFilter = landType === activeFilter;
        }
        
        return matchesSearch && matchesFilter;
    });
    
    renderLands();
}

function renderLands() {
    if (!landsGrid) return;
    
    landsGrid.innerHTML = '';
    
    if (filteredLands.length === 0) {
        landsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted mb-3"></i>
                <h4 class="fw-bold mb-2">No lands found</h4>
                <p class="text-muted">Try adjusting your search or filter criteria</p>
                <button class="btn btn-outline-success mt-3" onclick="resetFilters()">
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Reset Filters
                </button>
            </div>
        `;
        return;
    }
    
    const landsToShow = filteredLands.slice(0, 6);
    
    landsToShow.forEach(land => {
        const landCard = document.createElement('div');
        landCard.className = 'col-md-6 col-lg-4 mb-4';
        landCard.innerHTML = `
            <div class="land-card">
                <div class="position-relative">
                    <img src="${land.image}" class="land-card-img w-100" alt="${land.title}"
                         onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600'">
                    ${land.featured ? '<span class="land-card-badge">Featured</span>' : ''}
                    <span class="land-card-price">${land.price}</span>
                    <span class="land-card-acres">${land.acres} Acre${land.acres !== 1 ? 's' : ''}</span>
                </div>
                <div class="p-4">
                    <h5 class="fw-bold mb-2 text-truncate-2">${land.title}</h5>
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
                                <i class="bi bi-ruler text-success me-1"></i>
                                ${land.verified}
                            </small>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center border-top pt-3">
                        <button class="btn btn-success btn-sm" onclick="window.viewLandDetails('${land.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
        landsGrid.appendChild(landCard);
    });
}

window.viewLandDetails = function(landId) {
    try {
        localStorage.setItem('landId', landId);
        localStorage.removeItem('isPurchased');
        
        window.location.href = `html/landDetailPage.html?id=${landId}`;
    } catch (error) {
        console.error('Error storing land data:', error);
        window.location.href = `html/landDetailPage.html?id=${landId}`;
    }
};


async function handleLogin(e) {
    e.preventDefault();
    
    if (!loginSubmitBtn || !loginBtnText || !loginSpinner) return;
    
    const identifier = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!identifier || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    loginBtnText.textContent = 'Signing in...';
    loginSpinner.classList.remove('d-none');
    loginSubmitBtn.disabled = true;
    
    try {
        const response = await fetch(`${base_url}/auth/login-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, password }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            loginModal.style.display = 'none';
            loginForm.reset();
            
            await fetchUserProfile(data.token);
            
            showNotification('Login successful!', 'success');
        } else {
            showNotification(data.error || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (err) {
        console.error('Network error:', err);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        loginBtnText.textContent = 'Sign In';
        loginSpinner.classList.add('d-none');
        loginSubmitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    if (!signupSubmitBtn || !signupBtnText || !signupSpinner) return;
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!name || !email || !phone || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms & Conditions', 'error');
        return;
    }
    
    // Show loading state
    signupBtnText.textContent = 'Processing...';
    signupSpinner.classList.remove('d-none');
    signupSubmitBtn.disabled = true;
    
    try {
        const response = await fetch(`${base_url}/user/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            showNotification('Registration successful! Please sign in.', 'success');
            signupModal.style.display = 'none';
            signupForm.reset();
            loginModal.style.display = 'flex';
        } else {
            showNotification(data.error || 'Registration failed. Please try again.', 'error');
        }
    } catch (err) {
        console.error('Network error:', err);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        signupBtnText.textContent = 'CREATE ACCOUNT';
        signupSpinner.classList.add('d-none');
        signupSubmitBtn.disabled = false;
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    currentUser = null;
    
    if (userProfileDropdown) userProfileDropdown.style.display = 'none';
    if (mobileUserProfile) mobileUserProfile.style.display = 'none';
    
    if (authButtons) authButtons.style.display = 'block';
    if (authButtons2) authButtons2.style.display = 'block';
    if (mobileAuthButtons) mobileAuthButtons.style.display = 'block';
    
    if (mobileMenu) mobileMenu.style.display = 'none';
    
    showNotification('Logged out successfully', 'success');
}

function openEditProfileModal() {
    if (!currentUser) return;
    
    if (mobileMenu) mobileMenu.style.display = 'none';
    
    const modalHTML = `
        <div class="modal-overlay" id="editProfileModalOverlay">
            <div class="modal-container profile-modal">
                <button class="modal-close-btn" id="closeEditProfileModal">
                    <i class="bi bi-x-lg"></i>
                </button>
                <div class="p-4 p-md-5">
                    <div class="text-center mb-4">
                        <h2 class="fw-bold">Edit Profile</h2>
                        <p class="text-muted">Update your personal information</p>
                    </div>
                    
                    <form id="editProfileForm">
                        <div class="form-section">
                            <h6>Personal Information</h6>
                            <div class="mb-3">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="editName" value="${currentUser.user.name}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control readonly-input" value="${currentUser.user.email}" readonly>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" id="editPhone" value="${currentUser.user.phone}">
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <h6>Address Information</h6>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">State</label>
                                    <input type="text" class="form-control" id="editState" value="${currentUser.address?.state || ''}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">District</label>
                                    <input type="text" class="form-control" id="editDistrict" value="${currentUser.address?.district || ''}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Mandal</label>
                                    <input type="text" class="form-control" id="editMandal" value="${currentUser.address?.mandal || ''}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Village</label>
                                    <input type="text" class="form-control" id="editVillage" value="${currentUser.address?.village || ''}">
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Pincode</label>
                                    <input type="text" class="form-control" id="editPincode" value="${currentUser.address?.pincode || ''}">
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex gap-3 mt-4">
                            <button type="button" class="btn btn-secondary flex-grow-1" id="cancelEditBtn">Cancel</button>
                            <button type="submit" class="btn btn-success flex-grow-1" id="saveProfileBtn">
                                <span>Save Changes</span>
                                <div class="spinner-border spinner-border-sm text-light ms-2 d-none" id="profileSpinner" role="status"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('editProfileModalOverlay');
    modal.style.display = 'flex';
    
    const closeBtn = document.getElementById('closeEditProfileModal');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const editForm = document.getElementById('editProfileForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.remove());
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => modal.remove());
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    if (editForm) {
        editForm.addEventListener('submit', handleEditProfile);
    }
}

async function handleEditProfile(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const state = document.getElementById('editState').value;
    const district = document.getElementById('editDistrict').value;
    const mandal = document.getElementById('editMandal').value;
    const village = document.getElementById('editVillage').value;
    const pincode = document.getElementById('editPincode').value;
    
    const saveBtn = document.getElementById('saveProfileBtn');
    const spinner = document.getElementById('profileSpinner');
    const btnText = saveBtn ? saveBtn.querySelector('span') : null;
    
    if (btnText) btnText.textContent = 'Saving...';
    if (spinner) spinner.classList.remove('d-none');
    if (saveBtn) saveBtn.disabled = true;
    
    try {
        const response = await fetch(`${base_url}/user/details`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                phone,
                address: {
                    state,
                    district,
                    mandal,
                    village,
                    pincode
                }
            })
        });
        
        if (response.ok) {
            await fetchUserProfile(token);
            showNotification('Profile updated successfully', 'success');
            
            const modal = document.getElementById('editProfileModalOverlay');
            if (modal) modal.remove();
        } else {
            showNotification('Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Network error', 'error');
    } finally {
        // Reset button
        if (btnText) btnText.textContent = 'Save Changes';
        if (spinner) spinner.classList.add('d-none');
        if (saveBtn) saveBtn.disabled = false;
    }
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}