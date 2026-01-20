let currentLand = null;
let images = [];
let currentImageIndex = 0;
let imageGalleryModal = null;
let purchaseConfirmationModal = null;
let successToast = null;
let errorToast = null;

const base_url = '/api/proxy?url=http://72.61.169.226';

let elements = {};

let currentUser = null;

function proxyUrl(url) {
    if (!url || url === 'null' || url === 'undefined') return "";
    
    if (url.startsWith("http://") || url.startsWith("https://")) {
        if (url.includes('72.61.169.226')) {
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (isLocalhost) {
                return `/api/proxy?url=${encodeURIComponent(url)}`;
            } else {
                return `/api/proxy?url=${encodeURIComponent(url)}`;
            }
        }
        return url;
    }
    
    if (url.startsWith('/')) {
        const fullUrl = `${base_url}${url}`;
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalhost) {
            return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
        } else {
            return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
        }
    }
    
    const fullUrl = `${base_url}/${url}`;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
        return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
    } else {
        return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
    }
}

function safeUrl(url) {
    if (!url || url === 'null' || url === 'undefined') return "#";
    return proxyUrl(url);
}

function formatPrice(price) {
    if (!price) return '₹0';
    return `₹${parseInt(price).toLocaleString('en-IN')}`;
}

function getLandTypeLabel(type) {
    if (!type) return 'Land Property';
    
    const typeMap = {
        'agri': 'Agricultural Land',
        'agricultural': 'Agricultural Land',
        'agricultrue': 'Agricultural Land',
        'residential': 'Residential Plot',
        'commercial': 'Commercial Property',
        'forest': 'Forest/Timber Land',
        'industrial': 'Industrial Property',
        'recreational': 'Recreational Property',
        'timber': 'Timber Land',
        'development': 'Development Land'
    };
    return typeMap[type.toLowerCase()] || 'Land Property';
}

function formatLocation(location) {
    if (!location) return 'Location not specified';
    
    const parts = [];
    if (location.village && location.village !== 'null') parts.push(location.village);
    if (location.mandal && location.mandal !== 'null') parts.push(location.mandal);
    if (location.district && location.district !== 'null') parts.push(location.district);
    if (location.state && location.state !== 'null') parts.push(location.state);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
}

