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
                { name: 'Small Onion (Sambar Onion)', common: true, confidence: [88, 96], tamil: 'சின்ன வெங்காயம்' },
                { name: 'Tomato', common: true, confidence: [90, 98], tamil: 'தக்காளி' },
                { name: 'Ginger', common: true, confidence: [85, 94], tamil: 'இஞ்சி' },
                { name: 'Garlic', common: true, confidence: [87, 95], tamil: 'பூண்டு' },
                { name: 'Green Chili', common: true, confidence: [82, 92], tamil: 'பச்சை மிளகாய்' },
                { name: 'Drumstick', common: true, confidence: [85, 93], tamil: 'முருங்கைக்காய்' },
                { name: 'Brinjal (Eggplant)', common: true, confidence: [88, 95], tamil: 'கத்தரிக்காய்' },
                { name: 'Okra (Ladies Finger)', common: true, confidence: [84, 92], tamil: 'வெண்டைக்காய்' },
                { name: 'Bottle Gourd', common: false, confidence: [78, 88], tamil: 'சுரைக்காய்' },
                { name: 'Ridge Gourd', common: false, confidence: [76, 86], tamil: 'பீர்க்கங்காய்' },
                { name: 'Snake Gourd', common: false, confidence: [74, 84], tamil: 'புடலங்காய்' },
                { name: 'Ash Gourd', common: false, confidence: [72, 82], tamil: 'பூசணிக்காய்' },
                { name: 'Plantain (Raw Banana)', common: true, confidence: [86, 94], tamil: 'வாழைக்காய்' },
                { name: 'Yam', common: false, confidence: [70, 80], tamil: 'செனைக்கிழங்கு' },
                { name: 'Elephant Yam', common: false, confidence: [68, 78], tamil: 'சேனைக்கிழங்கு' }
            ],
            spices: [
                { name: 'Turmeric Powder', common: true, confidence: [88, 96], tamil: 'மஞ்சள் தூள்' },
                { name: 'Mustard Seeds', common: true, confidence: [92, 98], tamil: 'கடுகு' },
                { name: 'Cumin Seeds', common: true, confidence: [85, 93], tamil: 'சீரகம்' },
                { name: 'Fenugreek Seeds', common: true, confidence: [82, 90], tamil: 'வெந்தயம்' },
                { name: 'Coriander Seeds', common: true, confidence: [86, 94], tamil: 'தனியா' },
                { name: 'Red Chili Powder', common: true, confidence: [90, 97], tamil: 'மிளகாய் தூள்' },
                { name: 'Sambar Powder', common: true, confidence: [88, 95], tamil: 'சாம்பார் பொடி' },
                { name: 'Rasam Powder', common: true, confidence: [85, 92], tamil: 'ரசம் பொடி' },
                { name: 'Garam Masala', common: false, confidence: [75, 85], tamil: 'கரம் மசாலா' },
                { name: 'Curry Leaves', common: true, confidence: [94, 99], tamil: 'கறிவேப்பிலை' },
                { name: 'Asafoetida (Hing)', common: true, confidence: [80, 88], tamil: 'பெருங்காயம்' },
                { name: 'Black Pepper', common: true, confidence: [83, 91], tamil: 'மிளகு' },
                { name: 'Cardamom', common: false, confidence: [78, 86], tamil: 'ஏலக்காய்' },
                { name: 'Cinnamon', common: false, confidence: [76, 84], tamil: 'பட்டை' },
                { name: 'Cloves', common: false, confidence: [74, 82], tamil: 'கிராம்பு' },
                { name: 'Star Anise', common: false, confidence: [70, 80], tamil: 'அன்னாசிப்பூ' }
            ],
            proteins: [
                { name: 'Toor Dal (Pigeon Pea)', common: true, confidence: [92, 98], tamil: 'துவரம் பருப்பு' },
                { name: 'Moong Dal', common: true, confidence: [88, 95], tamil: 'பாசிப்பருப்பு' },
                { name: 'Chana Dal', common: true, confidence: [85, 93], tamil: 'கடலைப்பருப்பு' },
                { name: 'Urad Dal', common: true, confidence: [87, 94], tamil: 'உளுந்து' },
                { name: 'Masoor Dal', common: false, confidence: [80, 88], tamil: 'மசூர் பருப்பு' },
                { name: 'Black Gram (Whole)', common: true, confidence: [84, 92], tamil: 'கருப்பு உளுந்து' },
                { name: 'Chicken', common: false, confidence: [88, 95], tamil: 'கோழி' },
                { name: 'Mutton', common: false, confidence: [85, 92], tamil: 'ஆட்டு இறைச்சி' },
                { name: 'Fish', common: true, confidence: [90, 96], tamil: 'மீன்' },
                { name: 'Prawns', common: true, confidence: [86, 93], tamil: 'இறால்' },
                { name: 'Crab', common: false, confidence: [78, 86], tamil: 'நண்டு' }
            ],
            grains: [
                { name: 'Raw Rice (Pachai Arisi)', common: true, confidence: [95, 99], tamil: 'பச்சை அரிசி' },
                { name: 'Parboiled Rice (Puzhungal Arisi)', common: true, confidence: [93, 98], tamil: 'புழுங்கல் அரிசி' },
                { name: 'Basmati Rice', common: false, confidence: [85, 92], tamil: 'பாஸ்மதி அரிசி' },
                { name: 'Rice Flour', common: true, confidence: [88, 95], tamil: 'அரிசி மாவு' },
                { name: 'Wheat Flour', common: true, confidence: [86, 93], tamil: 'கோதுமை மாவு' },
                { name: 'Ragi Flour', common: false, confidence: [80, 88], tamil: 'கேழ்வரகு மாவு' },
                { name: 'Semolina (Rava)', common: true, confidence: [84, 91], tamil: 'ரவை' }
            ],
            dairy: [
                { name: 'Milk', common: true, confidence: [95, 99], tamil: 'பால்' },
                { name: 'Curd (Yogurt)', common: true, confidence: [92, 98], tamil: 'தயிர்' },
                { name: 'Ghee', common: true, confidence: [90, 96], tamil: 'நெய்' },
                { name: 'Buttermilk', common: true, confidence: [88, 94], tamil: 'மோர்' },
                { name: 'Coconut Milk', common: true, confidence: [85, 93], tamil: 'தேங்காய் பால்' },
                { name: 'Paneer', common: false, confidence: [75, 85], tamil: 'பன்னீர்' }
            ],
            others: [
                { name: 'Sesame Oil (Gingelly Oil)', common: true, confidence: [94, 98], tamil: 'நல்லெண்ணெய்' },
                { name: 'Coconut Oil', common: true, confidence: [92, 97], tamil: 'தேங்காய் எண்ணெய்' },
                { name: 'Groundnut Oil', common: true, confidence: [90, 95], tamil: 'கடலை எண்ணெய்' },
                { name: 'Salt', common: true, confidence: [98, 99], tamil: 'உப்பு' },
                { name: 'Jaggery', common: true, confidence: [88, 94], tamil: 'வெல்லம்' },
                { name: 'Sugar', common: true, confidence: [85, 92], tamil: 'சர்க்கரை' },
                { name: 'Fresh Coconut', common: true, confidence: [90, 96], tamil: 'தேங்காய்' },
                { name: 'Tamarind', common: true, confidence: [86, 93], tamil: 'புளி' },
                { name: 'Kokum', common: false, confidence: [70, 80], tamil: 'கோகம்' },
                { name: 'Dried Red Chilies', common: true, confidence: [88, 95], tamil: 'காய்ந்த மிளகாய்' },
                { name: 'Banana Leaves', common: true, confidence: [82, 90], tamil: 'வாழை இலை' }
            ]
        };

        this.cookingTechniques = [
            { name: 'Thalippu (Tempering)', confidence: [88, 96], tamil: 'தாளிப்பு', description: 'Traditional South Indian tempering technique' },
            { name: 'Kozhambhu Method', confidence: [85, 93], tamil: 'கொழம்பு', description: 'Traditional curry/gravy preparation' },
            { name: 'Araithal (Grinding)', confidence: [90, 97], tamil: 'அரைத்தல்', description: 'Stone grinding for pastes and batters' },
            { name: 'Idli/Dosa Batter Fermentation', confidence: [92, 98], tamil: 'புளிப்பு', description: 'Natural fermentation process' },
            { name: 'Dum Cooking', confidence: [78, 88], tamil: 'தம் குக்கிங்', description: 'Slow cooking with sealed pot' },
            { name: 'Varuval (Dry Roasting)', confidence: [86, 94], tamil: 'வறுவல்', description: 'Dry roasting technique' },
            { name: 'Poriyal Method', confidence: [88, 95], tamil: 'பொரியல்', description: 'Stir-fry with coconut' },
            { name: 'Aviyal Technique', confidence: [82, 90], tamil: 'அவியல்', description: 'Mixed vegetable curry method' },
            { name: 'Rasam Preparation', confidence: [90, 96], tamil: 'ரசம்', description: 'Traditional South Indian soup' },
            { name: 'Sambar Cooking', confidence: [92, 97], tamil: 'சாம்பார்', description: 'Lentil-based vegetable stew' },
            { name: 'Banana Leaf Steaming', confidence: [80, 88], tamil: 'வாழை இலை ஆவி', description: 'Steaming in banana leaves' },
            { name: 'Clay Pot Cooking', confidence: [75, 85], tamil: 'மண் பானை', description: 'Traditional earthenware cooking' }
        ];

        this.recipeTemplates = {
            sambar: {
                name: 'Traditional Sambar',
                baseIngredients: ['Toor Dal (Pigeon Pea)', 'Sambar Powder', 'Tamarind', 'Turmeric Powder'],
                techniques: ['Sambar Cooking', 'Thalippu (Tempering)'],
                time: 35,
                difficulty: 'Medium',
                cuisine: 'South Indian Tamil'
            },
            rasam: {
                name: 'Traditional Rasam',
                baseIngredients: ['Toor Dal (Pigeon Pea)', 'Rasam Powder', 'Tamarind', 'Tomato'],
                techniques: ['Rasam Preparation', 'Thalippu (Tempering)'],
                time: 25,
                difficulty: 'Easy',
                cuisine: 'South Indian Tamil'
            },
            poriyal: {
                name: 'Traditional Poriyal',
                baseIngredients: ['Fresh Coconut', 'Mustard Seeds', 'Curry Leaves', 'Turmeric Powder'],
                techniques: ['Poriyal Method', 'Thalippu (Tempering)'],
                time: 20,
                difficulty: 'Easy',
                cuisine: 'South Indian Tamil'
            },
            biryani: {
                name: 'Traditional Biryani',
                baseIngredients: ['Raw Rice (Pachai Arisi)', 'Ghee', 'Whole Spices'],
                techniques: ['Dum Cooking', 'Thalippu (Tempering)'],
                time: 45,
                difficulty: 'Hard',
                cuisine: 'South Indian'
            },
            kozhambhu: {
                name: 'Traditional Kozhambhu',
                baseIngredients: ['Small Onion (Sambar Onion)', 'Tomato', 'Tamarind', 'Curry Leaves'],
                techniques: ['Kozhambhu Method', 'Thalippu (Tempering)'],
                time: 40,
                difficulty: 'Medium',
                cuisine: 'South Indian Tamil'
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
            "முதலில் கடாயில் எண்ணெய் விட்டு கடுகு போடுங்கள்... First heat oil in kadai and add mustard seeds...",
            "கடுகு தாளித்ததும் கறிவேப்பிலை சேர்க்கவும்... After mustard seeds splutter, add curry leaves...",
            "சின்ன வெங்காயம் சேர்த்து வதக்கவும்... Add small onions and sauté well...",
            "இஞ்சி பூண்டு விழுது சேர்த்து நன்றாக வதக்கவும்... Add ginger-garlic paste and sauté well...",
            "மஞ்சள் தூள், மிளகாய் தூள் சேர்க்கவும்... Add turmeric powder and red chili powder...",
            "தக்காளி சேர்த்து நன்றாக மசித்து விடுங்கள்... Add tomatoes and mash them well...",
            "புளி கரைத்த நீர் சேர்த்து கொதிக்க விடுங்கள்... Add tamarind water and let it boil...",
            "சாம்பார் பொடி சேர்த்து நன்றாக கலக்கவும்... Add sambar powder and mix well...",
            "துவரம் பருப்பு வேக வைத்து சேர்க்கவும்... Add cooked toor dal...",
            "உப்பு சேர்த்து ருசி பார்த்து கொள்ளுங்கள்... Add salt and taste..."
        ];
        
        const transcript = sampleTranscripts.slice(0, Math.floor(Math.random() * 4) + 3).join(' ');
        
        return {
            success: true,
            data: {
                transcript: transcript,
                duration: videoFile.duration || 180,
                language: 'Tamil/Telugu/Malayalam/English',
                detectedLanguage: ['Tamil', 'Telugu', 'Malayalam'][Math.floor(Math.random() * 3)],
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
            recipeTemplate = this.recipeTemplates.sambar;
        } else if (ingredients.some(ing => ing.name.includes('Rice'))) {
            recipeTemplate = this.recipeTemplates.biryani;
        } else {
            recipeTemplate = this.recipeTemplates.kozhambhu;
        }
        
        // Fallback to ensure recipeTemplate is never undefined
        if (!recipeTemplate) {
            recipeTemplate = this.recipeTemplates.sambar;
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
            tech.name.includes('Thalippu') || tech.name.includes('Sambar') || tech.name.includes('Rasam')
        );

        const baseName = primaryIngredient ? primaryIngredient.name.split('(')[0].trim() : 'Traditional';
        const prefix = hasTraditionalTechnique ? 'Paatti\'s' : 'Traditional Tamil';
        
        const recipeNames = [
            `${prefix} ${baseName} Sambar`,
            `Traditional Tamil ${baseName} Kozhambhu`,
            `Heritage ${baseName} Poriyal`,
            `Authentic Chettinad ${baseName}`,
            `Classic Tamil ${baseName} Curry`,
            `Paatti's Special ${baseName} Recipe`,
            `Traditional ${baseName} Rasam`,
            `South Indian ${baseName} Preparation`
        ];

        return recipeNames[Math.floor(Math.random() * recipeNames.length)];
    }

    generateCookingSteps(ingredients, techniques) {
        const baseSteps = [
            {
                step: 1,
                instruction: "Heat sesame oil (nallennai) or coconut oil in a heavy-bottomed kadai over medium heat.",
                time: "2-3 minutes",
                technique: "Oil Heating",
                temperature: "Medium heat"
            },
            {
                step: 2,
                instruction: "Add mustard seeds and let them splutter. Then add cumin seeds and curry leaves.",
                time: "1 minute",
                technique: "Thalippu (Tempering)",
                temperature: "Medium heat"
            },
            {
                step: 3,
                instruction: "Add small onions (sambar onions) and sauté until they turn golden brown.",
                time: "5-7 minutes",
                technique: "Sautéing",
                temperature: "Medium heat"
            },
            {
                step: 4,
                instruction: "Add ginger-garlic paste and green chilies. Sauté until the raw smell disappears.",
                time: "2 minutes",
                technique: "Sautéing",
                temperature: "Medium heat"
            }
        ];

        // Add ingredient-specific steps
        if (ingredients.some(ing => ing.name.includes('Tomato'))) {
            baseSteps.push({
                step: baseSteps.length + 1,
                instruction: "Add chopped tomatoes and cook until they become mushy and oil separates.",
                time: "8-10 minutes",
                technique: "Tomato Cooking",
                temperature: "Medium-low heat"
            });
        }

        // Add tamarind step for South Indian dishes
        if (ingredients.some(ing => ing.name.includes('Tamarind'))) {
            baseSteps.push({
                step: baseSteps.length + 1,
                instruction: "Add tamarind water (soak tamarind in warm water and extract juice). Bring to a boil.",
                time: "5-7 minutes",
                technique: "Tamarind Addition",
                temperature: "High heat"
            });
        }

        // Add spice step
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Add turmeric powder, sambar powder (or rasam powder), and red chili powder. Mix well to avoid lumps.",
            time: "1-2 minutes",
            technique: "Spice Addition",
            temperature: "Low heat"
        });

        // Add main ingredient step
        const mainIngredient = ingredients.find(ing => 
            ing.category === 'proteins' || ing.category === 'grains'
        );
        
        if (mainIngredient) {
            baseSteps.push({
                step: baseSteps.length + 1,
                instruction: `Add cooked ${mainIngredient.name.toLowerCase()} and mix gently with the spice mixture.`,
                time: "3-5 minutes",
                technique: "Mixing",
                temperature: "Medium heat"
            });
        }

        // Add final cooking step
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Add required amount of water, bring to a boil, then reduce heat and simmer until flavors blend well.",
            time: "10-15 minutes",
            technique: "Simmering",
            temperature: "Low heat"
        });

        // Final seasoning
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Adjust salt to taste. Garnish with fresh curry leaves and coriander leaves. Serve hot with rice.",
            time: "2 minutes",
            technique: "Final Seasoning",
            temperature: "Off heat"
        });

        return baseSteps;
    }

    generateQuantity(ingredientName) {
        const quantityMap = {
            'Small Onion (Sambar Onion)': ['10-12 pieces', '1 cup chopped', '8-10 pieces'],
            'Tomato': ['3 medium', '2 large', '4 small'],
            'Ginger': ['1 inch piece', '1 tsp paste', '2 tsp minced'],
            'Garlic': ['6-8 cloves', '1 tsp paste', '1 tbsp minced'],
            'Green Chili': ['2-3 pieces', '1-2 slit', '1 tsp chopped'],
            'Turmeric Powder': ['1/2 tsp', '1/4 tsp', '3/4 tsp'],
            'Mustard Seeds': ['1 tsp', '1/2 tsp', '3/4 tsp'],
            'Cumin Seeds': ['1/2 tsp', '1 tsp', '3/4 tsp'],
            'Curry Leaves': ['8-10 leaves', '1 sprig', '6-8 leaves'],
            'Sesame Oil (Gingelly Oil)': ['2 tbsp', '3 tbsp', '1 tbsp'],
            'Coconut Oil': ['2 tbsp', '1 tbsp', '3 tbsp'],
            'Salt': ['to taste', '1 tsp', '1/2 tsp'],
            'Toor Dal (Pigeon Pea)': ['1 cup', '3/4 cup', '1/2 cup'],
            'Raw Rice (Pachai Arisi)': ['1 cup', '2 cups', '1.5 cups'],
            'Tamarind': ['lemon-sized ball', '2 tbsp paste', '1 tbsp extract'],
            'Sambar Powder': ['2 tbsp', '1 tbsp', '3 tbsp'],
            'Rasam Powder': ['1 tbsp', '2 tsp', '1.5 tbsp'],
            'Fresh Coconut': ['1/2 cup grated', '1/4 cup', '3/4 cup grated'],
            'Jaggery': ['1 tbsp', '2 tsp', '1 tsp'],
            'Asafoetida (Hing)': ['pinch', '1/4 tsp', '1/8 tsp']
        };

        const options = quantityMap[ingredientName] || ['1 cup', '2 tbsp', '1 tsp'];
        return options[Math.floor(Math.random() * options.length)];
    }

    categorizeRecipe(ingredients) {
        if (ingredients.some(ing => ing.name.includes('Toor Dal') || ing.name.includes('Sambar'))) {
            return 'Sambar & Kozhambhu';
        } else if (ingredients.some(ing => ing.name.includes('Rasam'))) {
            return 'Rasam Varieties';
        } else if (ingredients.some(ing => ing.category === 'grains' && ing.name.includes('Rice'))) {
            return 'Rice Dishes';
        } else if (ingredients.some(ing => ing.category === 'vegetables' && ing.name.includes('Coconut'))) {
            return 'Poriyal & Thoran';
        } else if (ingredients.some(ing => ing.category === 'proteins' && ing.name.includes('Dal'))) {
            return 'Dal Varieties';
        } else {
            return 'Traditional Tamil Dishes';
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
            'Thalippu (Tempering)': 'For perfect thalippu, heat oil until it shimmers. Mustard seeds should splutter immediately, followed by curry leaves for authentic flavor.',
            'Dum Cooking': 'Cover the pot with aluminum foil before placing the lid for better steam retention during dum cooking.',
            'Sambar Cooking': 'Always add tamarind water first, let it boil, then add cooked dal. This prevents the dal from curdling.',
            'Rasam Preparation': 'Rasam should be thin and tangy. Don\'t let it boil vigorously after adding dal water.',
            'Poriyal Method': 'Add grated coconut at the end and mix gently to retain texture and flavor.',
            'Kozhambhu Method': 'Cook vegetables separately and add to the tamarind base to maintain their texture.',
            'Araithal (Grinding)': 'Use minimal water while grinding to get a smooth paste. Stone grinding gives the best texture.',
            'Clay Pot Cooking': 'Soak clay pots in water for 30 minutes before use. They enhance the earthy flavor of the dish.'
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