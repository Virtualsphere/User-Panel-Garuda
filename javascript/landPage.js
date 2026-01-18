// State Management
let lands = [];
let filteredLands = [];
let currentSearchQuery = "";
let currentSelectedType = "all";
let currentPriceRange = [0, 1000000000];
const base_url= '/api/proxy?url=http://72.61.169.226';

// DOM Elements
const elements = {
    mobileMenu: document.getElementById('mobileMenu'),
    openMobileMenu: document.getElementById('openMobileMenu'),
    closeMobileMenu: document.getElementById('closeMobileMenu'),
    searchInput: document.getElementById('searchInput'),
    filterToggle: document.getElementById('filterToggle'),
    mobileFilters: document.getElementById('mobileFilters'),
    priceRange: document.getElementById('priceRange'),
    mobilePriceRange: document.getElementById('mobilePriceRange'),
    priceRangeValue: document.getElementById('priceRangeValue'),
    mobilePriceRangeValue: document.getElementById('mobilePriceRangeValue'),
    landsGrid: document.getElementById('landsGrid'),
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    noResultsState: document.getElementById('noResultsState'),
    resultCount: document.getElementById('resultCount'),
    retryBtn: document.getElementById('retryBtn'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    mobileSearchBtn: document.getElementById('mobileSearchBtn'),
    homeBtn: document.getElementById('homeBtn'),
    desktopLandFilters: document.getElementById('desktopLandFilters'),
    mobileLandFilters: document.getElementById('mobileLandFilters'),
    landTypeBtns: document.querySelectorAll('.land-type-btn'),
    landTypeMobileBtns: document.querySelectorAll('.land-type-btn-mobile'),
    propertyModal: new bootstrap.Modal(document.getElementById('propertyModal')),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody')
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event Listeners
function initializeEventListeners() {
    // Mobile Menu
    elements.openMobileMenu.addEventListener('click', () => {
        elements.mobileMenu.style.display = 'block';
    });

    elements.closeMobileMenu.addEventListener('click', () => {
        elements.mobileMenu.style.display = 'none';
    });

    // Filter Toggle
    elements.filterToggle.addEventListener('click', () => {
        const isVisible = elements.mobileFilters.classList.contains('d-none');
        elements.mobileFilters.classList.toggle('d-none', !isVisible);
        
        const icon = elements.filterToggle.querySelector('i');
        icon.classList.toggle('bi-chevron-down', isVisible);
        icon.classList.toggle('bi-chevron-up', !isVisible);
    });

    // Search Input
    elements.searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        filterLands();
    });

    // Price Range
    elements.priceRange.addEventListener('input', (e) => {
        currentPriceRange[1] = parseInt(e.target.value);
        updatePriceRangeDisplay();
        filterLands();
    });

    elements.mobilePriceRange.addEventListener('input', (e) => {
        currentPriceRange[1] = parseInt(e.target.value);
        updatePriceRangeDisplay();
        filterLands();
    });

    // Other Buttons
    elements.retryBtn.addEventListener('click', fetchLands);
    elements.clearFiltersBtn.addEventListener('click', clearFilters);
    elements.mobileSearchBtn.addEventListener('click', () => {
        elements.searchInput.focus();
    });
    elements.homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });

    // Mobile Menu Items
    document.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            elements.mobileMenu.style.display = 'none';
        });
    });
}

// Utility Functions
function proxyUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
}

function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

function getLandType(type) {
    const typeMap = {
        'agricultural': 'agricultural',
        'residential': 'residential',
        'commercial': 'development',
        'forest': 'timber',
        'industrial': 'industrial',
        'recreational': 'recreational',
        'agri': 'agricultural',
        'red': 'red soil',
        'black': 'black soil'
    };
    return typeMap[type] || type || 'agricultural';
}

function updatePriceRangeDisplay() {
    const priceText = `Up to ₹${(currentPriceRange[1] / 10000000).toFixed(1)} Cr`;
    elements.priceRangeValue.textContent = priceText;
    elements.mobilePriceRangeValue.textContent = `Price: ${priceText}`;
}

