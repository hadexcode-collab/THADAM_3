// Recipe Extractor AI Simulation
class RecipeExtractorAI {
    constructor() {
        this.models = {
            yolo: 'YOLO-v8 Object Detection',
            whisper: 'OpenAI Whisper Speech-to-Text',
            resnet: 'ResNet-50 Image Classification',
            bert: 'BERT Language Model'
        };
        
        this.isInitialized = false;
        this.processingSteps = [
            { id: 'frames', name: 'Extract Video Frames', duration: 2000 },
            { id: 'audio', name: 'Transcribe Audio', duration: 2500 },
            { id: 'ingredients', name: 'Identify Ingredients', duration: 3000 },
            { id: 'techniques', name: 'Recognize Techniques', duration: 2000 },
            { id: 'recipe', name: 'Generate Recipe', duration: 2500 }
        ];

        this.ingredientDatabase = {
            vegetables: [
                { name: 'Onion', common: true, confidence: [85, 95] },
                { name: 'Tomato', common: true, confidence: [88, 96] },
                { name: 'Ginger', common: true, confidence: [82, 92] },
                { name: 'Garlic', common: true, confidence: [85, 94] },
                { name: 'Green Chili', common: true, confidence: [78, 88] },
                { name: 'Potato', common: true, confidence: [90, 98] },
                { name: 'Carrot', common: true, confidence: [87, 95] },
                { name: 'Bell Pepper', common: false, confidence: [80, 90] },
                { name: 'Eggplant', common: false, confidence: [75, 85] },
                { name: 'Okra', common: false, confidence: [70, 82] }
            ],
            spices: [
                { name: 'Turmeric Powder', common: true, confidence: [75, 88] },
                { name: 'Cumin Seeds', common: true, confidence: [80, 90] },
                { name: 'Mustard Seeds', common: true, confidence: [78, 86] },
                { name: 'Coriander Powder', common: true, confidence: [82, 91] },
                { name: 'Red Chili Powder', common: true, confidence: [85, 93] },
                { name: 'Garam Masala', common: true, confidence: [70, 82] },
                { name: 'Cardamom', common: false, confidence: [68, 78] },
                { name: 'Cinnamon', common: false, confidence: [72, 84] },
                { name: 'Bay Leaves', common: false, confidence: [65, 75] }
            ],
            proteins: [
                { name: 'Lentils (Dal)', common: true, confidence: [88, 96] },
                { name: 'Chickpeas', common: true, confidence: [85, 93] },
                { name: 'Paneer', common: false, confidence: [82, 90] },
                { name: 'Chicken', common: false, confidence: [90, 97] },
                { name: 'Mutton', common: false, confidence: [85, 92] }
            ],
            grains: [
                { name: 'Basmati Rice', common: true, confidence: [92, 98] },
                { name: 'Wheat Flour', common: true, confidence: [88, 95] },
                { name: 'Rice Flour', common: false, confidence: [80, 88] }
            ],
            dairy: [
                { name: 'Milk', common: true, confidence: [95, 99] },
                { name: 'Yogurt', common: true, confidence: [90, 96] },
                { name: 'Ghee', common: true, confidence: [85, 93] },
                { name: 'Butter', common: false, confidence: [88, 94] }
            ],
            others: [
                { name: 'Oil', common: true, confidence: [92, 98] },
                { name: 'Salt', common: true, confidence: [95, 99] },
                { name: 'Sugar', common: true, confidence: [90, 96] },
                { name: 'Coconut', common: false, confidence: [75, 85] },
                { name: 'Tamarind', common: false, confidence: [68, 78] }
            ]
        };

        this.cookingTechniques = [
            { name: 'Tadka/Tempering', confidence: [80, 92] },
            { name: 'Dum Cooking', confidence: [70, 85] },
            { name: 'Slow Cooking', confidence: [85, 94] },
            { name: 'Deep Frying', confidence: [88, 96] },
            { name: 'Steaming', confidence: [82, 90] },
            { name: 'Roasting', confidence: [85, 93] },
            { name: 'Grinding', confidence: [78, 88] },
            { name: 'Marinating', confidence: [75, 87] }
        ];

        this.recipeTemplates = {
            dal: {
                name: 'Traditional Dal',
                baseIngredients: ['Lentils (Dal)', 'Turmeric Powder', 'Salt', 'Water'],
                techniques: ['Slow Cooking', 'Tadka/Tempering'],
                time: 35,
                difficulty: 'Easy',
                cuisine: 'Traditional Indian'
            },
            rice: {
                name: 'Aromatic Rice Dish',
                baseIngredients: ['Basmati Rice', 'Ghee', 'Salt'],
                techniques: ['Dum Cooking', 'Tempering'],
                time: 45,
                difficulty: 'Medium',
                cuisine: 'Traditional Indian'
            },
            curry: {
                name: 'Traditional Curry',
                baseIngredients: ['Onion', 'Tomato', 'Ginger', 'Garlic'],
                techniques: ['Slow Cooking', 'Tempering'],
                time: 40,
                difficulty: 'Medium',
                cuisine: 'Traditional Indian'
            }
        };
    }

