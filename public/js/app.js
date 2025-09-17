// Main Application Controller
class TADAMApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'kala-kitchen';
        this.savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        this.currentTheme = localStorage.getItem('preferred-theme') || 'veg';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthentication();
        this.initializeSampleRecipes();
        this.initializeThemeToggle();
        this.applyTheme(this.currentTheme);
        this.initializeScrollAnimations();
        this.initializeDietModeToggle();
        this.initializeRecipeMasonry();
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
        
        // Initialize theme toggle for both login and dashboard
        this.initializeThemeToggle();
    }
    
    initializeThemeToggle() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        
        themeToggles.forEach(themeToggle => {
            const toggleOptions = themeToggle.querySelectorAll('.toggle-option');
            const toggleSlider = themeToggle.querySelector('.toggle-slider');
            
            toggleOptions.forEach(option => {
                option.addEventListener('click', () => {
                    const theme = option.getAttribute('data-theme');
                    this.switchTheme(theme);
                });
            });
        });
        
        // Apply saved theme on load
        this.applyTheme(this.currentTheme);
    }
    
    switchTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('preferred-theme', theme);
    }
    
    applyTheme(theme) {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update all theme toggles
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(themeToggle => {
            const toggleOptions = themeToggle.querySelectorAll('.toggle-option');
            const toggleSlider = themeToggle.querySelector('.toggle-slider');
            
            // Update active state
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            const activeOption = themeToggle.querySelector(`[data-theme="${theme}"]`);
            if (activeOption) {
                activeOption.classList.add('active');
            }
            
            // Animate slider
            if (toggleSlider) {
                const isNonVeg = theme === 'nonveg';
                toggleSlider.style.transform = isNonVeg ? 'translateX(100%)' : 'translateX(0)';
            }
        });
        
        // Update theme-specific elements
        this.updateThemeElements(theme);
        
        // Add theme switching animation
        document.body.classList.add('theme-switching');
        setTimeout(() => {
            document.body.classList.remove('theme-switching');
        }, 600);
    }
    
    updateThemeElements(theme) {
        // Update recipe card backgrounds based on theme
        const recipeCards = document.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            if (theme === 'veg') {
                card.classList.add('veg-theme');
                card.classList.remove('nonveg-theme');
            } else {
                card.classList.add('nonveg-theme');
                card.classList.remove('veg-theme');
            }
        });
        
        // Update recipe card gradients based on theme
        const recipeImages = document.querySelectorAll('.recipe-card-image');
        recipeImages.forEach((image, index) => {
            if (theme === 'veg') {
                const vegGradients = [
                    'linear-gradient(135deg, #22c55e, #16a34a)', // Palak Paneer
                    'linear-gradient(135deg, #facc15, #eab308)', // Dal
                    'linear-gradient(135deg, #ffffff, #f8fafc)', // White Rice
                    'linear-gradient(135deg, #f1f5f9, #ffffff)', // Coconut Chutney
                    'linear-gradient(135deg, #dcfce7, #22c55e)', // Mint Chutney
                    'linear-gradient(135deg, #84cc16, #22c55e)'  // Green Vegetables
                ];
                image.style.background = vegGradients[index % vegGradients.length];
            } else {
                const nonVegGradients = [
                    'linear-gradient(135deg, #ef4444, #f59e0b)', // Chicken Curry
                    'linear-gradient(135deg, #ea580c, #dc2626)', // Fish Curry
                    'linear-gradient(135deg, #f59e0b, #ef4444)', // Mutton Biryani
                    'linear-gradient(135deg, #dc2626, #991b1b)', // Tandoori
                    'linear-gradient(135deg, #b91c1c, #ef4444)', // Spicy Gravy
                    'linear-gradient(135deg, #ef4444, #ea580c)'  // Mixed Non-Veg
                ];
                image.style.background = nonVegGradients[index % nonVegGradients.length];
            }
        });
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
            // Reinitialize scroll animations for the active tab
            setTimeout(() => {
                this.initializeScrollAnimations();
            }, 100);
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

    initializeScrollAnimations() {
        // Simple scroll-triggered animations without external libraries
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all scroll-animated elements
        const animatedElements = document.querySelectorAll('[data-scroll]');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initializeDietModeToggle() {
        const toggleOptions = document.querySelectorAll('.toggle-option');
        const toggleSlider = document.querySelector('.toggle-slider');
        
        toggleOptions.forEach((option, index) => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Move slider
                const translateX = index * 100;
                if (toggleSlider) {
                    toggleSlider.style.transform = `translateX(${translateX}%)`;
                }
                
                // Update recipes based on selected mode
                this.updateRecipesByMode(option.dataset.mode);
            });
        });
    }

    updateRecipesByMode(mode) {
        // Update recipe grid based on selected diet mode
        const recipeCards = document.querySelectorAll('.recipe-card');
        
        recipeCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
        });
        
        // Simulate filtering animation
        setTimeout(() => {
            recipeCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, index * 100);
            });
        }, 300);
        
        console.log(`Filtering recipes for ${mode} mode`);
    }

    initializeRecipeMasonry() {
        const masonryGrid = document.getElementById('recipeMasonryGrid');
        if (!masonryGrid) return;

        // Enhanced recipe data with more variety
        const heritageRecipes = [
            {
                name: 'Paatti\'s Chettinad Sambar',
                chef: 'Chef Meenakshi Raghavan',
                expertise: 'Chettinad cuisine master',
                rating: '4.9',
                reviews: '234',
                time: '45 mins',
                servings: '6',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)',
                description: 'Traditional family recipe passed down through 5 generations'
            },
            {
                name: 'Kerala Fish Curry',
                chef: 'Chef Lakshmi Menon',
                expertise: 'Kerala traditional cook',
                rating: '4.8',
                reviews: '189',
                time: '35 mins',
                servings: '4',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)',
                description: 'Coconut-rich curry with authentic Kerala spices'
            },
            {
                name: 'Simple Tomato Rasam',
                calories: '120',
                protein: '8g',
                fiber: '15g',
                time: '25 mins',
                servings: '4',
                type: 'free',
                gradient: 'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)',
                description: 'Traditional comfort food for daily meals'
            },
            {
                name: 'Andhra Chicken Curry',
                chef: 'Chef Radhika Devi',
                expertise: 'Andhra cuisine specialist',
                rating: '4.7',
                reviews: '156',
                time: '50 mins',
                servings: '5',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #DC143C 0%, #B22222 100%)',
                description: 'Spicy and flavorful Andhra-style preparation'
            },
            {
                name: 'Coconut Rice',
                calories: '180',
                protein: '4g',
                fiber: '3g',
                time: '20 mins',
                servings: '3',
                type: 'free',
                gradient: 'linear-gradient(135deg, #F5F5DC 0%, #DEB887 100%)',
                description: 'Fragrant coconut rice with traditional tempering'
            },
            {
                name: 'Traditional Payasam',
                chef: 'Chef Sushila Nair',
                expertise: 'Traditional sweets expert',
                rating: '4.9',
                reviews: '298',
                time: '40 mins',
                servings: '8',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #DDA0DD 0%, #DA70D6 100%)',
                description: 'Creamy rice pudding with jaggery and cardamom'
            },
            {
                name: 'Millet Dosa',
                calories: '95',
                protein: '6g',
                fiber: '12g',
                time: '30 mins',
                servings: '2',
                type: 'free',
                gradient: 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)',
                description: 'Healthy ancient grain breakfast option'
            },
            {
                name: 'Royal Mutton Biryani',
                chef: 'Chef Arjun Kumar',
                expertise: 'Royal cuisine specialist',
                rating: '4.8',
                reviews: '167',
                time: '90 mins',
                servings: '8',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #8B0000 0%, #DC143C 100%)',
                description: 'Aromatic biryani with traditional dum cooking'
            }
        ];

        masonryGrid.innerHTML = heritageRecipes.map(recipe => `
            <div class="recipe-card ${recipe.type}" data-scroll>
                <div class="recipe-card-image" style="background: ${recipe.gradient};">
                    <div class="${recipe.type}-badge">${recipe.type.toUpperCase()}</div>
                    <div class="recipe-overlay">
                        <h3>${recipe.name}</h3>
                        <p>${recipe.description}</p>
                    </div>
                </div>
                <div class="recipe-details">
                    ${recipe.type === 'premium' ? `
                        <div class="chef-info">
                            <div class="chef-avatar"></div>
                            <div>
                                <h4>${recipe.chef}</h4>
                                <p>${recipe.expertise}</p>
                            </div>
                        </div>
                        <div class="recipe-stats">
                            <span>⭐ ${recipe.rating} (${recipe.reviews} reviews)</span>
                            <span>⏱ ${recipe.time}</span>
                            <span>🍽 ${recipe.servings} servings</span>
                        </div>
                    ` : `
                        <div class="nutrition-preview">
                            <span>${recipe.calories} cal</span>
                            <span>${recipe.protein} protein</span>
                            <span>${recipe.fiber} fiber</span>
                        </div>
                        <div class="recipe-stats">
                            <span>⏱ ${recipe.time}</span>
                            <span>🍽 ${recipe.servings} servings</span>
                        </div>
                    `}
                </div>
            </div>
        `).join('');

        // Reinitialize scroll animations for new elements
        setTimeout(() => {
            this.initializeScrollAnimations();
        }, 100);
    }

    initializeSampleRecipes() {
        const recipesGrid = document.getElementById('recipesGrid');
        const premiumRecipesGrid = document.getElementById('premiumRecipesGrid');
        if (!recipesGrid) return;

        // Initialize premium recipes for learner interface
        if (premiumRecipesGrid) {
            this.initializePremiumRecipes();
        }

        // Keep original recipes for creator interface
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

    initializePremiumRecipes() {
        const premiumRecipesGrid = document.getElementById('premiumRecipesGrid');
        if (!premiumRecipesGrid) return;

        const premiumRecipes = [
            {
                name: 'Authentic Chettinad Sambar',
                chef: 'Chef Meenakshi',
                expertise: 'Chettinad cuisine expert',
                rating: '4.9',
                reviews: '234',
                time: '45 mins',
                servings: '6',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #8B4513, #CD853F)',
                description: 'Traditional family recipe passed down through generations'
            },
            {
                name: 'Kerala Fish Curry',
                chef: 'Chef Lakshmi',
                expertise: 'Kerala traditional cook',
                rating: '4.8',
                reviews: '189',
                time: '35 mins',
                servings: '4',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #FF6347, #FF4500)',
                description: 'Coconut-rich curry with authentic Kerala spices'
            },
            {
                name: 'Simple Tomato Rasam',
                calories: '120',
                protein: '8g',
                fiber: '15g',
                time: '25 mins',
                servings: '4',
                type: 'free',
                gradient: 'linear-gradient(135deg, #FF6347, #FF4500)',
                description: 'Traditional comfort food for daily meals'
            },
            {
                name: 'Andhra Chicken Curry',
                chef: 'Chef Radhika',
                expertise: 'Andhra cuisine specialist',
                rating: '4.7',
                reviews: '156',
                time: '50 mins',
                servings: '5',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #DC143C, #B22222)',
                description: 'Spicy and flavorful Andhra-style chicken preparation'
            },
            {
                name: 'Coconut Rice',
                calories: '180',
                protein: '4g',
                fiber: '3g',
                time: '20 mins',
                servings: '3',
                type: 'free',
                gradient: 'linear-gradient(135deg, #F5F5DC, #DEB887)',
                description: 'Fragrant coconut rice with traditional tempering'
            },
            {
                name: 'Traditional Payasam',
                chef: 'Chef Sushila',
                expertise: 'Traditional sweets expert',
                rating: '4.9',
                reviews: '298',
                time: '40 mins',
                servings: '8',
                type: 'premium',
                gradient: 'linear-gradient(135deg, #DDA0DD, #DA70D6)',
                description: 'Creamy rice pudding with jaggery and cardamom'
            }
        ];

        premiumRecipesGrid.innerHTML = premiumRecipes.map(recipe => `
            <div class="recipe-card ${recipe.type}">
                <div class="recipe-card-image" style="background: ${recipe.gradient};">
                    <div class="${recipe.type}-badge">${recipe.type.toUpperCase()}</div>
                    <div class="recipe-overlay">
                        <h3>${recipe.name}</h3>
                        <p>${recipe.description}</p>
                    </div>
                </div>
                <div class="recipe-details">
                    ${recipe.type === 'premium' ? `
                        <div class="chef-info">
                            <div class="chef-avatar"></div>
                            <div>
                                <h4>${recipe.chef}</h4>
                                <p>${recipe.expertise}</p>
                            </div>
                        </div>
                        <div class="recipe-stats">
                            <span>★ ${recipe.rating} (${recipe.reviews} reviews)</span>
                            <span>⏱ ${recipe.time}</span>
                            <span>🍽 ${recipe.servings} servings</span>
                        </div>
                    ` : `
                        <div class="nutrition-preview">
                            <span>${recipe.calories} cal</span>
                            <span>${recipe.protein} protein</span>
                            <span>${recipe.fiber} fiber</span>
                        </div>
                    `}
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