function createLandTypeFilters(landTypes) {
    elements.desktopLandFilters.innerHTML = '';
    elements.mobileLandFilters.innerHTML = '';
    
    const desktopAllButton = document.createElement('button');
    desktopAllButton.className = 'land-type-btn btn btn-sm rounded-pill active';
    desktopAllButton.textContent = 'All Types';
    desktopAllButton.setAttribute('data-type', 'all');
    desktopAllButton.setAttribute('data-filter', 'all');
    elements.desktopLandFilters.appendChild(desktopAllButton);
    
    const mobileAllDiv = document.createElement('div');
    mobileAllDiv.className = 'col-6';
    const mobileAllButton = document.createElement('button');
    mobileAllButton.className = 'land-type-btn-mobile btn btn-sm w-100 active';
    mobileAllButton.textContent = 'All Types';
    mobileAllButton.setAttribute('data-type', 'all');
    mobileAllButton.setAttribute('data-filter', 'all');
    mobileAllDiv.appendChild(mobileAllButton);
    elements.mobileLandFilters.appendChild(mobileAllDiv);
    
    const addedFilters = new Set();
    
    landTypes.forEach(landType => {
        const normalizedType = landType.toLowerCase().trim();
        
        if (!normalizedType || addedFilters.has(normalizedType)) {
            return;
        }
        
        addedFilters.add(normalizedType);
        
        const desktopButton = document.createElement('button');
        desktopButton.className = 'land-type-btn btn btn-sm rounded-pill';
        desktopButton.textContent = capitalizeFirstLetter(landType);
        desktopButton.setAttribute('data-type', normalizedType);
        desktopButton.setAttribute('data-filter', normalizedType);
        elements.desktopLandFilters.appendChild(desktopButton);
        
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'col-6';
        const mobileButton = document.createElement('button');
        mobileButton.className = 'land-type-btn-mobile btn btn-sm w-100';
        mobileButton.textContent = capitalizeFirstLetter(landType);
        mobileButton.setAttribute('data-type', normalizedType);
        mobileButton.setAttribute('data-filter', normalizedType);
        mobileDiv.appendChild(mobileButton);
        elements.mobileLandFilters.appendChild(mobileDiv);
    });
    
    setupFilterButtons();
}

function setupFilterButtons() {
    const desktopButtons = elements.desktopLandFilters.querySelectorAll('[data-filter]');
    desktopButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            desktopButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            const mobileButton = elements.mobileLandFilters.querySelector(`[data-filter="${filterType}"]`);
            if (mobileButton) {
                elements.mobileLandFilters.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                mobileButton.classList.add('active');
            }
            
            currentSelectedType = filterType;
            filterLands();
        });
    });
    
    const mobileButtons = elements.mobileLandFilters.querySelectorAll('[data-filter]');
    mobileButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            mobileButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            const desktopButton = elements.desktopLandFilters.querySelector(`[data-filter="${filterType}"]`);
            if (desktopButton) {
                elements.desktopLandFilters.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                desktopButton.classList.add('active');
            }
            
            currentSelectedType = filterType;
            filterLands();
        });
    });
}

async function fetchLands() {
    try {
        showLoading();
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
                    rating: 4.5 + (Math.random() * 0.5),
                    featured: index < 3,
                    verified: land.land_location.verification,
                    apiData: land
                };
            });
            
            const landTypes = Array.from(landTypesSet).filter(type => type && type.trim() !== '');
            
            landTypes.sort((a, b) => a.localeCompare(b));
            
            createLandTypeFilters(landTypes);
            
            filterLands();
        }
    } catch (error) {
        console.error('Error fetching lands:', error);
        showError(error.message);
        useFallbackData();
    }
}

function useFallbackData() {
    const fallbackLands = [
        {
            id: 1,
            title: "50-Acre Agricultural Paradise",
            price: "₹750,000",
            originalPrice: 750000,
            location: "Central Valley, California",
            acres: 50,
            waterSource: "Well & Stream",
            type: "agricultural",
            landType: "agricultural",
            zoning: "Agricultural",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600",
            rating: 4.9,
            featured: true,
            verified: "Verified"
        },
    ];
    
    lands = fallbackLands;
    
    const landTypesSet = new Set(fallbackLands.map(land => land.type));
    const landTypes = Array.from(landTypesSet).filter(type => type && type.trim() !== '');
    landTypes.sort((a, b) => a.localeCompare(b));
    
    createLandTypeFilters(landTypes);
    
    filterLands();
}

function filterLands() {
    filteredLands = lands.filter(land => {
        const landType = land.landType ? land.landType.toLowerCase().trim() : '';
        
        const matchesSearch = !currentSearchQuery || 
            (land.title && land.title.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
            (land.location && land.location.toLowerCase().includes(currentSearchQuery.toLowerCase())) ||
            (landType && landType.includes(currentSearchQuery.toLowerCase()));
        
        let matchesFilter = true;
        if (currentSelectedType !== 'all') {
            matchesFilter = landType === currentSelectedType;
        }
        
        const matchesPrice = land.originalPrice >= currentPriceRange[0] && 
                           land.originalPrice <= currentPriceRange[1];
        
        return matchesSearch && matchesFilter && matchesPrice;
    });
    
    renderLands();
}

function clearFilters() {
    currentSearchQuery = "";
    currentSelectedType = "all";
    currentPriceRange = [0, 1000000000];
    
    elements.searchInput.value = "";
    elements.priceRange.value = 1000000000;
    elements.mobilePriceRange.value = 1000000000;
    
    const desktopButtons = elements.desktopLandFilters.querySelectorAll('[data-filter]');
    const mobileButtons = elements.mobileLandFilters.querySelectorAll('[data-filter]');
    
    desktopButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
    });
    
    mobileButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === 'all');
    });
    
    updatePriceRangeDisplay();
    filterLands();
}