    async loadModels() {
        console.log('Loading AI models...');
        await this.delay(1000);
        this.isInitialized = true;
        return true;
    }

    async processVideo(videoFile) {
        if (!this.isInitialized) {
            await this.loadModels();
        }

        const results = {
            videoInfo: this.getVideoInfo(videoFile),
            processingSteps: [],
            ingredients: [],
            techniques: [],
            recipe: null,
            confidence: {}
        };

        // Process each step
        for (const step of this.processingSteps) {
            const stepResult = await this.processStep(step, videoFile);
            results.processingSteps.push(stepResult);
            
            // Update UI during processing
            this.updateProcessingUI(step, stepResult);
        }

        // Generate final recipe
        results.recipe = await this.generateRecipe(results);
        results.confidence = this.calculateConfidenceScores(results);

        return results;
    }

    async processStep(step, videoFile) {
        console.log(`Processing step: ${step.name}`);
        
        // Simulate processing time
        await this.delay(step.duration);

        switch (step.id) {
            case 'frames':
                return await this.analyzeFrames(videoFile);
            case 'audio':
                return await this.analyzeAudio(videoFile);
            case 'ingredients':
                return await this.detectIngredients(videoFile);
            case 'techniques':
                return await this.recognizeTechniques(videoFile);
            case 'recipe':
                return await this.structureRecipe(videoFile);
            default:
                return { success: true, data: {} };
        }
    }

    async analyzeFrames(videoFile) {
        // Simulate frame extraction and analysis
        const frameCount = Math.floor(Math.random() * 50) + 30;
        const detectedObjects = Math.floor(Math.random() * 15) + 5;
        
        return {
            success: true,
            data: {
                totalFrames: frameCount,
                analyzedFrames: frameCount,
                detectedObjects: detectedObjects,
                model: this.models.yolo
            }
        };
    }

    async analyzeAudio(videoFile) {
        // Simulate audio transcription
        const sampleTranscripts = [
            "First, heat oil in a pan and add cumin seeds...",
            "Add chopped onions and cook until golden brown...",
            "Now add ginger-garlic paste and green chilies...",
            "Add spices like turmeric, coriander, and red chili powder...",
            "Cook for 2-3 minutes until aromatic...",
            "Add chopped tomatoes and cook until soft...",
            "Finally, add the main ingredient and simmer..."
        ];
        
        const transcript = sampleTranscripts.slice(0, Math.floor(Math.random() * 4) + 3).join(' ');
        
        return {
            success: true,
            data: {
                transcript: transcript,
                duration: videoFile.duration || 180,
                language: 'Hindi/English',
                model: this.models.whisper
            }
        };
    }

    async detectIngredients(videoFile) {
        // Select random ingredients from database
        const selectedIngredients = [];
        const categories = Object.keys(this.ingredientDatabase);
        
        // Ensure we have a good mix of ingredients
        categories.forEach(category => {
            const items = this.ingredientDatabase[category];
            const count = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < count && i < items.length; i++) {
                const item = items[Math.floor(Math.random() * items.length)];
                if (!selectedIngredients.find(ing => ing.name === item.name)) {
                    const confidence = Math.floor(
                        Math.random() * (item.confidence[1] - item.confidence[0]) + item.confidence[0]
                    );
                    
                    selectedIngredients.push({
                        name: item.name,
                        category: category,
                        quantity: this.generateQuantity(item.name),
                        confidence: confidence,
                        detected: true
                    });
                }
            }
        });

