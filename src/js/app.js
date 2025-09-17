// Main Application Controller
class TADAMApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'kala-kitchen';
        this.savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthentication();
        this.initializeSampleRecipes();
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // User type selection
        const userTypes = document.querySelectorAll('.user-type');
        userTypes.forEach(type => {
            type.addEventListener('click', () => this.selectUserType(type));
        });

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Tab navigation
        const navTabs = document.querySelectorAll('.nav-tab:not(.coming-soon)');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Recipe actions
        const saveBtn = document.getElementById('saveRecipe');
        const shareBtn = document.getElementById('shareRecipe');
        const printBtn = document.getElementById('printRecipe');

        if (saveBtn) saveBtn.addEventListener('click', () => this.saveRecipe());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareRecipe());
        if (printBtn) printBtn.addEventListener('click', () => this.printRecipe());
    }

    checkAuthentication() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.showMainPlatform();
        }
    }

    selectUserType(selectedType) {
        document.querySelectorAll('.user-type').forEach(type => {
            type.classList.remove('active');
        });
        selectedType.classList.add('active');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userType = document.querySelector('.user-type.active').dataset.type;
        const loginBtn = document.querySelector('.login-btn');
        const btnLoader = document.querySelector('.btn-loader');
        const btnSpan = loginBtn.querySelector('span');

        // Validation
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        btnSpan.style.display = 'none';
        btnLoader.classList.remove('hidden');
        loginBtn.disabled = true;

        // Simulate authentication delay
        await this.delay(1500);

        // Create user session
        this.currentUser = {
            email: email,
            type: userType,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showMainPlatform();

        // Reset button state
        btnSpan.style.display = 'inline';
        btnLoader.classList.add('hidden');
        loginBtn.disabled = false;
    }

    handleLogout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        document.getElementById('main-platform').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
    }

    showMainPlatform() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('main-platform').classList.add('active');
        
        // Update user badge
        const userBadge = document.getElementById('userBadge');
        const icon = this.currentUser.type === 'learner' ? '🎓' : '📹';
        const label = this.currentUser.type === 'learner' ? 'Learner' : 'Creator';
        userBadge.innerHTML = `${icon} ${label}`;

        // Show appropriate content
        this.updateContentVisibility();
        this.switchTab('kala-kitchen');
    }

    updateContentVisibility() {
        const creatorContent = document.getElementById('creatorContent');
        const learnerContent = document.getElementById('learnerContent');

        if (this.currentUser.type === 'creator') {
            creatorContent.style.display = 'block';
            learnerContent.style.display = 'none';
        } else {
            creatorContent.style.display = 'none';
            learnerContent.style.display = 'block';
        }
    }

    switchTab(tabId) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabId;

        // Update content visibility for current tab
        if (tabId === 'kala-kitchen') {
            this.updateContentVisibility();
        }
    }

    saveRecipe() {
        const recipeName = document.getElementById('recipeName').textContent;
        const recipe = {
            id: Date.now(),
            name: recipeName,
            savedAt: new Date().toISOString(),
            // Add more recipe data as needed
        };

        this.savedRecipes.push(recipe);
        localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes));
        this.showToast('Recipe saved successfully!');
    }

    shareRecipe() {
        const recipeName = document.getElementById('recipeName').textContent;
        if (navigator.share) {
            navigator.share({
                title: `${recipeName} - TADAM Recipe`,
                text: 'Check out this traditional recipe I found on TADAM!',
                url: window.location.href
            });
        } else {
            // Fallback for browsers without Web Share API
            const shareText = `Check out this traditional recipe: ${recipeName} - TADAM Platform`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Recipe link copied to clipboard!');
            });
        }
    }

    printRecipe() {
        window.print();
    }

    initializeSampleRecipes() {
        const recipesGrid = document.getElementById('recipesGrid');
        if (!recipesGrid) return;

        const sampleRecipes = [
            {
                name: 'Authentic Tamil Dal Rasam',
                time: '30 mins',
                difficulty: 'Easy',
                cuisine: 'Tamil Nadu',
                description: 'Traditional South Indian lentil soup with tamarind, curry leaves, and aromatic spices passed down through generations.',
                tags: ['Vegetarian', 'Traditional', 'Comfort food'],
                icon: '🍛'
            },
            {
                name: 'Heritage Mango Pickle (Maanga Oorugai)',
                time: '3 hours',
                difficulty: 'Medium',
                cuisine: 'Tamil Nadu',
                description: 'Ancient Tamil preservation technique using raw mangoes, traditional spices, and sesame oil from grandmother\'s recipe.',
                tags: ['Fermented', 'Traditional', 'Spicy'],
                icon: '🥒'
            },
            {
                name: 'Chettinad Chicken Biryani',
                time: '120 mins',
                difficulty: 'Hard',
                cuisine: 'Chettinad',
                description: 'Royal Chettinad biryani with authentic dum cooking method, saffron, and traditional Tamil spice blend.',
                tags: ['Non-Veg', 'Festive', 'Royal'],
                icon: '🍚'
            },
            {
                name: 'Traditional Paal Payasam',
                time: '45 mins',
                difficulty: 'Medium',
                cuisine: 'Tamil Nadu',
                description: 'Sacred temple-style milk pudding with cardamom, jaggery, and ghee, prepared for festivals and celebrations.',
                tags: ['Dessert', 'Festival', 'Sacred'],
                icon: '🍮'
            },
            {
                name: 'Authentic Sambar',
                time: '40 mins',
                difficulty: 'Medium',
                cuisine: 'Tamil Nadu',
                description: 'Traditional Tamil sambar with drumsticks, tamarind, and homemade sambar powder following ancient recipes.',
                tags: ['Vegetarian', 'Traditional', 'Daily'],
                icon: '🥣'
            },
            {
                name: 'Heritage Idli & Chutney',
                time: '8 hours',
                difficulty: 'Easy',
                cuisine: 'Tamil Nadu',
                description: 'Soft, fluffy idlis with traditional coconut chutney and authentic tempering techniques from Tamil households.',
                tags: ['Breakfast', 'Fermented', 'Healthy'],
                icon: '🥟'
            }
        ];

        recipesGrid.innerHTML = sampleRecipes.map(recipe => `
            <div class="recipe-card">
                <div class="recipe-card-image">
                    <span>${recipe.icon}</span>
                </div>
                <div class="recipe-card-content">
                    <h3 class="recipe-card-title">${recipe.name}</h3>
                    <div class="recipe-card-meta">
                        <span>⏱️ ${recipe.time}</span>
                        <span>📊 ${recipe.difficulty}</span>
                        <span>🏛️ ${recipe.cuisine}</span>
                    </div>
                    <p class="recipe-card-description">${recipe.description}</p>
                    <div class="recipe-card-tags">
                        ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('successToast');
        const messageSpan = toast.querySelector('.toast-message');
        
        messageSpan.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');

        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hidden');
        }, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TADAMApp();
});