function initializeElements() {
    elements = {
        mobileMenu: document.getElementById('mobileMenu'),
        openMobileMenu: document.getElementById('openMobileMenu'),
        closeMobileMenu: document.getElementById('closeMobileMenu'),
        
        backToLandingBtn: document.getElementById('backToLandingBtn'),
        backToLandingDesktopBtn: document.getElementById('backToLandingDesktopBtn'),
        backToLandingErrorBtn: document.getElementById('backToLandingErrorBtn'),
        
        loadingState: document.getElementById('loadingState'),
        errorState: document.getElementById('errorState'),
        errorMessage: document.getElementById('errorMessage'),
        propertyContent: document.getElementById('propertyContent'),
        
        mobilePropertyHeader: document.getElementById('mobilePropertyHeader'),
        mobilePropertyTitle: document.getElementById('mobilePropertyTitle'),
        mobilePropertyLocation: document.getElementById('mobilePropertyLocation'),
        mobilePropertyPrice: document.getElementById('mobilePropertyPrice'),
        mobilePropertyPricePerAcre: document.getElementById('mobilePropertyPricePerAcre'),
        desktopPropertyTitle: document.getElementById('desktopPropertyTitle'),
        desktopPropertyLocation: document.getElementById('desktopPropertyLocation'),
        desktopPropertyPrice: document.getElementById('desktopPropertyPrice'),
        desktopPropertyPricePerAcre: document.getElementById('desktopPropertyPricePerAcre'),
        
        mainImage: document.getElementById('mainImage'),
        mainImageContainer: document.getElementById('mainImageContainer'),
        prevImageBtn: document.getElementById('prevImageBtn'),
        nextImageBtn: document.getElementById('nextImageBtn'),
        currentImageIndexSpan: document.getElementById('currentImageIndex'),
        totalImagesSpan: document.getElementById('totalImages'),
        thumbnailsRow: document.getElementById('thumbnailsRow'),
        
        modalImage: document.getElementById('modalImage'),
        modalImageIndex: document.getElementById('modalImageIndex'),
        modalTotalImages: document.getElementById('modalTotalImages'),
        modalPrevBtn: document.getElementById('modalPrevBtn'),
        modalNextBtn: document.getElementById('modalNextBtn'),
        modalImageContainer: document.getElementById('modalImageContainer'),
        
        purchaseModalImage: document.getElementById('purchaseModalImage'),
        purchaseModalTitle: document.getElementById('purchaseModalTitle'),
        purchaseModalLocation: document.getElementById('purchaseModalLocation'),
        purchaseModalPrice: document.getElementById('purchaseModalPrice'),
        landCodeInput: document.getElementById('landCodeInput'),
        confirmPurchaseBtn: document.getElementById('confirmPurchaseBtn'),
        confirmPurchaseText: document.getElementById('confirmPurchaseText'),
        confirmPurchaseSpinner: document.getElementById('confirmPurchaseSpinner'),
        
        toastMessage: document.getElementById('toastMessage'),
        errorToastMessage: document.getElementById('errorToastMessage'),
        
        propertyDescription: document.getElementById('propertyDescription'),
        landArea: document.getElementById('landArea'),
        waterSource: document.getElementById('waterSource'),
        garden: document.getElementById('garden'),
        residential: document.getElementById('residential'),
        fencing: document.getElementById('fencing'),
        farmPond: document.getElementById('farmPond'),
        shedDetails: document.getElementById('shedDetails'),
        roadAccess: document.getElementById('roadAccess'),
        roadAccessDetail: document.getElementById('roadAccessDetail'),
        
        passbookLink: document.getElementById('passbookLink'),
        borderMapLink: document.getElementById('borderMapLink'),
        photoCount: document.getElementById('photoCount'),
        videoCount: document.getElementById('videoCount'),
        videoSection: document.getElementById('videoSection'),
        propertyVideo: document.getElementById('propertyVideo'),
        
        gpsCoordinates: document.getElementById('gpsCoordinates'),
        pathToLand: document.getElementById('pathToLand'),
        
        ownerName: document.getElementById('ownerName'),
        ownerPhone: document.getElementById('ownerPhone'),
        ownerEducation: document.getElementById('ownerEducation'),
        ownerAge: document.getElementById('ownerAge'),
        
        disputeStatus: document.getElementById('disputeStatus'),
        disputeType: document.getElementById('disputeType'),
        landOwnership: document.getElementById('landOwnership'),
        mortgageStatus: document.getElementById('mortgageStatus'),
        
        mobileQuickContactBtn: document.getElementById('mobileQuickContactBtn'),
        mobileFavoriteBtn: document.getElementById('mobileFavoriteBtn'),
        mobileQuickShareBtn: document.getElementById('mobileQuickShareBtn'),
        mobileContactBtn: document.getElementById('mobileContactBtn'),
        desktopContactBtn: document.getElementById('desktopContactBtn'),
        ownerContactBtn: document.getElementById('ownerContactBtn'),
        viewOnMapsBtn: document.getElementById('viewOnMapsBtn'),
        scheduleVisitBtn: document.getElementById('scheduleVisitBtn'),
        downloadBrochureBtn: document.getElementById('downloadBrochureBtn'),
        sharePropertyBtn: document.getElementById('sharePropertyBtn'),
        desktopShareBtn: document.getElementById('desktopShareBtn'),
        printDetailsBtn: document.getElementById('printDetailsBtn'),
        savePropertyBtn: document.getElementById('savePropertyBtn'),
        reportPropertyBtn: document.getElementById('reportPropertyBtn'),
        mobileFloatingBtn: document.getElementById('mobileFloatingBtn'),
        retryBtn: document.getElementById('retryBtn'),
        mobileVisitBtn: document.getElementById('mobileVisitBtn'),
        mobileShareBtn: document.getElementById('mobileShareBtn'),
        buyerName: document.getElementById('buyerName'),
        buyerPhone: document.getElementById('buyerPhone'),
        buyerDescription: document.getElementById('buyerDescription'),
        purchaseLandCode: document.getElementById('purchaseLandCode'),
        purchaseForm: document.getElementById('purchaseForm')
    };
    
    const modalElement = document.getElementById('imageGalleryModal');
    if (modalElement) {
        imageGalleryModal = new bootstrap.Modal(modalElement);
    }
    
    const purchaseModalElement = document.getElementById('purchaseConfirmationModal');
    if (purchaseModalElement) {
        purchaseConfirmationModal = new bootstrap.Modal(purchaseModalElement);
    }
    
    const successToastElement = document.getElementById('successToast');
    if (successToastElement) {
        successToast = new bootstrap.Toast(successToastElement, { delay: 5000 });
    }
    
    const errorToastElement = document.getElementById('errorToast');
    if (errorToastElement) {
        errorToast = new bootstrap.Toast(errorToastElement, { delay: 5000 });
    }
}

function getJwtToken() {
    return localStorage.getItem('token');
}