        return {
            success: true,
            data: {
                ingredients: selectedIngredients.slice(0, 12), // Limit to 12 ingredients
                totalDetected: selectedIngredients.length,
                model: this.models.yolo
            }
        };
    }

    async recognizeTechniques(videoFile) {
        // Select random cooking techniques
        const techniqueCount = Math.floor(Math.random() * 4) + 2;
        const selectedTechniques = [];
        
        for (let i = 0; i < techniqueCount; i++) {
            const technique = this.cookingTechniques[
                Math.floor(Math.random() * this.cookingTechniques.length)
            ];
            
            if (!selectedTechniques.find(t => t.name === technique.name)) {
                const confidence = Math.floor(
                    Math.random() * (technique.confidence[1] - technique.confidence[0]) + technique.confidence[0]
                );
                
                selectedTechniques.push({
                    name: technique.name,
                    confidence: confidence,
                    timestamp: Math.floor(Math.random() * 180) + 30
                });
            }
        }

        return {
            success: true,
            data: {
                techniques: selectedTechniques,
                model: this.models.resnet
            }
        };
    }

    async structureRecipe(videoFile) {
        return {
            success: true,
            data: {
                structured: true,
                model: this.models.bert
            }
        };
    }

    async generateRecipe(results) {
        // Determine recipe type based on ingredients
        const ingredients = results.processingSteps.find(step => step.data.ingredients)?.data.ingredients || [];
        const techniques = results.processingSteps.find(step => step.data.techniques)?.data.techniques || [];
        
        let recipeTemplate;
        if (ingredients.some(ing => ing.name.includes('Dal') || ing.name.includes('Lentils'))) {
            recipeTemplate = this.recipeTemplates.dal;
        } else if (ingredients.some(ing => ing.name.includes('Rice'))) {
            recipeTemplate = this.recipeTemplates.rice;
        } else {
            recipeTemplate = this.recipeTemplates.curry;
        }

        // Generate recipe name
        const recipeName = this.generateRecipeName(ingredients, techniques);
        
        // Generate cooking steps
        const steps = this.generateCookingSteps(ingredients, techniques);
        
        // Calculate metadata
        const metadata = {
            name: recipeName,
            cookingTime: Math.floor(Math.random() * 30) + recipeTemplate.time,
            difficulty: recipeTemplate.difficulty,
            cuisine: recipeTemplate.cuisine,
            servings: Math.floor(Math.random() * 4) + 2,
            category: this.categorizeRecipe(ingredients)
        };

        return {
            ...metadata,
            ingredients: ingredients,
            steps: steps,
            techniques: techniques,
            nutritionInfo: this.generateNutritionInfo(ingredients),
            tips: this.generateCookingTips(techniques)
        };
    }

    generateRecipeName(ingredients, techniques) {
        const primaryIngredient = ingredients.find(ing => 
            ing.confidence > 85 && (ing.category === 'proteins' || ing.category === 'grains')
        );
        
        const hasTraditionalTechnique = techniques.some(tech => 
            tech.name.includes('Tadka') || tech.name.includes('Dum')
        );

        const baseName = primaryIngredient ? primaryIngredient.name : 'Traditional';
        const prefix = hasTraditionalTechnique ? 'Traditional' : 'Homestyle';
        
        const recipeNames = [
            `${prefix} ${baseName} Curry`,
            `Grandma's ${baseName} Recipe`,
            `Heritage ${baseName} Dish`,
            `Classic ${baseName} Preparation`,
            `Authentic ${baseName} Style`
        ];

        return recipeNames[Math.floor(Math.random() * recipeNames.length)];
    }

    generateCookingSteps(ingredients, techniques) {
        const baseSteps = [
            {
                step: 1,
                instruction: "Heat oil in a heavy-bottomed pan over medium heat.",
                time: "2-3 minutes",
                technique: "Basic Heating",
                temperature: "Medium heat"
            },
            {
                step: 2,
                instruction: "Add cumin seeds and mustard seeds. Let them splutter.",
                time: "30 seconds",
                technique: "Tadka/Tempering",
                temperature: "Medium heat"
            },
            {
                step: 3,
                instruction: "Add chopped onions and cook until golden brown.",
                time: "5-7 minutes",
                technique: "Sautéing",
                temperature: "Medium heat"
            },
            {
                step: 4,
                instruction: "Add ginger-garlic paste and green chilies. Cook until aromatic.",
                time: "2 minutes",
                technique: "Sautéing",
                temperature: "Medium heat"
            }
        ];

        // Add ingredient-specific steps
        if (ingredients.some(ing => ing.name.includes('Tomato'))) {
            baseSteps.push({
                step: baseSteps.length + 1,
                instruction: "Add chopped tomatoes and cook until they break down completely.",
                time: "8-10 minutes",
                technique: "Slow Cooking",
                temperature: "Medium-low heat"
            });
        }

        // Add spice step
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Add all the spices - turmeric, coriander powder, and red chili powder. Mix well.",
            time: "1-2 minutes",
            technique: "Spice Tempering",
            temperature: "Low heat"
        });

        // Add main ingredient step
        const mainIngredient = ingredients.find(ing => 
            ing.category === 'proteins' || ing.category === 'grains'
        );
        
        if (mainIngredient) {
            baseSteps.push({
                step: baseSteps.length + 1,
                instruction: `Add ${mainIngredient.name.toLowerCase()} and mix gently with the spice mixture.`,
                time: "3-5 minutes",
                technique: "Mixing",
                temperature: "Medium heat"
            });
        }

        // Add liquid and cooking step
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Add water as needed and bring to a boil. Then reduce heat and simmer.",
            time: "15-20 minutes",
            technique: "Slow Cooking",
            temperature: "Low heat"
        });

        // Final seasoning
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Adjust salt and spices to taste. Garnish with fresh coriander leaves.",
            time: "2 minutes",
            technique: "Final Seasoning",
            temperature: "Off heat"
        });

        return baseSteps;
    }

    generateQuantity(ingredientName) {
        const quantityMap = {
            'Onion': ['2 medium', '1 large', '3 small'],
            'Tomato': ['3 medium', '2 large', '4 small'],
            'Ginger': ['1 inch piece', '2 tsp minced', '1 tbsp paste'],
            'Garlic': ['4-5 cloves', '1 tsp minced', '1 tbsp paste'],
            'Green Chili': ['2-3 pieces', '1-2 slit', '1 tsp chopped'],
            'Turmeric Powder': ['1/2 tsp', '1 tsp', '1/4 tsp'],
            'Cumin Seeds': ['1 tsp', '1/2 tsp', '2 tsp'],
            'Oil': ['2 tbsp', '3 tbsp', '1 tbsp'],
            'Salt': ['to taste', '1 tsp', '1/2 tsp'],
            'Lentils (Dal)': ['1 cup', '1/2 cup', '3/4 cup'],
            'Basmati Rice': ['1 cup', '2 cups', '1.5 cups']
        };

        const options = quantityMap[ingredientName] || ['1 cup', '2 tbsp', '1 tsp'];
        return options[Math.floor(Math.random() * options.length)];
    }

    categorizeRecipe(ingredients) {
        if (ingredients.some(ing => ing.category === 'proteins' && ing.name.includes('Dal'))) {
            return 'Lentil Dishes';
        } else if (ingredients.some(ing => ing.category === 'grains' && ing.name.includes('Rice'))) {
            return 'Rice Dishes';
        } else if (ingredients.some(ing => ing.category === 'vegetables')) {
            return 'Vegetable Curries';
        } else {
            return 'Traditional Curries';
        }
    }

    generateNutritionInfo(ingredients) {
        return {
            calories: Math.floor(Math.random() * 200) + 150,
            protein: Math.floor(Math.random() * 15) + 5,
            carbs: Math.floor(Math.random() * 30) + 20,
            fat: Math.floor(Math.random() * 10) + 3,
            fiber: Math.floor(Math.random() * 8) + 2
        };
    }

    generateCookingTips(techniques) {
        const tipDatabase = {
            'Tadka/Tempering': 'For perfect tadka, heat oil until it shimmers but doesn\'t smoke. Seeds should splutter immediately when added.',
            'Dum Cooking': 'Cover the pot with aluminum foil before placing the lid for better steam retention during dum cooking.',
            'Slow Cooking': 'Patience is key - slow cooking develops deeper flavors and better texture.',
            'Deep Frying': 'Maintain consistent oil temperature for even cooking and less oil absorption.'
        };

        return techniques.map(tech => tipDatabase[tech.name]).filter(Boolean);
    }

    calculateConfidenceScores(results) {
        const ingredients = results.processingSteps.find(step => step.data.ingredients)?.data.ingredients || [];
        const techniques = results.processingSteps.find(step => step.data.techniques)?.data.techniques || [];

        const avgIngredientConfidence = ingredients.reduce((sum, ing) => sum + ing.confidence, 0) / ingredients.length || 0;
        const avgTechniqueConfidence = techniques.reduce((sum, tech) => sum + tech.confidence, 0) / techniques.length || 0;

        return {
            overall: Math.floor((avgIngredientConfidence + avgTechniqueConfidence) / 2),
            ingredients: Math.floor(avgIngredientConfidence),
            techniques: Math.floor(avgTechniqueConfidence),
            audioTranscription: Math.floor(Math.random() * 20) + 75,
            recipeGeneration: Math.floor(Math.random() * 15) + 80
        };
    }

    updateProcessingUI(step, result) {
        const stepElement = document.querySelector(`[data-step="${step.id}"]`);
        if (stepElement) {
            stepElement.classList.add('processing');
            
            const progressBar = stepElement.querySelector('.progress');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
            
            setTimeout(() => {
                stepElement.classList.remove('processing');
                stepElement.classList.add('completed');
            }, 500);
        }
    }

    getVideoInfo(videoFile) {
        return {
            name: videoFile.name,
            size: this.formatFileSize(videoFile.size),
            type: videoFile.type,
            duration: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
            estimated: true
        };
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for global use
window.RecipeExtractorAI = RecipeExtractorAI;