// Main Application Controller
class TADAMApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'kala-kitchen';
        this.savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        this.selectedDiet = localStorage.getItem('selectedDiet') || null;
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

    updateUserBadge() {
        const userBadge = document.getElementById('userBadge');
        if (userBadge && this.currentUser) {
            const badgeText = this.currentUser.type === 'creator' ? '🎬 Creator' : '🎓 Learner';
            userBadge.textContent = badgeText;
        }
    }

    showMainPlatform() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('main-platform').classList.add('active');
        
        // Update user badge
        const userBadge = document.getElementById('userBadge');
        this.updateUserBadge();

        // Show appropriate content
        this.updateContentVisibility();
        this.switchTab('kala-kitchen');
        
        // Initialize learner-specific features if user is learner
        if (this.currentUser.type === 'learner') {
            this.initializeLearnerFeatures();
        }
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
        
        // Initialize learner features when switching to kala-kitchen
        if (tabId === 'kala-kitchen' && this.currentUser && this.currentUser.type === 'learner') {
            setTimeout(() => this.initializeLearnerFeatures(), 100);
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

    initializeLearnerFeatures() {
        this.enhanceLearnerRecipeCards();
        this.initializeDietPreferences();
        this.loadSelectedDiet();
    }

    enhanceLearnerRecipeCards() {
        const recipeCards = document.querySelectorAll('#learnerContent .recipe-card');
        
        recipeCards.forEach(card => {
            // Remove existing click handlers to avoid duplicates
            card.replaceWith(card.cloneNode(true));
        });
        
        // Re-select cards after cloning
        const newRecipeCards = document.querySelectorAll('#learnerContent .recipe-card');
        
        newRecipeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const recipeName = card.querySelector('.recipe-card-title').textContent;
                const recipeTime = card.querySelector('.recipe-card-meta span').textContent;
                const recipeDescription = card.querySelector('.recipe-card-description').textContent;
                
                const recipeData = {
                    name: recipeName,
                    prepTime: '20 MIN',
                    totalTime: recipeTime,
                    price: '₹150 (₹25 pp)',
                    description: recipeDescription,
                    ingredients: [
                        { quantity: '1 cup', name: 'Basmati rice' },
                        { quantity: '2 tbsp', name: 'Coconut oil' },
                        { quantity: '1 tsp', name: 'Mustard seeds' },
                        { quantity: '8-10', name: 'Curry leaves' },
                        { quantity: '2', name: 'Green chilies' },
                        { quantity: '1/2 cup', name: 'Fresh coconut' },
                        { quantity: '1 tsp', name: 'Turmeric powder' },
                        { quantity: '2 tbsp', name: 'Ginger-garlic paste' }
                    ],
                    instructions: [
                        'Heat coconut oil in a heavy-bottomed pan',
                        'Add mustard seeds and let them splutter',
                        'Add curry leaves and ginger-garlic paste',
                        'Add rice and mix gently with spices',
                        'Add water and bring to boil',
                        'Simmer until rice is cooked perfectly'
                    ]
                };
                this.openRecipeModal(recipeData);
            });
        });
    }

    openRecipeModal(recipeData) {
        const modal = document.getElementById('recipeDetailModal');
        
        // Populate modal with recipe data
        document.getElementById('modalRecipeTitle').textContent = recipeData.name;
        document.getElementById('modalPrepTime').textContent = recipeData.prepTime;
        document.getElementById('modalTotalTime').textContent = recipeData.totalTime;
        document.getElementById('modalPrice').textContent = recipeData.price;
        
        // Populate ingredients
        const ingredientsList = document.getElementById('modalIngredientsList');
        ingredientsList.innerHTML = '';
        recipeData.ingredients.forEach(ingredient => {
            const item = document.createElement('div');
            item.className = 'ingredient-item';
            item.innerHTML = `
                <span class="quantity">${ingredient.quantity}</span>
                <span class="name">${ingredient.name}</span>
            `;
            ingredientsList.appendChild(item);
        });
        
        // Populate instructions
        const instructionsList = document.getElementById('modalInstructionsList');
        if (instructionsList && recipeData.instructions) {
            instructionsList.innerHTML = '';
            recipeData.instructions.forEach((instruction, index) => {
                const item = document.createElement('div');
                item.className = 'instruction-step';
                item.innerHTML = `
                    <span class="step-number">${index + 1}</span>
                    <span class="step-text">${instruction}</span>
                `;
                instructionsList.appendChild(item);
            });
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    initializeDietPreferences() {
        const dietOptions = document.querySelectorAll('.diet-option');
        
        dietOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active state from all options
                dietOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add active state to clicked option
                option.classList.add('selected');
                
                // Store preference
                const dietType = option.getAttribute('data-diet');
                this.selectedDiet = dietType;
                localStorage.setItem('selectedDiet', dietType);
                
                // Show feedback
                this.showToast(`Selected ${option.querySelector('h3').textContent} diet preference`);
                
                // Filter recipes based on diet type (optional enhancement)
                this.filterRecipesByDiet(dietType);
            });
        });
    }

    loadSelectedDiet() {
        if (this.selectedDiet) {
            const selectedOption = document.querySelector(`[data-diet="${this.selectedDiet}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }
    }

    filterRecipesByDiet(dietType) {
        // This could filter the recipe display based on diet preference
        // For now, just show a message
        console.log(`Filtering recipes for diet type: ${dietType}`);
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
}

// Global functions for modal control
function closeRecipeModal() {
    const modal = document.getElementById('recipeDetailModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function generateMealPlan() {
    const calories = document.getElementById('calorieTarget').value;
    const meals = document.getElementById('mealsPerDay').value;
    
    // Show loading state
    const button = document.querySelector('.generate-plan-btn');
    const originalText = button.textContent;
    button.textContent = 'Generating Plan...';
    button.disabled = true;
    
    // Simulate meal plan generation
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        // Show success message
        if (window.tadamApp) {
            window.tadamApp.showToast(`Generated meal plan for ${calories} calories in ${meals} meals!`);
        }
        
        // Here you could show the actual meal plan results
        console.log(`Generated meal plan: ${calories} calories, ${meals} meals`);
    }, 2000);
}
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tadamApp = new TADAMApp();
});