async function fetchUserProfile() {
    try {
        const token = getJwtToken();
        const response = await fetch(`${base_url}/user/details`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user; // Store user data globally
            return currentUser;
        } else {
            localStorage.removeItem('token');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

function redirectToLogin() {
    window.location.href = '../index.html';
}

function autoPopulatePurchaseForm() {
    if (!currentUser) return;
    
    if (elements.buyerName) {
        elements.buyerName.value = currentUser.name || '';
    }
    
    if (elements.buyerPhone) {
        elements.buyerPhone.value = currentUser.phone || '';
    }
}

function checkIfLandPurchased() {
    const isPurchased = localStorage.getItem('isPurchased') === 'true';
    
    if (isPurchased) {
        // Hide all buy buttons
        const buyButtons = [
            elements.mobileQuickContactBtn,
            elements.mobileContactBtn,
            elements.desktopContactBtn,
            elements.ownerContactBtn,
            elements.mobileFloatingBtn
        ];
        
        buyButtons.forEach(btn => {
            if (btn) {
                btn.style.display = 'none';
            }
        });
        
        // Optionally show a message or alternative button
        showPurchasedStatusMessage();
    }
    
    // Clear the flag after checking
    localStorage.removeItem('isPurchased');
}

function showPurchasedStatusMessage() {
    // You can add a message or change the button text
    const ownerInfoSection = document.querySelector('.bg-white.rounded-3.shadow-sm.p-4.mb-4');
    if (ownerInfoSection && elements.ownerContactBtn) {
        // Replace the buy button with a status message
        elements.ownerContactBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Already Purchased';
        elements.ownerContactBtn.classList.remove('btn-success');
        elements.ownerContactBtn.classList.add('btn-secondary');
        elements.ownerContactBtn.disabled = true;
    }
}

async function checkUserPurchaseStatus() {
    const token = getJwtToken();
    if (!token || !currentLand) return;
    
    try {
        const response = await fetch('http://72.61.169.226/user/land-purchase', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.message && data.data) {
                // Check if current land is in the user's purchase requests
                const hasPurchased = data.data.some(purchase => 
                    purchase.land_id === currentLand.land_id
                );
                
                if (hasPurchased) {
                    hideBuyButtons();
                    showPurchasedStatusMessage();
                }
            }
        }
    } catch (error) {
        console.error('Error checking purchase status:', error);
    }
}

function hideBuyButtons() {
    const buyButtons = [
        elements.mobileQuickContactBtn,
        elements.mobileContactBtn,
        elements.desktopContactBtn,
        elements.ownerContactBtn,
        elements.mobileFloatingBtn
    ];
    
    buyButtons.forEach(btn => {
        if (btn) {
            btn.style.display = 'none';
        }
    });
    
    const purchaseModalTriggers = [elements.mobileQuickContactBtn, elements.mobileContactBtn, 
                                   elements.desktopContactBtn, elements.ownerContactBtn, 
                                   elements.mobileFloatingBtn];
    
    purchaseModalTriggers.forEach(trigger => {
        if (trigger) {
            trigger.removeEventListener('click', openPurchaseConfirmation);
        }
    });
}

function showPurchasedStatusMessage() {
    // You can add a message or change the button text
    const ownerInfoSection = document.querySelector('.bg-white.rounded-3.shadow-sm.p-4.mb-4');
    if (ownerInfoSection && elements.ownerContactBtn) {
        // Replace the buy button with a status message
        elements.ownerContactBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Already Purchased';
        elements.ownerContactBtn.classList.remove('btn-success');
        elements.ownerContactBtn.classList.add('btn-secondary');
        elements.ownerContactBtn.disabled = true;
    }
}

async function checkUserPurchaseStatus() {
    const token = getJwtToken();
    if (!token || !currentLand) return;
    
    try {
        // Fetch user's purchase requests
        const response = await fetch('http://72.61.169.226/user/land-purchase', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.message && data.data) {
                // Check if current land is in the user's purchase requests
                const hasPurchased = data.data.some(purchase => 
                    purchase.land_id === currentLand.land_id
                );
                
                if (hasPurchased) {
                    hideBuyButtons();
                    showPurchasedStatusMessage();
                }
            }
        }
    } catch (error) {
        console.error('Error checking purchase status:', error);
    }
}

function hideBuyButtons() {
    const buyButtons = [
        elements.mobileQuickContactBtn,
        elements.mobileContactBtn,
        elements.desktopContactBtn,
        elements.ownerContactBtn,
        elements.mobileFloatingBtn
    ];
    
    buyButtons.forEach(btn => {
        if (btn) {
            btn.style.display = 'none';
        }
    });
    
    // Also hide the purchase confirmation modal trigger
    const purchaseModalTriggers = [elements.mobileQuickContactBtn, elements.mobileContactBtn, 
                                   elements.desktopContactBtn, elements.ownerContactBtn, 
                                   elements.mobileFloatingBtn];
    
    purchaseModalTriggers.forEach(trigger => {
        if (trigger) {
            trigger.removeEventListener('click', openPurchaseConfirmation);
        }
    });
}

function updateMainImage() {
    if (!elements.mainImage) return;
    
    if (images.length > 0 && currentImageIndex < images.length) {
        const imageUrl = images[currentImageIndex];
        elements.mainImage.src = imageUrl;
        elements.mainImage.onerror = function() {
            console.error('Failed to load image:', imageUrl);
            this.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200';
        };
    } else {
        elements.mainImage.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200';
    }
    
    if (elements.currentImageIndexSpan) {
        elements.currentImageIndexSpan.textContent = images.length > 0 ? currentImageIndex + 1 : '0';
    }
    
    updateThumbnailSelection();
}

function updateThumbnailSelection() {
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function createThumbnails() {
    if (!elements.thumbnailsRow) return;
    
    elements.thumbnailsRow.innerHTML = '';
    
    if (images.length === 0) {
        elements.thumbnailsRow.innerHTML = `
            <div class="col-12 text-center py-3 text-muted">
                No images available
            </div>
        `;
        return;
    }
    
    const thumbnailsToShow = images.slice(0, 4);
    
    thumbnailsToShow.forEach((image, index) => {
        const col = document.createElement('div');
        col.className = 'col-3';
        
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail-item ${index === currentImageIndex ? 'active' : ''}`;
        thumbnail.onclick = () => {
            currentImageIndex = index;
            updateMainImage();
        };
        
        const img = document.createElement('img');
        img.src = image;
        img.alt = `Thumbnail ${index + 1}`;
        img.className = 'w-100 h-100 object-fit-cover';
        img.style.height = '80px';
        img.onerror = function() {
            console.error('Failed to load thumbnail:', image);
            this.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300';
        };
        
        thumbnail.appendChild(img);
        col.appendChild(thumbnail);
        elements.thumbnailsRow.appendChild(col);
    });
}

function nextImage() {
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateMainImage();
}

function prevImage() {
    if (images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateMainImage();
}

function initializeFormHandling() {
    if (elements.purchaseForm) {
        elements.purchaseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitPurchaseRequest();
        });
    }
    
    if (elements.confirmPurchaseBtn) {
        elements.confirmPurchaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (elements.purchaseForm && elements.purchaseForm.checkValidity()) {
                submitPurchaseRequest();
            } else {
                if (elements.purchaseForm) {
                    elements.purchaseForm.reportValidity();
                }
            }
        });
    }
}

function openImageGallery() {
    if (images.length === 0 || !imageGalleryModal) return;
    
    if (elements.modalImage && images[currentImageIndex]) {
        elements.modalImage.src = images[currentImageIndex];
        elements.modalImage.onerror = function() {
            console.error('Failed to load modal image:', images[currentImageIndex]);
            this.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200';
        };
    }
    
    if (elements.modalImageIndex) {
        elements.modalImageIndex.textContent = currentImageIndex + 1;
    }
    
    if (elements.modalTotalImages) {
        elements.modalTotalImages.textContent = images.length;
    }
    
    imageGalleryModal.show();
}

async function loadLandData() {
    showLoading();
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const landId = urlParams.get('id');
        
        const storedLandId = localStorage.getItem('landId') || landId;
        
        if (!storedLandId) {
            throw new Error('No land ID specified');
        }
        
        console.log('Fetching land data for ID:', storedLandId);
        
        let response = await fetch(`${base_url}/user/verified/land/${storedLandId}`);
        
        if (!response.ok) {
            console.log('Single land endpoint failed, trying all lands endpoint');
            const allResponse = await fetch(`${base_url}/user/verified/land`);
            
            if (!allResponse.ok) {
                throw new Error(`HTTP error! status: ${allResponse.status}`);
            }
            
            const allData = await allResponse.json();
            
            if (allData.message && allData.data) {
                const landData = allData.data.find(l => l.land_id === storedLandId);
                if (landData) {
                    currentLand = landData;
                    renderLandData();
                } else {
                    throw new Error('Land not found in API data');
                }
            } else {
                throw new Error('Invalid API response format');
            }
        } else {
            const data = await response.json();
            
            if (data.message && data.data) {
                currentLand = data.data;
                renderLandData();
            } else {
                throw new Error('Invalid API response format');
            }
        }
        
        localStorage.removeItem('landId');
        localStorage.removeItem('currentLand');
        
    } catch (error) {
        console.error('Error loading land data:', error);
        showError(error.message);
    }
}

function renderLandData() {
    if (!currentLand) return;
    
    console.log('Rendering land data:', currentLand);
    
    const documentMedia = currentLand.document_media || {};
    
    images = (documentMedia.land_photo || []).map(img => proxyUrl(img));
    
    if (elements.totalImagesSpan) {
        elements.totalImagesSpan.textContent = images.length;
    }
    
    const landDetails = currentLand.land_details || {};
    const landLocation = currentLand.land_location || {};
    const farmerDetails = currentLand.farmer_details || {};
    const gpsTracking = currentLand.gps_tracking || {};
    const disputeDetails = currentLand.dispute_details || {};
    
    const landType = getLandTypeLabel(landDetails.land_type);
    const landArea = landDetails.land_area || '0 acres';
    
    if (elements.mobilePropertyTitle) {
        elements.mobilePropertyTitle.textContent = `${landType} - ${landArea}`;
    }
    
    if (elements.desktopPropertyTitle) {
        elements.desktopPropertyTitle.textContent = `${landType} - ${landArea}`;
    }
    
    if (elements.mobilePropertyLocation) {
        elements.mobilePropertyLocation.textContent = formatLocation(landLocation);
    }
    
    if (elements.desktopPropertyLocation) {
        elements.desktopPropertyLocation.textContent = formatLocation(landLocation);
    }
    
    if (elements.mobilePropertyPrice) {
        elements.mobilePropertyPrice.textContent = formatPrice(landDetails.total_land_price);
    }
    
    if (elements.desktopPropertyPrice) {
        elements.desktopPropertyPrice.textContent = formatPrice(landDetails.total_land_price);
    }
    
    const pricePerAcre = formatPrice(landDetails.price_per_acre) + ' per acre';
    if (elements.mobilePropertyPricePerAcre) {
        elements.mobilePropertyPricePerAcre.textContent = pricePerAcre;
    }
    
    if (elements.desktopPropertyPricePerAcre) {
        elements.desktopPropertyPricePerAcre.textContent = pricePerAcre;
    }
    
    if (elements.propertyDescription) {
        elements.propertyDescription.textContent = 
            `This ${landArea.toLowerCase()} ${landType.toLowerCase()} is located in the prime area of ${landLocation?.village || 'the region'}, ${landLocation?.district || 'the district'}. 
            The property features excellent connectivity and is suitable for various purposes.`;
    }
    
    if (elements.landArea) elements.landArea.textContent = landArea;
    if (elements.waterSource) elements.waterSource.textContent = landDetails.water_source || 'Not specified';
    if (elements.garden) elements.garden.textContent = landDetails.garden || 'No';
    if (elements.residential) elements.residential.textContent = landDetails.residental || 'No';
    if (elements.fencing) elements.fencing.textContent = landDetails.fencing || 'Not available';
    if (elements.farmPond) elements.farmPond.textContent = landDetails.farm_pond || 'No';
    if (elements.shedDetails) elements.shedDetails.textContent = landDetails.shed_details || 'Not available';
    if (elements.roadAccess) elements.roadAccess.textContent = gpsTracking.road_path || 'Not specified';
    if (elements.roadAccessDetail) elements.roadAccessDetail.textContent = gpsTracking.road_path || 'Not specified';
    
    if (elements.passbookLink && landDetails.passbook_photo) {
        elements.passbookLink.href = safeUrl(landDetails.passbook_photo);
        elements.passbookLink.target = '_blank';
        elements.passbookLink.style.display = 'block';
    } else if (elements.passbookLink) {
        elements.passbookLink.style.display = 'none';
    }
    
    if (elements.borderMapLink && gpsTracking.land_border) {
        elements.borderMapLink.href = safeUrl(gpsTracking.land_border);
        elements.borderMapLink.target = '_blank';
        elements.borderMapLink.style.display = 'block';
    } else if (elements.borderMapLink) {
        elements.borderMapLink.style.display = 'none';
    }
    
    if (elements.photoCount) {
        elements.photoCount.textContent = `${images.length} image${images.length !== 1 ? 's' : ''} available`;
    }
    
    const videoUrls = documentMedia.land_video || [];
    const videoCount = videoUrls.length;
    if (elements.videoCount) {
        elements.videoCount.textContent = `${videoCount} video${videoCount !== 1 ? 's' : ''} available`;
    }
    
    if (elements.videoSection && videoCount > 0 && elements.propertyVideo) {
        elements.videoSection.classList.remove('d-none');
        const videoUrl = proxyUrl(videoUrls[0]);
        elements.propertyVideo.src = videoUrl;
        elements.propertyVideo.poster = images[0] || '';
        elements.propertyVideo.onerror = function() {
            console.error('Failed to load video:', videoUrl);
            elements.videoSection.classList.add('d-none');
        };
    } else if (elements.videoSection) {
        elements.videoSection.classList.add('d-none');
    }
    
    const lat = gpsTracking.latitude;
    const lng = gpsTracking.longitude;
    if (elements.gpsCoordinates) {
        elements.gpsCoordinates.textContent = lat && lng ? `${lat}, ${lng}` : 'Not available';
    }
    
    if (elements.pathToLand) {
        elements.pathToLand.textContent = disputeDetails.path_to_land || 'Not specified';
    }
    
    if (elements.ownerName) elements.ownerName.textContent = farmerDetails.name || 'Not available';
    if (elements.ownerPhone) elements.ownerPhone.textContent = farmerDetails.phone || 'Not available';
    if (elements.ownerEducation) elements.ownerEducation.textContent = farmerDetails.literacy || 'Not specified';
    if (elements.ownerAge) elements.ownerAge.textContent = farmerDetails.age_group || 'Not specified';
    
    const disputeType = disputeDetails.dispute_type || 'Not specified';
    if (elements.disputeType) {
        elements.disputeType.textContent = disputeType;
    }
    
    if (elements.disputeStatus) {
        if (disputeType.toLowerCase() === 'none' || disputeType.toLowerCase() === 'no') {
            elements.disputeStatus.style.background = '#d1fae5';
            elements.disputeStatus.style.borderColor = '#10b981';
            if (elements.disputeType) {
                elements.disputeType.style.color = '#059669';
            }
        } else {
            elements.disputeStatus.style.background = '#fef3c7';
            elements.disputeStatus.style.borderColor = '#f59e0b';
            if (elements.disputeType) {
                elements.disputeType.style.color = '#d97706';
            }
        }
    }
    
    if (elements.landOwnership) elements.landOwnership.textContent = farmerDetails.land_ownership || 'Not specified';
    if (elements.mortgageStatus) elements.mortgageStatus.textContent = farmerDetails.mortgage || 'Not specified';
    
    updateMainImage();
    createThumbnails();
    
    showContent();
}

function showLoading() {
    if (elements.loadingState) elements.loadingState.classList.remove('d-none');
    if (elements.errorState) elements.errorState.classList.add('d-none');
    if (elements.propertyContent) elements.propertyContent.classList.add('d-none');
}

function showError(message) {
    if (elements.loadingState) elements.loadingState.classList.add('d-none');
    if (elements.errorState) elements.errorState.classList.remove('d-none');
    if (elements.propertyContent) elements.propertyContent.classList.add('d-none');
    if (elements.errorMessage) elements.errorMessage.textContent = message;
}

function showContent() {
    if (elements.loadingState) elements.loadingState.classList.add('d-none');
    if (elements.errorState) elements.errorState.classList.add('d-none');
    if (elements.propertyContent) elements.propertyContent.classList.remove('d-none');
}

function showPurchaseModal() {
    if (elements.purchaseModalImage) {
        elements.purchaseModalImage.src = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300';
    }
    
    if (elements.purchaseModalTitle) {
        elements.purchaseModalTitle.textContent = elements.desktopPropertyTitle.textContent || 
                                                 elements.mobilePropertyTitle.textContent;
    }
    
    if (elements.purchaseModalLocation) {
        elements.purchaseModalLocation.textContent = elements.desktopPropertyLocation.textContent || 
                                                    elements.mobilePropertyLocation.textContent;
    }
    
    if (elements.purchaseModalPrice) {
        elements.purchaseModalPrice.textContent = elements.desktopPropertyPrice.textContent || 
                                                 elements.mobilePropertyPrice.textContent;
    }
    
    if (elements.landCodeInput && currentLand.land_id) {
        elements.landCodeInput.value = currentLand.land_id;
    }
    
    if (elements.purchaseLandCode && currentLand.land_id) {
        elements.purchaseLandCode.textContent = currentLand.land_id;
    }
    
    autoPopulatePurchaseForm();
    
    if (elements.buyerDescription) {
        elements.buyerDescription.value = '';
    }
    
    if (elements.confirmPurchaseBtn) {
        elements.confirmPurchaseBtn.disabled = false;
    }
    if (elements.confirmPurchaseSpinner) {
        elements.confirmPurchaseSpinner.classList.add('d-none');
    }
    if (elements.confirmPurchaseText) {
        elements.confirmPurchaseText.textContent = 'Submit Purchase Request';
    }
    
    if (purchaseConfirmationModal) {
        purchaseConfirmationModal.show();
    }
}

function openPurchaseConfirmation() {
    if (!currentLand) {
        showErrorToast('Land information not loaded');
        return;
    }
    
    const token = getJwtToken();
    if (!token) {
        showErrorToast('Please login to make a purchase request');
        setTimeout(() => redirectToLogin(), 1500);
        return;
    }

    if (!currentUser) {
        fetchUserProfile().then(user => {
            if (user) {
                showPurchaseModal();
            } else {
                showErrorToast('Unable to load user profile');
            }
        });
    } else {
        showPurchaseModal();
    }
    
    if (elements.purchaseModalImage) {
        elements.purchaseModalImage.src = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300';
    }
    
    if (elements.purchaseModalTitle) {
        elements.purchaseModalTitle.textContent = elements.desktopPropertyTitle.textContent || 
                                                 elements.mobilePropertyTitle.textContent;
    }
    
    if (elements.purchaseModalLocation) {
        elements.purchaseModalLocation.textContent = elements.desktopPropertyLocation.textContent || 
                                                    elements.mobilePropertyLocation.textContent;
    }
    
    if (elements.purchaseModalPrice) {
        elements.purchaseModalPrice.textContent = elements.desktopPropertyPrice.textContent || 
                                                 elements.mobilePropertyPrice.textContent;
    }
    
    if (elements.landCodeInput && currentLand.land_id) {
        elements.landCodeInput.value = currentLand.land_id;
    }
    
    if (elements.purchaseLandCode && currentLand.land_id) {
        elements.purchaseLandCode.textContent = currentLand.land_id;
    }
    if (elements.buyerDescription) {
        elements.buyerDescription.value = '';
    }
    
    if (elements.confirmPurchaseBtn) {
        elements.confirmPurchaseBtn.disabled = false;
    }
    if (elements.confirmPurchaseSpinner) {
        elements.confirmPurchaseSpinner.classList.add('d-none');
    }
    if (elements.confirmPurchaseText) {
        elements.confirmPurchaseText.textContent = 'Submit Purchase Request';
    }
    
    if (purchaseConfirmationModal) {
        purchaseConfirmationModal.show();
    }
}

async function submitPurchaseRequest() {
    if (!currentLand) {
        showErrorToast('Land information not loaded');
        return;
    }
    
    const token = getJwtToken();
    if (!token) {
        showErrorToast('Session expired. Please login again.');
        setTimeout(() => redirectToLogin(), 1500);
        return;
    }
    
    if (!elements.buyerName || !elements.buyerName.value.trim()) {
        showErrorToast('Please enter your name');
        if (elements.buyerName) elements.buyerName.focus();
        return;
    }
    
    if (!elements.buyerPhone || !elements.buyerPhone.value.trim()) {
        showErrorToast('Please enter your phone number');
        if (elements.buyerPhone) elements.buyerPhone.focus();
        return;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(elements.buyerPhone.value.trim().replace(/[\s\-\(\)]/g, ''))) {
        showErrorToast('Please enter a valid phone number');
        if (elements.buyerPhone) elements.buyerPhone.focus();
        return;
    }
    
    if (elements.confirmPurchaseBtn) {
        elements.confirmPurchaseBtn.disabled = true;
    }
    if (elements.confirmPurchaseSpinner) {
        elements.confirmPurchaseSpinner.classList.remove('d-none');
    }
    if (elements.confirmPurchaseText) {
        elements.confirmPurchaseText.textContent = 'Processing...';
    }
    
    try {
        const requestData = {
            land_id: currentLand.land_id,
            status: 'pending',
            land_code: elements.landCodeInput ? elements.landCodeInput.value.trim() : currentLand.land_id,
            name: elements.buyerName.value.trim(),
            phone: elements.buyerPhone.value.trim(),
            description: elements.buyerDescription ? elements.buyerDescription.value.trim() : ''
        };
        
        console.log('Submitting purchase request:', requestData);
        
        const response = await fetch(`${base_url}/user/land-purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });
        
        if (elements.confirmPurchaseBtn) {
            elements.confirmPurchaseBtn.disabled = false;
        }
        if (elements.confirmPurchaseSpinner) {
            elements.confirmPurchaseSpinner.classList.add('d-none');
        }
        if (elements.confirmPurchaseText) {
            elements.confirmPurchaseText.textContent = 'Submit Purchase Request';
        }
        
        if (response.ok) {
            const data = await response.json();
            
            if (purchaseConfirmationModal) {
                purchaseConfirmationModal.hide();
            }
            
            showSuccessToast(data.message || '✅ Purchase request submitted successfully! Our team will contact you soon.');
            
            updateUIAfterPurchase();
            
            if (elements.purchaseForm) {
                elements.purchaseForm.reset();
            }
            
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Error submitting purchase request:', error);
        
        if (elements.confirmPurchaseBtn) {
            elements.confirmPurchaseBtn.disabled = false;
        }
        if (elements.confirmPurchaseSpinner) {
            elements.confirmPurchaseSpinner.classList.add('d-none');
        }
        if (elements.confirmPurchaseText) {
            elements.confirmPurchaseText.textContent = 'Submit Purchase Request';
        }
        
        showErrorToast(error.message || 'Failed to submit purchase request. Please try again.');
    }
}

function updateUIAfterPurchase() {
    const buyButtons = [
        elements.mobileQuickContactBtn,
        elements.mobileContactBtn,
        elements.desktopContactBtn,
        elements.ownerContactBtn,
        elements.mobileFloatingBtn
    ];
    
    buyButtons.forEach(btn => {
        if (btn) {
            btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Request Sent';
            btn.classList.remove('btn-success');
            btn.classList.add('btn-secondary');
            btn.disabled = true;
            btn.onclick = null;
        }
    });
}

function showSuccessToast(message) {
    if (elements.toastMessage && successToast) {
        elements.toastMessage.textContent = message;
        successToast.show();
    }
}

function showErrorToast(message) {
    if (elements.errorToastMessage && errorToast) {
        elements.errorToastMessage.textContent = message;
        errorToast.show();
    }
}

function initializeEventListeners() {
    if (elements.openMobileMenu) {
        elements.openMobileMenu.addEventListener('click', () => {
            if (elements.mobileMenu) {
                elements.mobileMenu.style.display = 'block';
            }
        });
    }

    if (elements.closeMobileMenu) {
        elements.closeMobileMenu.addEventListener('click', () => {
            if (elements.mobileMenu) {
                elements.mobileMenu.style.display = 'none';
            }
        });
    }

    if (elements.backToLandingBtn) {
        elements.backToLandingBtn.addEventListener('click', () => {
            window.location.href = 'landPage.html';
        });
    }

    if (elements.backToLandingDesktopBtn) {
        elements.backToLandingDesktopBtn.addEventListener('click', () => {
            window.location.href = 'landPage.html';
        });
    }

    if (elements.backToLandingErrorBtn) {
        elements.backToLandingErrorBtn.addEventListener('click', () => {
            window.location.href = 'landPage.html';
        });
    }

    if (elements.prevImageBtn) {
        elements.prevImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });
    }

    if (elements.nextImageBtn) {
        elements.nextImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });
    }

    if (elements.mainImageContainer) {
        elements.mainImageContainer.addEventListener('click', openImageGallery);
    }

    if (elements.modalPrevBtn) {
        elements.modalPrevBtn.addEventListener('click', () => {
            prevImage();
            if (elements.modalImage && images[currentImageIndex]) {
                elements.modalImage.src = images[currentImageIndex];
            }
            if (elements.modalImageIndex) {
                elements.modalImageIndex.textContent = currentImageIndex + 1;
            }
        });
    }

    if (elements.modalNextBtn) {
        elements.modalNextBtn.addEventListener('click', () => {
            nextImage();
            if (elements.modalImage && images[currentImageIndex]) {
                elements.modalImage.src = images[currentImageIndex];
            }
            if (elements.modalImageIndex) {
                elements.modalImageIndex.textContent = currentImageIndex + 1;
            }
        });
    }

    const buyButtons = [
        elements.mobileQuickContactBtn,
        elements.mobileContactBtn,
        elements.desktopContactBtn,
        elements.ownerContactBtn,
        elements.mobileFloatingBtn
    ];
    
    buyButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openPurchaseConfirmation);
        }
    });

    if (elements.viewOnMapsBtn) {
        elements.viewOnMapsBtn.addEventListener('click', () => {
            const lat = currentLand?.gps_tracking?.latitude;
            const lng = currentLand?.gps_tracking?.longitude;
            if (lat && lng) {
                window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
            } else {
                alert('GPS coordinates not available');
            }
        });
    }

    const shareButtons = [
        elements.mobileQuickShareBtn,
        elements.sharePropertyBtn,
        elements.desktopShareBtn,
        elements.mobileShareBtn
    ];
    
    shareButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', shareProperty);
        }
    });

    if (elements.scheduleVisitBtn) {
        elements.scheduleVisitBtn.addEventListener('click', () => {
            alert('Site visit scheduling feature coming soon!');
        });
    }

    if (elements.mobileVisitBtn) {
        elements.mobileVisitBtn.addEventListener('click', () => {
            alert('Site visit scheduling feature coming soon!');
        });
    }

    if (elements.downloadBrochureBtn) {
        elements.downloadBrochureBtn.addEventListener('click', () => {
            alert('Brochure download feature coming soon!');
        });
    }

    if (elements.printDetailsBtn) {
        elements.printDetailsBtn.addEventListener('click', () => {
            window.print();
        });
    }

    if (elements.savePropertyBtn) {
        elements.savePropertyBtn.addEventListener('click', () => {
            alert('Property saved to favorites!');
        });
    }

    if (elements.reportPropertyBtn) {
        elements.reportPropertyBtn.addEventListener('click', () => {
            alert('Report feature coming soon!');
        });
    }

    if (elements.mobileFavoriteBtn) {
        elements.mobileFavoriteBtn.addEventListener('click', () => {
            alert('Property saved to favorites!');
        });
    }

    if (elements.retryBtn) {
        elements.retryBtn.addEventListener('click', loadLandData);
    }
}

function shareProperty() {
    if (navigator.share) {
        navigator.share({
            title: currentLand?.land_details?.title || 'Land Property',
            text: `Check out this ${getLandTypeLabel(currentLand?.land_details?.land_type)} at ${formatPrice(currentLand?.land_details?.total_land_price)}`,
            url: window.location.href,
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
}

function initialize() {
    initializeElements();
    initializeEventListeners();
    initializeFormHandling();
    const token = getJwtToken();
    if (token) {
        fetchUserProfile();
    }
    checkIfLandPurchased();
    loadLandData().then(() => {
        if (currentLand) {
            checkUserPurchaseStatus();
        }
    });
    loadLandData();
}

document.addEventListener('DOMContentLoaded', initialize);