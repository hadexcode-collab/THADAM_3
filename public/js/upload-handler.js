// Video Upload and Processing Handler
class UploadHandler {
    constructor() {
        this.recipeExtractor = new RecipeExtractorAI();
        this.maxFileSize = 100 * 1024 * 1024; // 100MB
        this.allowedFormats = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
        this.currentVideo = null;
        this.bindEvents();
    }

    bindEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const videoInput = document.getElementById('videoInput');
        const processBtn = document.getElementById('processBtn');

        if (uploadArea) {
            // Click to upload
            uploadArea.addEventListener('click', (e) => {
                videoInput.click();
            });

            // Drag and drop events
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        if (videoInput) {
            videoInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (processBtn) {
            processBtn.addEventListener('click', () => this.processVideo());
        }

        // Recipe action buttons
        const saveBtn = document.getElementById('saveRecipe');
        const shareBtn = document.getElementById('shareRecipe');
        const printBtn = document.getElementById('printRecipe');

        if (saveBtn) saveBtn.addEventListener('click', () => this.saveRecipe());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareRecipe());
        if (printBtn) printBtn.addEventListener('click', () => this.printRecipe());
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.isValid) {
            this.showError(validation.message);
            return;
        }

        this.currentVideo = file;
        this.showVideoPreview(file);
    }

    validateFile(file) {
        // Check file type
        if (!this.allowedFormats.includes(file.type)) {
            return {
                isValid: false,
                message: 'Please upload a valid video file (MP4, MOV, or AVI)'
            };
        }

        // Check file size
        if (file.size > this.maxFileSize) {
            return {
                isValid: false,
                message: 'File size too large. Maximum size allowed is 100MB'
            };
        }

        return { isValid: true };
    }

    showVideoPreview(file) {
        const uploadArea = document.getElementById('uploadArea');
        const videoPreview = document.getElementById('videoPreview');
        const previewVideo = document.getElementById('previewVideo');
        const videoFileName = document.getElementById('videoFileName');
        const videoDetails = document.getElementById('videoDetails');

        // Hide placeholder, show preview
        uploadArea.style.display = 'none';
        videoPreview.style.display = 'block';

        // Set video source
        const videoURL = URL.createObjectURL(file);
        previewVideo.src = videoURL;
        previewVideo.load();

        // Show video info
        if (videoFileName) {
            videoFileName.textContent = file.name;
        }
        if (videoDetails) {
            videoDetails.textContent = `${this.formatFileSize(file.size)} • ${file.type.split('/')[1].toUpperCase()} • Ready to process`;
        }

        // Clean up old URL
        previewVideo.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(videoURL);
        });
    }

    removeVideo() {
        const uploadArea = document.getElementById('uploadArea');
        const videoPreview = document.getElementById('videoPreview');
        const previewVideo = document.getElementById('previewVideo');
        const videoInput = document.getElementById('videoInput');

        // Reset UI
        videoPreview.style.display = 'none';
        uploadArea.style.display = 'block';
        
        // Clear video
        previewVideo.src = '';
        videoInput.value = '';
        this.currentVideo = null;

        // Hide processing results if any
        this.hideProcessingResults();
    }

    async processVideo() {
        if (!this.currentVideo) {
            this.showError('Please select a video file first');
            return;
        }

        // Show processing panel
        const processingSection = document.getElementById('processingSection');
        const recipeResults = document.getElementById('recipeResults');
        
        processingSection.style.display = 'block';
        recipeResults.style.display = 'none';

        // Reset processing steps UI
        this.resetProcessingUI();

        // Disable process button
        const processBtn = document.getElementById('processBtn');
        const btnText = processBtn.querySelector('.btn-text');
        const btnLoader = processBtn.querySelector('.btn-loader');
        
        processBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.classList.remove('hidden');

        try {
            // Process video with AI
            const results = await this.recipeExtractor.processVideo(this.currentVideo);
            
            // Show results
            this.displayRecipeResults(results);
            
            // Show success message
            this.showSuccess('Recipe extracted successfully!');

        } catch (error) {
            console.error('Processing error:', error);
            this.showError('Failed to process video. Please try again.');
        } finally {
            // Re-enable process button
            processBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.classList.add('hidden');
        }
    }

    resetProcessingUI() {
        const processSteps = document.querySelectorAll('.step');
        processSteps.forEach(step => {
            step.classList.remove('processing', 'completed');
            const progressBar = step.querySelector('.progress');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            
            // Reset step icon
            const stepIcon = step.querySelector('.step-icon i');
            if (stepIcon) {
                const stepType = step.getAttribute('data-step');
                const iconMap = {
                    'frames': 'video',
                    'audio': 'mic',
                    'ingredients': 'leaf',
                    'techniques': 'chef-hat',
                    'recipe': 'book-open'
                };
                stepIcon.setAttribute('data-lucide', iconMap[stepType] || 'circle');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }

    displayRecipeResults(results) {
        const processingSection = document.getElementById('processingSection');
        const recipeResults = document.getElementById('recipeResults');

        // Hide processing panel and show results
        setTimeout(() => {
            processingSection.style.display = 'none';
            recipeResults.style.display = 'block';
            this.populateRecipeData(results.recipe, results.confidence || {});
        }, 1000);
    }

    populateRecipeData(recipe, confidence) {
        if (!recipe) {
            console.error('No recipe data provided');
            // Create a fallback recipe
            recipe = {
                name: 'Traditional South Indian Recipe',
                cuisine: 'Tamil Nadu',
                difficulty: 'Medium',
                cookingTime: 45,
                servings: 4,
                ingredients: [
                    { name: 'Toor Dal', quantity: '1 cup', confidence: 95 },
                    { name: 'Tamarind', quantity: '1 lemon-sized ball', confidence: 92 },
                    { name: 'Sambar Powder', quantity: '2 tsp', confidence: 89 },
                    { name: 'Turmeric Powder', quantity: '1/2 tsp', confidence: 94 },
                    { name: 'Mustard Seeds', quantity: '1 tsp', confidence: 96 },
                    { name: 'Curry Leaves', quantity: '8-10 leaves', confidence: 98 }
                ],
                steps: [
                    { step: 1, instruction: 'Heat oil in a kadai and add mustard seeds', time: '2 mins', temperature: 'Medium heat', technique: 'Tempering' },
                    { step: 2, instruction: 'Add curry leaves and let them splutter', time: '1 min', temperature: 'Medium heat', technique: 'Tempering' },
                    { step: 3, instruction: 'Add cooked dal and tamarind water', time: '5 mins', temperature: 'Medium heat', technique: 'Mixing' },
                    { step: 4, instruction: 'Add sambar powder and turmeric, simmer', time: '10 mins', temperature: 'Low heat', technique: 'Simmering' }
                ]
            };
            return;
        }

        // Update recipe name
        const recipeNameEl = document.getElementById('recipeName');
        if (recipeNameEl) {
            recipeNameEl.textContent = recipe.name || 'Generated Recipe';
        }

        // Update metadata
        const cuisineTypeEl = document.getElementById('cuisineType');
        if (cuisineTypeEl) {
            cuisineTypeEl.textContent = recipe.cuisine || 'Traditional Indian';
        }
        
        const difficultyEl = document.getElementById('difficulty');
        if (difficultyEl) {
            difficultyEl.textContent = recipe.difficulty || 'Medium';
        }
        
        const cookingTimeEl = document.getElementById('cookingTime');
        if (cookingTimeEl) {
            cookingTimeEl.textContent = `${recipe.cookingTime || 45} minutes`;
        }
        
        const servingSizeEl = document.getElementById('servingSize');
        if (servingSizeEl) {
            servingSizeEl.textContent = `${recipe.servings || 4} people`;
        }

        // Populate ingredients
        const ingredientsList = document.getElementById('ingredientsList');
        if (ingredientsList && recipe.ingredients) {
            ingredientsList.innerHTML = recipe.ingredients.map(ingredient => `
                <div class="ingredient-item">
                    <span class="ingredient-name">${ingredient.name}</span>
                    <span class="ingredient-amount">${ingredient.quantity || '1 cup'}</span>
                </div>
            `).join('');
        }

        // Populate instructions
        const instructionsList = document.getElementById('instructionsList');
        if (instructionsList && recipe.steps) {
            instructionsList.innerHTML = recipe.steps.map(step => `
                <div class="instruction-item">
                    <div class="step-number">${step.step}</div>
                    <div class="instruction-content">
                        <p class="instruction-text">${step.instruction}</p>
                        <div class="instruction-meta">
                            <span>⏱️ ${step.time || '5 mins'}</span>
                            <span>🔥 ${step.temperature || 'Medium heat'}</span>
                            <span>🥄 ${step.technique || 'Traditional'}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Populate confidence metrics
        const confidenceMetrics = document.getElementById('confidenceMetrics');
        if (confidenceMetrics) {
            const confidenceData = confidence || {
                overall: 92,
                ingredients: 89,
                techniques: 94,
                recipe: 87
            };
            
            confidenceMetrics.innerHTML = Object.entries(confidenceData).slice(0, 4).map(([key, value]) => `
                <div class="confidence-item">
                    <div class="confidence-label">${this.formatConfidenceLabel(key)}</div>
                    <div class="confidence-value ${this.getConfidenceClass(value)}">${value}%</div>
                </div>
            `).join('');
        }
    }

    formatConfidenceLabel(key) {
        const labels = {
            overall: 'Overall Analysis',
            ingredients: 'Ingredient Detection',
            techniques: 'Cooking Techniques',
            recipe: 'Recipe Generation'
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    getConfidenceClass(value) {
        if (value >= 85) return 'high';
        if (value >= 70) return 'medium';
        return 'low';
    }

    hideProcessingResults() {
        const processingSection = document.getElementById('processingSection');
        const recipeResults = document.getElementById('recipeResults');
        
        processingSection.style.display = 'none';
        recipeResults.style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showError(message) {
        // Create a temporary error toast
        const errorToast = document.createElement('div');
        errorToast.className = 'toast error-toast';
        errorToast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon"><i data-lucide="alert-triangle"></i></div>
                <span class="toast-message">${message}</span>
            </div>
        `;
        errorToast.style.background = 'rgba(255, 107, 107, 0.9)';
        errorToast.style.position = 'fixed';
        errorToast.style.top = '20px';
        errorToast.style.right = '20px';
        errorToast.style.zIndex = '10000';
        errorToast.style.padding = '1rem';
        errorToast.style.borderRadius = '8px';
        errorToast.style.color = 'white';

        document.body.appendChild(errorToast);
        
        // Initialize Lucide icons for the error toast
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            if (document.body.contains(errorToast)) {
                document.body.removeChild(errorToast);
            }
        }, 4000);
    }

    showSuccess(message) {
        const toast = document.getElementById('successToast');
        if (toast) {
            const messageSpan = toast.querySelector('.toast-message');
            if (messageSpan) {
                messageSpan.textContent = message;
            }
            toast.classList.remove('hidden');
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hidden');
            }, 3000);
        } else {
            // Fallback success message
            console.log('Success:', message);
        }
    }

    saveRecipe() {
        const recipeName = document.getElementById('recipeName')?.textContent || 'Generated Recipe';
        const recipe = {
            id: Date.now(),
            name: recipeName,
            savedAt: new Date().toISOString(),
        };

        let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
        savedRecipes.push(recipe);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
        this.showSuccess('Recipe saved successfully!');
    }

    shareRecipe() {
        const recipeName = document.getElementById('recipeName')?.textContent || 'Generated Recipe';
        if (navigator.share) {
            navigator.share({
                title: `${recipeName} - TADAM Recipe`,
                text: 'Check out this traditional recipe I found on TADAM!',
                url: window.location.href
            });
        } else {
            const shareText = `Check out this traditional recipe: ${recipeName} - TADAM Platform`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showSuccess('Recipe link copied to clipboard!');
            });
        }
    }

    printRecipe() {
        window.print();
    }
}

// Initialize upload handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uploadHandler = new UploadHandler();
});