// Rendering
function renderLands() {
    hideAllStates();
    
    if (filteredLands.length === 0) {
        elements.noResultsState.classList.remove('d-none');
        elements.resultCount.textContent = '(0 properties)';
        return;
    }
    
    elements.resultCount.textContent = `(${filteredLands.length} properties)`;
    
    elements.landsGrid.innerHTML = filteredLands.map(land => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="property-card">
                <div class="position-relative">
                    <img src="${land.image}" 
                         alt="${land.title}" 
                         class="property-card-img"
                         onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600'">
                    ${land.featured ? `
                        <div class="property-featured">
                            Featured
                        </div>
                    ` : ''}
                    <div class="property-price">
                        <span class="fw-bold">${land.price}</span>
                    </div>
                    <div class="property-acres">
                        ${land.acres} Acre${land.acres !== 1 ? 's' : ''}
                    </div>
                </div>
                <div class="p-4">
                    <h5 class="fw-bold text-truncate-2">${land.title}</h5>
                    <div class="d-flex align-items-center text-muted mb-3">
                        <i class="bi bi-geo-alt me-2"></i>
                        <span class="small text-truncate">${land.location}</span>
                    </div>
                    
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="property-detail-item">
                                <i class="bi bi-droplet text-primary"></i>
                                <span class="text-truncate d-block">${land.waterSource}</span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="property-detail-item">
                                <i class="bi bi-shield-check text-success"></i>
                                <span>${land.verified}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="border-top pt-3 mb-3">
                        <div class="property-detail-item">
                            <i class="bi bi-geo text-success"></i>
                            <span class="small">Type: ${capitalizeFirstLetter(land.type)}</span>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center border-top pt-3">
                        <button class="btn btn-success btn-sm" onclick="window.viewLandDetails('${land.id}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Property Details Modal
function showPropertyDetails(landId) {
    const land = filteredLands.find(l => l.id === landId);
    if (!land) return;
    
    elements.modalTitle.textContent = land.title;
    
    elements.modalBody.innerHTML = `
        <div class="row">
            <div class="col-12 mb-4">
                <img src="${land.image}" 
                     alt="${land.title}" 
                     class="img-fluid rounded"
                     onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600'">
            </div>
            <div class="col-12 col-md-6">
                <h6 class="fw-bold">Property Details</h6>
                <ul class="list-unstyled">
                    <li class="mb-2"><strong>Price:</strong> ${land.price}</li>
                    <li class="mb-2"><strong>Size:</strong> ${land.acres} Acre${land.acres !== 1 ? 's' : ''}</li>
                    <li class="mb-2"><strong>Type:</strong> ${land.type}</li>
                    <li class="mb-2"><strong>Water Source:</strong> ${land.waterSource}</li>
                    <li class="mb-2"><strong>Zoning:</strong> ${land.zoning}</li>
                </ul>
            </div>
            <div class="col-12 col-md-6">
                <h6 class="fw-bold">Location</h6>
                <p class="mb-3">${land.location}</p>
                <h6 class="fw-bold">Owner Information</h6>
                <p class="mb-0">${land.apiData?.farmer_details?.name || 'Not available'}</p>
            </div>
        </div>
        <div class="mt-4">
            <h6 class="fw-bold">Description</h6>
            <p class="mb-0">
                Premium ${land.type.toLowerCase()} land with excellent potential. 
                ${land.waterSource.toLowerCase() !== 'not specified' ? `Features ${land.waterSource} water source. ` : ''}
                Perfect for ${land.type === 'agricultural' ? 'farming and cultivation' : 
                             land.type === 'residential' ? 'residential development' :
                             land.type === 'industrial' ? 'industrial projects' :
                             land.type === 'timber' ? 'forestry and timber production' :
                             land.type === 'recreational' ? 'recreational activities' : 'development'}.
            </p>
        </div>
    `;
    
    elements.propertyModal.show();
}

// State Management
function showLoading() {
    elements.loadingState.classList.remove('d-none');
    elements.errorState.classList.add('d-none');
    elements.noResultsState.classList.add('d-none');
    elements.landsGrid.innerHTML = '';
}

function showError(message) {
    elements.loadingState.classList.add('d-none');
    elements.errorState.classList.remove('d-none');
    elements.errorMessage.textContent = message;
}

function hideAllStates() {
    elements.loadingState.classList.add('d-none');
    elements.errorState.classList.add('d-none');
    elements.noResultsState.classList.add('d-none');
}

window.viewLandDetails = function(landId) {
    try {
        // Store only the land ID in localStorage
        localStorage.setItem('landId', landId);
        localStorage.removeItem('isPurchased');
        
        // Navigate to details page with the land_id
        window.location.href = `landDetailPage.html?id=${landId}`;
    } catch (error) {
        console.error('Error storing land data:', error);
        // Fallback: navigate with ID only
        window.location.href = `landDetailPage.html?id=${landId}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updatePriceRangeDisplay();

    const savedSearch = localStorage.getItem('searchTerm');
    const savedLandType = localStorage.getItem('landTypeFilter');
    
    if (savedSearch) {
        currentSearchQuery = savedSearch;
        elements.searchInput.value = savedSearch;
        localStorage.removeItem('searchTerm');
    }
    
    if (savedLandType && savedLandType !== 'all') {
        currentSelectedType = savedLandType;
        localStorage.removeItem('landTypeFilter');
    }

    fetchLands();
});

window.showPropertyDetails = showPropertyDetails;