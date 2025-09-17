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
            this.initializeNutritionChart();
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
        window.location.href = '/login.html';
    }

    initializeDietPreferences() {
        const dietOptions = document.querySelectorAll('.diet-option');
        
        dietOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected state from all options
                dietOptions.forEach(opt => {
                    opt.classList.remove('border-green-500', 'bg-gray-600');
                    opt.classList.add('bg-gray-700');
                });
                
                // Add selected state to clicked option
                this.classList.remove('bg-gray-700');
                this.classList.add('border-green-500', 'bg-gray-600');
                
                // Store preference
                const dietType = this.getAttribute('data-diet');
                localStorage.setItem('selectedDiet', dietType);
                
                console.log('Selected diet:', dietType);
                
                // Show feedback
                const dietName = this.querySelector('h4').textContent;
                window.app.showToast(`Selected: ${dietName}`, 'success');
            });
        });
    }

    enhanceLearnerRecipeCards() {
        const recipeCards = document.querySelectorAll('.recipe-card');
        
        recipeCards.forEach(card => {
            card.addEventListener('click', () => {
                const recipeName = card.querySelector('.recipe-card-title')?.textContent || 'Recipe';
                const recipeData = this.getRecipeData(recipeName);
                this.openRecipeModal(recipeData);
            });
        });
    }

    getRecipeData(recipeName) {
        // Sample recipe data - in a real app this would come from an API
        return {
            name: recipeName,
            prepTime: '20 MIN',
            totalTime: '40 MIN',
            price: '₹150 (₹25 pp)',
            image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
            badges: ['HIGH PROTEIN', '8 PLANTS', 'LOW SAT FAT'],
            ingredients: [
                { quantity: '100g', name: 'black rice' },
                { quantity: '2', name: 'carrot' },
                { quantity: '1', name: 'cucumber' },
                { quantity: '110g', name: 'seasonal tomatoes' },
                { quantity: '1 handful', name: 'fresh coriander' },
                { quantity: '4 tsp', name: 'ginger & garlic paste', note: '(Ginger puree IQF, Garlic puree IQF, Citric Acid, Water)' },
                { quantity: '1 tbsp', name: 'tamari', note: '(Soya)' },
                { quantity: '1 tbsp', name: 'rice vinegar' }
            ],
            nutrition: {
                calories: 245,
                carbs: { grams: 32, percent: 52 },
                protein: { grams: 12, percent: 20 },
                fat: { grams: 8, percent: 28 }
            }
        };
    }

    openRecipeModal(recipeData) {
        const modal = document.getElementById('recipeDetailModal');
        
        // Create modal content
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="relative">
                    <button onclick="window.app.closeRecipeModal()" class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-all duration-200">
                        ×
                    </button>
                    
                    <div class="grid md:grid-cols-2 min-h-[500px]">
                        <!-- Left Panel: Image and Nutrition -->
                        <div class="bg-gradient-to-br from-orange-500 to-red-600 p-8 flex flex-col justify-between text-white">
                            <div>
                                <div class="bg-white bg-opacity-20 rounded-lg h-48 mb-6 flex items-center justify-center text-6xl">
                                    🍛
                                </div>
                                
                                <div class="flex flex-wrap gap-2 mb-6">
                                    ${recipeData.badges.map(badge => `
                                        <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-bold">${badge}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="bg-white bg-opacity-15 rounded-lg p-4 text-center">
                                <p class="font-semibold">This recipe contains 8 different plants</p>
                            </div>
                        </div>
                        
                        <!-- Right Panel: Details -->
                        <div class="p-8 text-white">
                            <h2 class="text-2xl font-bold mb-4">${recipeData.name}</h2>
                            
                            <div class="grid grid-cols-3 gap-4 mb-6">
                                <div class="text-center">
                                    <div class="text-xs text-gray-400 mb-1">Prep Time</div>
                                    <div class="font-bold">${recipeData.prepTime}</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-xs text-gray-400 mb-1">Total Time</div>
                                    <div class="font-bold">${recipeData.totalTime}</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-xs text-gray-400 mb-1">Price</div>
                                    <div class="font-bold">${recipeData.price}</div>
                                </div>
                            </div>
                            
                            <button class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold mb-6 transition-all duration-200 transform hover:scale-105">
                                <i data-lucide="plus" class="inline w-4 h-4 mr-2"></i>
                                ADD TO MEAL PLAN
                            </button>
                            
                            <div class="border-t border-gray-600 pt-6">
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="font-semibold text-lg">INGREDIENTS</h3>
                                    <button class="text-gray-400 hover:text-white">−</button>
                                </div>
                                
                                <div class="space-y-3 max-h-64 overflow-y-auto">
                                    ${recipeData.ingredients.map(ingredient => `
                                        <div class="flex items-start gap-3 py-2 border-b border-gray-700">
                                            <span class="font-bold text-green-400 min-w-[60px]">${ingredient.quantity}</span>
                                            <div class="flex-1">
                                                <span class="text-white">${ingredient.name}</span>
                                                ${ingredient.note ? `<div class="text-xs text-gray-400 mt-1">${ingredient.note}</div>` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Re-initialize Lucide icons for the modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    closeRecipeModal() {
        const modal = document.getElementById('recipeDetailModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
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

    initializeNutritionChart() {
        const canvas = document.getElementById('macroChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 50;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Data for the chart (Carbs: 52%, Protein: 20%, Fat: 28%)
        const data = [
            { label: 'Carbs', value: 52, color: '#3b82f6' },
            { label: 'Protein', value: 20, color: '#22c55e' },
            { label: 'Fat', value: 28, color: '#eab308' }
        ];
        
        let currentAngle = -Math.PI / 2; // Start from top
        
        data.forEach(segment => {
            const sliceAngle = (segment.value / 100) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
        
        // Draw inner circle to create donut effect
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
        ctx.fillStyle = '#1f2937'; // Match background
        ctx.fill();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TADAMApp();
});