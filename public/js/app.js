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

        // Learner-specific functionality
        this.initializeLearnerFeatures();
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
        const icon = this.currentUser.type === 'learner' ? 'graduation-cap' : 'video';
        const label = this.currentUser.type === 'learner' ? 'Learner' : 'Creator';
        userBadge.innerHTML = `<i data-lucide="${icon}"></i> ${label}`;
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

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
            
            // Initialize learner features if user is learner
            if (this.currentUser && this.currentUser.type === 'learner') {
                this.initializeLearnerFeatures();
            }
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
                name: 'Paatti\'s Sambar',
                time: '35 mins',
                difficulty: 'Medium',
                cuisine: 'Tamil Nadu',
                description: 'Traditional Tamil sambar with drumsticks and small onions, made with authentic sambar powder.',
                tags: ['Vegetarian', 'Traditional', 'Protein-rich'],
                icon: '🍛',
                image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'
            },
            {
                name: 'Traditional Rasam',
                time: '25 mins',
                difficulty: 'Easy',
                cuisine: 'Tamil Nadu',
                description: 'Tangy and aromatic rasam with tomatoes, tamarind, and traditional rasam powder.',
                tags: ['Vegetarian', 'Comfort food', 'Digestive'],
                icon: '🍲',
                image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg'
            },
            {
                name: 'Chettinad Chicken Curry',
                time: '45 mins',
                difficulty: 'Hard',
                cuisine: 'Chettinad',
                description: 'Spicy and flavorful chicken curry from Chettinad region with freshly ground spices.',
                tags: ['Non-vegetarian', 'Spicy', 'Traditional'],
                icon: '🍗',
                image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
            },
            {
                name: 'Coconut Rice (Thengai Sadam)',
                time: '20 mins',
                difficulty: 'Easy',
                cuisine: 'Tamil Nadu',
                description: 'Fragrant coconut rice with curry leaves, mustard seeds, and fresh grated coconut.',
                tags: ['Vegetarian', 'Quick', 'Festive'],
                icon: '🥥',
                image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg'
            },
            {
                name: 'Beans Poriyal',
                time: '15 mins',
                difficulty: 'Easy',
                cuisine: 'Tamil Nadu',
                description: 'Simple and healthy green beans stir-fry with coconut and traditional tempering.',
                tags: ['Vegetarian', 'Healthy', 'Quick'],
                icon: '🥬',
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
            },
            {
                name: 'Meen Kuzhambu (Fish Curry)',
                time: '40 mins',
                difficulty: 'Medium',
                cuisine: 'Tamil Nadu',
                description: 'Traditional Tamil fish curry with tamarind, tomatoes, and aromatic spices.',
                tags: ['Non-vegetarian', 'Traditional', 'Tangy'],
                icon: '🐟',
                image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg'
            },
            {
                name: 'Idli with Sambar',
                time: '30 mins',
                difficulty: 'Medium',
                cuisine: 'South Indian',
                description: 'Soft steamed idlis served with traditional sambar and coconut chutney.',
                tags: ['Vegetarian', 'Breakfast', 'Fermented'],
                icon: '🥟',
                image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg'
            },
            {
                name: 'Mutton Biryani',
                time: '90 mins',
                difficulty: 'Hard',
                cuisine: 'Tamil Nadu',
                description: 'Aromatic mutton biryani cooked with basmati rice, saffron, and traditional spices.',
                tags: ['Non-vegetarian', 'Festive', 'Aromatic'],
                icon: '🍚',
                image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
            },
            {
                name: 'Payasam (Sweet Rice Pudding)',
                time: '40 mins',
                difficulty: 'Medium',
                cuisine: 'South Indian',
                description: 'Creamy rice pudding made with jaggery, coconut milk, and cardamom.',
                tags: ['Vegetarian', 'Dessert', 'Festival'],
                icon: '🍮',
                image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg'
            }
        ];

        recipesGrid.innerHTML = sampleRecipes.map(recipe => `
            <div class="recipe-card">
                <div class="recipe-card-image" style="background-image: url('${recipe.image}'); background-size: cover; background-position: center;">
                    <div class="recipe-overlay">
                        <span class="recipe-icon">${recipe.icon}</span>
                    </div>
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

    // Learner-specific features
    initializeLearnerFeatures() {
        if (this.currentUser && this.currentUser.type === 'learner') {
            this.bindLearnerLogout();
            this.initializeDietPreferences();
            this.enhanceLearnerRecipeCards();
            this.bindMealPlanningEvents();
        }
    }

    bindLearnerLogout() {
        const learnerLogoutBtn = document.getElementById('learnerLogoutBtn');
        if (learnerLogoutBtn) {
            learnerLogoutBtn.addEventListener('click', () => this.logoutUser());
        }
    }

    logoutUser() {
        localStorage.clear();
        window.location.href = '/';
    }

    initializeDietPreferences() {
        const dietOptions = document.querySelectorAll('.diet-option');
        
        dietOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected state from all options
                dietOptions.forEach(opt => opt.classList.remove('border-green-500', 'bg-green-50'));
                
                // Add selected state to clicked option
                this.classList.add('border-green-500', 'bg-green-50');
                
                // Store preference
                const dietType = this.getAttribute('data-diet');
                localStorage.setItem('selectedDiet', dietType);
                
                console.log('Selected diet:', dietType);
            });
        });
    }

    enhanceLearnerRecipeCards() {
        const recipeCards = document.querySelectorAll('.recipe-card');
        
        recipeCards.forEach(card => {
            card.addEventListener('click', () => {
                const recipeName = card.querySelector('.recipe-card-title')?.textContent || 'Recipe';
                this.openRecipeModal(recipeName);
            });
        });
    }

    openRecipeModal(recipeName) {
        const modal = document.getElementById('recipeDetailModal');
        
        // Create modal content
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">${recipeName}</h2>
                        <button onclick="this.closest('.recipe-modal').classList.add('hidden')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="recipe-image bg-gradient-to-br from-orange-400 to-red-500 h-64 rounded-lg flex items-center justify-center text-white text-6xl">
                            🍛
                        </div>
                        
                        <div class="recipe-details">
                            <div class="mb-4">
                                <div class="flex gap-4 text-sm text-gray-600 mb-4">
                                    <span>⏱️ 20 MIN prep</span>
                                    <span>🔥 40 MIN total</span>
                                    <span>💰 ₹150 (₹25 pp)</span>
                                </div>
                                
                                <div class="flex gap-2 mb-4">
                                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">HIGH PROTEIN</span>
                                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">8 PLANTS</span>
                                    <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">LOW SAT FAT</span>
                                </div>
                            </div>
                            
                            <div class="ingredients">
                                <h3 class="font-semibold mb-3">Ingredients</h3>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between"><span>1 cup</span><span>Basmati rice</span></div>
                                    <div class="flex justify-between"><span>2 tbsp</span><span>Coconut oil</span></div>
                                    <div class="flex justify-between"><span>1 tsp</span><span>Mustard seeds</span></div>
                                    <div class="flex justify-between"><span>8-10</span><span>Curry leaves</span></div>
                                    <div class="flex justify-between"><span>2</span><span>Green chilies</span></div>
                                    <div class="flex justify-between"><span>1/2 cup</span><span>Fresh coconut</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 pt-6 border-t">
                        <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
                            Add to Meal Plan
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    bindMealPlanningEvents() {
        const generatePlanBtn = document.getElementById('generatePlanBtn');
        if (generatePlanBtn) {
            generatePlanBtn.addEventListener('click', () => {
                const calories = document.getElementById('calorieTarget')?.value || 1800;
                const meals = document.getElementById('mealsPerDay')?.value || 3;
                
                this.showToast(`Generating meal plan for ${calories} calories in ${meals} meals!`);
                console.log('Generating meal plan:', { calories, meals });
            });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TADAMApp();
});