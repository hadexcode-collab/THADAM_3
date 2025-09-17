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
                if (e.target.closest('.process-btn')) return;
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
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const videoPreview = document.getElementById('videoPreview');
        const previewVideo = document.getElementById('previewVideo');
        const videoInfo = document.getElementById('videoInfo');

        // Hide placeholder, show preview
        uploadPlaceholder.classList.add('hidden');
        videoPreview.classList.remove('hidden');

        // Set video source
        const videoURL = URL.createObjectURL(file);
        previewVideo.src = videoURL;
        previewVideo.load();

        // Show video info
        videoInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="color: white; font-size: 1.1rem;">${file.name}</strong>
                <button class="remove-video-btn" style="background: rgba(255,0,0,0.2); border: 1px solid rgba(255,0,0,0.3); color: #ff6b6b; padding: 4px 12px; border-radius: 6px; cursor: pointer;" onclick="uploadHandler.removeVideo()">
                    ✕ Remove
                </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; font-size: 0.9rem;">
                <div>
                    <span style="color: rgba(255,255,255,0.7);">Size:</span>
                    <br><span style="color: rgba(255,255,255,0.9);">${this.formatFileSize(file.size)}</span>
                </div>
                <div>
                    <span style="color: rgba(255,255,255,0.7);">Format:</span>
                    <br><span style="color: rgba(255,255,255,0.9);">${file.type.split('/')[1].toUpperCase()}</span>
                </div>
                <div>
                    <span style="color: rgba(255,255,255,0.7);">Status:</span>
                    <br><span style="color: #4ecdc4;">✓ Ready to Process</span>
                </div>
            </div>
        `;

        // Clean up old URL
        previewVideo.addEventListener('loadedmetadata', () => {
            URL.revokeObjectURL(videoURL);
        });
    }

    removeVideo() {
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const videoPreview = document.getElementById('videoPreview');
        const previewVideo = document.getElementById('previewVideo');
        const videoInput = document.getElementById('videoInput');

        // Reset UI
        videoPreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
        
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
        const processingPanel = document.getElementById('processingPanel');
        const recipeDisplay = document.getElementById('recipeDisplay');
        
        processingPanel.classList.remove('hidden');
        recipeDisplay.classList.add('hidden');

        // Reset processing steps UI
        this.resetProcessingUI();

        // Disable process button
        const processBtn = document.getElementById('processBtn');
        processBtn.disabled = true;
        processBtn.innerHTML = '<span>🔄 Processing...</span>';

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
            processBtn.innerHTML = '<span>🔍 Extract Recipe with AI</span>';
        }
    }

    resetProcessingUI() {
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(step => {
            step.classList.remove('processing', 'completed');
            const progressBar = step.querySelector('.progress');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
    }

    displayRecipeResults(results) {
        const processingPanel = document.getElementById('processingPanel');
        const recipeDisplay = document.getElementById('recipeDisplay');

        // Hide processing panel and show results
        setTimeout(() => {
            processingPanel.classList.add('hidden');
            recipeDisplay.classList.remove('hidden');
            this.populateRecipeData(results.recipe, results.confidence);
        }, 1000);
    }

    populateRecipeData(recipe, confidence) {
        // Update recipe name
        document.getElementById('recipeName').textContent = recipe.name;

        // Update metadata
        document.getElementById('cuisineType').textContent = recipe.cuisine;
        document.getElementById('difficulty').textContent = recipe.difficulty;
        document.getElementById('cookingTime').textContent = `${recipe.cookingTime} minutes`;
        document.getElementById('servingSize').textContent = `${recipe.servings} people`;

        // Populate ingredients
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = recipe.ingredients.map(ingredient => `
            <div class="ingredient-item">
                <div class="ingredient-info">
                    <span class="ingredient-name">${ingredient.name}</span>
                    <span class="confidence-score">${ingredient.confidence}%</span>
                </div>
                <span class="ingredient-amount">${ingredient.quantity}</span>
            </div>
        `).join('');

        // Populate instructions
        const instructionsList = document.getElementById('instructionsList');
        instructionsList.innerHTML = recipe.steps.map(step => `
            <div class="instruction-item">
                <div class="step-number">${step.step}</div>
                <div class="instruction-content">
                    <p class="instruction-text">${step.instruction}</p>
                    <div class="instruction-meta">
                        <span>⏱️ ${step.time}</span>
                        <span>🔥 ${step.temperature}</span>
                        <span>🥄 ${step.technique}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Populate confidence metrics
        const confidenceMetrics = document.getElementById('confidenceMetrics');
        confidenceMetrics.innerHTML = Object.entries(confidence).map(([key, value]) => `
            <div class="confidence-item">
                <div class="confidence-label">${this.formatConfidenceLabel(key)}</div>
                <div class="confidence-value ${this.getConfidenceClass(value)}">${value}%</div>
            </div>
        `).join('');
    }

    formatConfidenceLabel(key) {
        const labels = {
            overall: 'Overall Analysis',
            ingredients: 'Ingredient Detection',
            techniques: 'Cooking Techniques',
            audioTranscription: 'Audio Processing',
            recipeGeneration: 'Recipe Generation'
        };
        return labels[key] || key;
    }

    getConfidenceClass(value) {
        if (value >= 85) return 'high';
        if (value >= 70) return 'medium';
        return 'low';
    }

    hideProcessingResults() {
        const processingPanel = document.getElementById('processingPanel');
        const recipeDisplay = document.getElementById('recipeDisplay');
        
        processingPanel.classList.add('hidden');
        recipeDisplay.classList.add('hidden');
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
                <span class="toast-icon">⚠️</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        errorToast.style.background = 'rgba(255, 107, 107, 0.9)';

        document.body.appendChild(errorToast);
        errorToast.classList.add('show');

        setTimeout(() => {
            errorToast.classList.remove('show');
            setTimeout(() => document.body.removeChild(errorToast), 300);
        }, 4000);
    }

    showSuccess(message) {
        const toast = document.getElementById('successToast');
        const messageSpan = toast.querySelector('.toast-message');
        
        messageSpan.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hidden');
        }, 3000);
    }
}

// Initialize upload handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uploadHandler = new UploadHandler();
});