// Recipe Extractor AI Simulation
class RecipeExtractorAI {
    constructor() {
        this.models = {
            yolo: 'YOLO-v8 South Indian Cuisine Specialized',
            whisper: 'Whisper Multilingual (Tamil/Telugu/Malayalam)',
            resnet: 'ResNet-50 Traditional Cooking Techniques',
            bert: 'BERT Cultural Recipe Generation'
        };
        
        this.isInitialized = false;
        this.processingSteps = [
            { id: 'frames', name: 'Extract Frames & Identify South Indian Ingredients', duration: 2500 },
            { id: 'audio', name: 'Transcribe Tamil/Telugu/Malayalam Audio', duration: 3000 },
            { id: 'ingredients', name: 'Detect Traditional Spices & Vegetables', duration: 3500 },
            { id: 'techniques', name: 'Recognize Traditional Cooking Methods', duration: 2500 },
            { id: 'recipe', name: 'Generate Authentic Regional Recipe', duration: 3000 }
        ];

        this.ingredientDatabase = {
            spices: [
                { name: 'Mustard Seeds', common: true, confidence: [93, 97], tamil: 'கடுகு', telugu: 'ఆవాలు', malayalam: 'കടുക്', quantity: '1 tsp' },
                { name: 'Cumin Seeds', common: true, confidence: [92, 96], tamil: 'சீரகம்', telugu: 'జీలకర్ర', malayalam: 'ജീരകം', quantity: '1/2 tsp' },
                { name: 'Fenugreek Seeds', common: true, confidence: [90, 94], tamil: 'வெந்தயம்', telugu: 'మెంతులు', malayalam: 'ഉലുവ', quantity: '1/4 tsp' },
                { name: 'Asafoetida', common: true, confidence: [86, 90], tamil: 'பெருங்காயம்', telugu: 'ఇంగువ', malayalam: 'കായം', quantity: 'pinch' },
                { name: 'Curry Leaves', common: true, confidence: [94, 98], tamil: 'கறிவேப்பிலை', telugu: 'కరివేపాకు', malayalam: 'കറിവേപ്പില', quantity: '8-10 leaves' },
                { name: 'Black Pepper', common: true, confidence: [91, 95], tamil: 'மிளகு', telugu: 'మిరియాలు', malayalam: 'കുരുമുളക്', quantity: '1/2 tsp' },
                { name: 'Cardamom', common: true, confidence: [89, 93], tamil: 'ஏலக்காய்', telugu: 'ఏలకులు', malayalam: 'ഏലം', quantity: '2-3 pods' },
                { name: 'Cloves', common: true, confidence: [87, 91], tamil: 'கிராம்பு', telugu: 'లవంగం', malayalam: 'ഗ്രാമ്പൂ', quantity: '2-3 pieces' },
                { name: 'Cinnamon', common: true, confidence: [88, 92], tamil: 'பட்டை', telugu: 'దాల్చిన చెక్క', malayalam: 'കറുവാപ്പട്ട', quantity: '1 inch piece' },
                { name: 'Star Anise', common: false, confidence: [85, 89], tamil: 'அன்னாசிப்பூ', telugu: 'చక్రఫూలం', malayalam: 'താരകപുഷ്പം', quantity: '1 piece' },
                { name: 'Turmeric Powder', common: true, confidence: [92, 96], tamil: 'மஞ்சள் தூள்', telugu: 'పసుపు పొడి', malayalam: 'മഞ്ഞൾ പൊടി', quantity: '1/2 tsp' },
                { name: 'Red Chili Powder', common: true, confidence: [90, 94], tamil: 'மிளகாய் தூள்', telugu: 'మిరపకాయ పొడి', malayalam: 'മുളക് പൊടി', quantity: '1 tsp' },
                { name: 'Coriander Powder', common: true, confidence: [88, 92], tamil: 'தனியா தூள்', telugu: 'ధనియాల పొడి', malayalam: 'മല്ലി പൊടി', quantity: '1 tsp' },
                { name: 'Sambar Powder', common: true, confidence: [89, 93], tamil: 'சாம்பார் பொடி', telugu: 'సాంబార్ పొడి', malayalam: 'സാമ്പാർ പൊടി', quantity: '2 tsp' },
                { name: 'Rasam Powder', common: true, confidence: [87, 91], tamil: 'ரசம் பொடி', telugu: 'రసం పొడి', malayalam: 'രസം പൊടി', quantity: '1 tsp' }
            ],
            vegetables: [
                { name: 'Drumstick', common: true, confidence: [92, 96], tamil: 'முருங்கைக்காய்', telugu: 'మునగకాయ', malayalam: 'മുരിങ്ങക്കായ്', quantity: '2-3 pieces' },
                { name: 'Ladies Finger (Okra)', common: true, confidence: [94, 98], tamil: 'வெண்டைக்காய்', telugu: 'బెండకాయ', malayalam: 'വെണ്ടക്ക', quantity: '200g' },
                { name: 'Bottle Gourd', common: true, confidence: [89, 93], tamil: 'சுரைக்காய்', telugu: 'సొరకాయ', malayalam: 'ചുരക്ക', quantity: '250g' },
                { name: 'Ridge Gourd', common: true, confidence: [87, 91], tamil: 'பீர்க்கங்காய்', telugu: 'బీరకాయ', malayalam: 'പീര്‍ക്കങ്ങ', quantity: '200g' },
                { name: 'Snake Gourd', common: true, confidence: [85, 89], tamil: 'புடலங்காய்', telugu: 'పొట్లకాయ', malayalam: 'പടവലങ്ങ', quantity: '150g' },
                { name: 'Ivy Gourd', common: true, confidence: [86, 90], tamil: 'கோவக்காய்', telugu: 'దొండకాయ', malayalam: 'കോവക്ക', quantity: '200g' },
                { name: 'Brinjal (Eggplant)', common: true, confidence: [93, 97], tamil: 'கத்தரிக்காய்', telugu: 'వంకాయ', malayalam: 'വഴുതനങ്ങ', quantity: '2 medium' },
                { name: 'Plantain (Raw Banana)', common: true, confidence: [91, 95], tamil: 'வாழைக்காய்', telugu: 'అరటికాయ', malayalam: 'വാഴക്ക', quantity: '1 large' },
                { name: 'Yam', common: true, confidence: [88, 92], tamil: 'செனைக்கிழங்கு', telugu: 'చామదుంప', malayalam: 'ചേന', quantity: '200g' },
                { name: 'Taro Root', common: true, confidence: [86, 90], tamil: 'சேப்பங்கிழங்கு', telugu: 'చేమదుంప', malayalam: 'ചേമ്പ്', quantity: '150g' },
                { name: 'Sweet Potato', common: true, confidence: [90, 94], tamil: 'சக்கரவள்ளிக்கிழங்கு', telugu: 'చిలకడదుంప', malayalam: 'മധുരക്കിഴങ്ങ്', quantity: '200g' },
                { name: 'Small Onion', common: true, confidence: [95, 99], tamil: 'சின்ன வெங்காயம்', telugu: 'చిన్న ఉల్లిపాయ', malayalam: 'ചെറിയ ഉള്ളി', quantity: '10-12 pieces' },
                { name: 'Tomato', common: true, confidence: [96, 99], tamil: 'தக்காளி', telugu: 'టమాటో', malayalam: 'തക്കാളി', quantity: '2 medium' },
                { name: 'Green Chili', common: true, confidence: [94, 98], tamil: 'பச்சை மிளகாய்', telugu: 'పచ్చిమిర్చి', malayalam: 'പച്ചമുളക്', quantity: '3-4 pieces' },
                { name: 'Ginger', common: true, confidence: [93, 97], tamil: 'இஞ்சி', telugu: 'అల్లం', malayalam: 'ഇഞ്ചി', quantity: '1 inch piece' },
                { name: 'Garlic', common: true, confidence: [92, 96], tamil: 'பூண்டு', telugu: 'వెల్లుల్లి', malayalam: 'വെളുത്തുള്ളി', quantity: '4-5 cloves' }
            ],
            proteins: [
                { name: 'Toor Dal (Pigeon Pea)', common: true, confidence: [94, 98], tamil: 'துவரம் பருப்பு', telugu: 'కందిపప్పు', malayalam: 'തുവരപ്പരിപ്പ്', quantity: '1 cup' },
                { name: 'Moong Dal', common: true, confidence: [92, 96], tamil: 'பாசிப்பருப்பு', telugu: 'పెసలుపప్పు', malayalam: 'ചെറുപയർ', quantity: '1/2 cup' },
                { name: 'Urad Dal', common: true, confidence: [91, 95], tamil: 'உளுந்து', telugu: 'మినుములు', malayalam: 'ഉഴുന്ന്', quantity: '1/2 cup' },
                { name: 'Chana Dal', common: true, confidence: [89, 93], tamil: 'கடலைப்பருப்பு', telugu: 'శనగపప్పు', malayalam: 'കടലപ്പരിപ്പ്', quantity: '1/2 cup' },
                { name: 'Masoor Dal', common: true, confidence: [87, 91], tamil: 'மசூர் பருப்பு', telugu: 'మసూర్ పప్పు', malayalam: 'മസൂർ പരിപ്പ്', quantity: '1/2 cup' },
                { name: 'Black Gram (Whole)', common: true, confidence: [88, 92], tamil: 'கருப்பு உளுந்து', telugu: 'నల్లమినుములు', malayalam: 'കരുത്തുഴുന്ന്', quantity: '1/4 cup' }
            ],
            grains: [
                { name: 'Raw Rice', common: true, confidence: [96, 99], tamil: 'பச்சை அரிசி', telugu: 'బియ్యం', malayalam: 'അരി', quantity: '2 cups' },
                { name: 'Parboiled Rice', common: true, confidence: [94, 98], tamil: 'புழுங்கல் அரிசி', telugu: 'ఉసిరిబియ్యం', malayalam: 'ഉത്തപ്പം അരി', quantity: '2 cups' },
                { name: 'Basmati Rice', common: true, confidence: [92, 96], tamil: 'பாஸ்மதி அரிசி', telugu: 'బాస్మతి బియ్యం', malayalam: 'ബാസ്മതി അരി', quantity: '1 cup' },
                { name: 'Sona Masuri Rice', common: true, confidence: [93, 97], tamil: 'சோனா மசூரி அரிசி', telugu: 'సోనమసూరి బియ్యం', malayalam: 'സോണാമസൂരി അരി', quantity: '2 cups' },
                { name: 'Ragi (Finger Millet)', common: true, confidence: [87, 91], tamil: 'கேழ்வரகு', telugu: 'రాగులు', malayalam: 'രാഗി', quantity: '1/2 cup' },
                { name: 'Jowar (Sorghum)', common: true, confidence: [85, 89], tamil: 'சோளம்', telugu: 'జొన్నలు', malayalam: 'ചോളം', quantity: '1/2 cup' }
            ],
            oils_and_fats: [
                { name: 'Sesame Oil', common: true, confidence: [95, 99], tamil: 'நல்லெண்ணெய்', telugu: 'నువ్వుల నూనె', malayalam: 'എള്ളെണ്ണ', quantity: '2 tbsp' },
                { name: 'Coconut Oil', common: true, confidence: [94, 98], tamil: 'தேங்காய் எண்ணெய்', telugu: 'కొబ్బరి నూనె', malayalam: 'തേങ്ങാ എണ്ണ', quantity: '2 tbsp' },
                { name: 'Ghee', common: true, confidence: [93, 97], tamil: 'நெய்', telugu: 'నెయ్యి', malayalam: 'നെയ്യ്', quantity: '1 tbsp' },
                { name: 'Groundnut Oil', common: true, confidence: [91, 95], tamil: 'கடலை எண்ணெய்', telugu: 'వేరుశెనగ నూనె', malayalam: 'നിലക്കടല എണ്ണ', quantity: '2 tbsp' }
            ],
            others: [
                { name: 'Tamarind', common: true, confidence: [92, 96], tamil: 'புளி', telugu: 'చింతపండు', malayalam: 'പുളി', quantity: 'lemon-sized ball' },
                { name: 'Jaggery', common: true, confidence: [90, 94], tamil: 'வெல்லம்', telugu: 'బెల్లం', malayalam: 'ശർക്കര', quantity: '2 tbsp' },
                { name: 'Fresh Coconut', common: true, confidence: [95, 99], tamil: 'தேங்காய்', telugu: 'కొబ్బరి', malayalam: 'തേങ്ങ', quantity: '1/2 cup grated' },
                { name: 'Coconut Milk', common: true, confidence: [91, 95], tamil: 'தேங்காய் பால்', telugu: 'కొబ్బరి పాలు', malayalam: 'തേങ്ങാപ്പാൽ', quantity: '1 cup' },
                { name: 'Curd (Yogurt)', common: true, confidence: [94, 98], tamil: 'தயிர்', telugu: 'పెరుగు', malayalam: 'തൈര്', quantity: '1/2 cup' },
                { name: 'Buttermilk', common: true, confidence: [89, 93], tamil: 'மோர்', telugu: 'మజ్జిగ', malayalam: 'മോര്', quantity: '1 cup' },
                { name: 'Salt', common: true, confidence: [98, 99], tamil: 'உப்பு', telugu: 'ఉప్పు', malayalam: 'ഉപ്പ്', quantity: 'to taste' },
                { name: 'Dried Red Chilies', common: true, confidence: [91, 95], tamil: 'காய்ந்த மிளகாய்', telugu: 'ఎండుమిర్చి', malayalam: 'ഉണക്കമുളക്', quantity: '3-4 pieces' },
                { name: 'Banana Leaves', common: true, confidence: [88, 92], tamil: 'வாழை இலை', telugu: 'అరటాకు ఆకులు', malayalam: 'വാഴയില', quantity: 'for serving' }
            ]
        };

        this.cookingTechniques = [
            { name: 'Thalippu (Tempering)', confidence: [94, 98], tamil: 'தாளிப்பு', telugu: 'తాళింపు', malayalam: 'താളിക്കൽ', description: 'Traditional South Indian tempering with mustard seeds and curry leaves' },
            { name: 'Pressure Cooking', confidence: [96, 99], tamil: 'பிரஷர் குக்கிங்', telugu: 'ప్రెషర్ కుకింగ్', malayalam: 'പ്രഷർ കുക്കിംഗ്', description: 'High-pressure cooking for dal and rice' },
            { name: 'Steam Cooking', confidence: [93, 97], tamil: 'ஆவியில் வேக வைத்தல்', telugu: 'ఆవిరిమీద వండటం', malayalam: 'ആവിയിൽ വേവിക്കൽ', description: 'Steaming idli, puttu, and other dishes' },
            { name: 'Wet Grinding', confidence: [91, 95], tamil: 'ஈர அரைத்தல்', telugu: 'తడిగా రుబ్బడం', malayalam: 'നനഞ്ഞ് പൊടിക്കൽ', description: 'Stone grinding for batter preparation' },
            { name: 'Dry Roasting', confidence: [89, 93], tamil: 'வறுத்தல்', telugu: 'వేయించడం', malayalam: 'വറുത്തൽ', description: 'Dry roasting spices and lentils' },
            { name: 'Tadka/Popu Method', confidence: [95, 99], tamil: 'தாளிப்பு முறை', telugu: 'పోపు పద్ధతి', malayalam: 'താളിക്കൽ രീതി', description: 'Seasoning with hot oil and spices' },
            { name: 'Kootu Preparation', confidence: [87, 91], tamil: 'கூட்டு தயாரிப்பு', telugu: 'కూట తయారీ', malayalam: 'കൂട്ട് തയ്യാറാക്കൽ', description: 'Mixed vegetable and lentil curry' },
            { name: 'Poriyal Technique', confidence: [90, 94], tamil: 'பொரியல் முறை', telugu: 'పొరియల్ పద్ధతి', malayalam: 'പൊരിയാൽ രീതി', description: 'Stir-fry with coconut and spices' },
            { name: 'Rasam Making', confidence: [92, 96], tamil: 'ரசம் செய்முறை', telugu: 'రసం తయారీ', malayalam: 'രസം ഉണ്ടാക്കൽ', description: 'Traditional South Indian soup preparation' },
            { name: 'Sambar Cooking', confidence: [94, 98], tamil: 'சாம்பார் சமையல்', telugu: 'సాంబార్ వంట', malayalam: 'സാമ്പാർ പാചകം', description: 'Lentil-based vegetable stew cooking' },
            { name: 'Aviyal Method', confidence: [85, 89], tamil: 'அவியல் முறை', telugu: 'అవియల్ పద్ధతి', malayalam: 'അവിയൽ രീതി', description: 'Mixed vegetable curry with coconut' },
            { name: 'Thoran Preparation', confidence: [88, 92], tamil: 'தோரன் தயாரிப்பு', telugu: 'తోరన్ తయారీ', malayalam: 'തോരൻ തയ്യാറാക്കൽ', description: 'Kerala-style vegetable stir-fry with coconut' }
        ];

        this.recipeTemplates = {
            sambar: {
                name: 'Traditional Tamil Sambar',
                baseIngredients: ['Toor Dal (Pigeon Pea)', 'Sambar Powder', 'Tamarind', 'Turmeric Powder', 'Drumstick', 'Small Onion'],
                techniques: ['Sambar Cooking', 'Thalippu (Tempering)', 'Pressure Cooking'],
                time: 35,
                difficulty: 'Medium',
                cuisine: 'Tamil Nadu',
                region: 'South India'
            },
            rasam: {
                name: 'Traditional Tamil Rasam',
                baseIngredients: ['Toor Dal (Pigeon Pea)', 'Rasam Powder', 'Tamarind', 'Tomato', 'Curry Leaves', 'Mustard Seeds'],
                techniques: ['Rasam Making', 'Thalippu (Tempering)'],
                time: 25,
                difficulty: 'Easy',
                cuisine: 'Tamil Nadu',
                region: 'South India'
            },
            poriyal: {
                name: 'Traditional South Indian Poriyal',
                baseIngredients: ['Fresh Coconut', 'Mustard Seeds', 'Curry Leaves', 'Turmeric Powder', 'Green Chili'],
                techniques: ['Poriyal Technique', 'Thalippu (Tempering)', 'Dry Roasting'],
                time: 20,
                difficulty: 'Easy',
                cuisine: 'South Indian',
                region: 'Tamil Nadu/Karnataka'
            },
            kootu: {
                name: 'Traditional South Indian Kootu',
                baseIngredients: ['Moong Dal', 'Fresh Coconut', 'Cumin Seeds', 'Green Chili', 'Turmeric Powder'],
                techniques: ['Kootu Preparation', 'Wet Grinding', 'Pressure Cooking'],
                time: 30,
                difficulty: 'Medium',
                cuisine: 'South Indian',
                region: 'Tamil Nadu/Kerala'
            },
            aviyal: {
                name: 'Traditional Kerala Aviyal',
                baseIngredients: ['Mixed Vegetables', 'Fresh Coconut', 'Cumin Seeds', 'Green Chili', 'Curry Leaves', 'Coconut Oil'],
                techniques: ['Aviyal Method', 'Wet Grinding'],
                time: 35,
                difficulty: 'Medium',
                cuisine: 'Kerala',
                region: 'South India'
            },
            thoran: {
                name: 'Traditional Kerala Thoran',
                baseIngredients: ['Fresh Coconut', 'Mustard Seeds', 'Curry Leaves', 'Dried Red Chilies', 'Turmeric Powder'],
                techniques: ['Thoran Preparation', 'Thalippu (Tempering)', 'Dry Roasting'],
                time: 15,
                difficulty: 'Easy',
                cuisine: 'Kerala',
                region: 'South India'
            }
        };

        // Enhanced language processing
        this.languagePatterns = {
            tamil: {
                cookingTerms: ['வதக்கவும்', 'கலக்கவும்', 'சேர்க்கவும்', 'வேக வைக்கவும்', 'தாளிக்கவும்', 'அரைக்கவும்'],
                quantities: ['கப்', 'டீஸ்பூன்', 'டேபிள்ஸ்பூன்', 'கிராம்', 'கிலோ'],
                timeWords: ['நிமிடம்', 'மணி', 'வினாடி']
            },
            telugu: {
                cookingTerms: ['వేయించు', 'కలపండి', 'చేర్చండి', 'ఉడికించండి', 'తాళించండి', 'రుబ్బండి'],
                quantities: ['కప్పు', 'టీస్పూన్', 'టేబుల్స్పూన్', 'గ్రాములు', 'కిలో'],
                timeWords: ['నిమిషాలు', 'గంట', 'సెకన్లు']
            },
            malayalam: {
                cookingTerms: ['വറുക്കുക', 'കലക്കുക', 'ചേർക്കുക', 'വേവിക്കുക', 'താളിക്കുക', 'പൊടിക്കുക'],
                quantities: ['കപ്പ്', 'ടീസ്പൂൺ', 'ടേബിൾസ്പൂൺ', 'ഗ്രാം', 'കിലോ'],
                timeWords: ['മിനിറ്റ്', 'മണിക്കൂർ', 'സെക്കൻഡ്']
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
        // Enhanced multilingual audio transcription simulation
        const multilingualTranscripts = {
            tamil: [
                "முதலில் கடாயில் நல்லெண்ணெய் விட்டு சூடாக்கவும்... First heat sesame oil in the kadai...",
                "கடுகு போட்டு தாளித்ததும் சீரகம் சேர்க்கவும்... Add mustard seeds, when they splutter add cumin seeds...",
                "கறிவேப்பிலை சேர்த்து நறுமணம் வரும் வரை வதக்கவும்... Add curry leaves and sauté until fragrant...",
                "சின்ன வெங்காயம் சேர்த்து பொன்னிறமாக வதக்கவும்... Add small onions and sauté until golden brown...",
                "இஞ்சி பூண்டு விழுது சேர்த்து கச்சா வாசனை போகும் வரை வதக்கவும்... Add ginger-garlic paste and sauté until raw smell disappears...",
                "தக்காளி சேர்த்து நன்றாக மசித்து எண்ணெய் பிரியும் வரை வதக்கவும்... Add tomatoes, mash well and cook until oil separates...",
                "மஞ்சள் தூள், மிளகாய் தூள், சாம்பார் பொடி சேர்க்கவும்... Add turmeric powder, red chili powder, and sambar powder...",
                "புளி கரைத்த நீர் சேர்த்து கொதிக்க விடுங்கள்... Add tamarind water and bring to boil...",
                "வேக வைத்த துவரம் பருப்பு சேர்த்து கலக்கவும்... Add cooked toor dal and mix well...",
                "உப்பு சேர்த்து ருசி பார்த்து 10 நிமிடம் கொதிக்க விடுங்கள்... Add salt to taste and simmer for 10 minutes..."
            ],
            telugu: [
                "మొదట కడాయిలో నూనె వేసి వేడిచేయండి... First heat oil in the kadai...",
                "ఆవాలు వేసి తాళించిన తర్వాత జీలకర్ర చేర్చండి... Add mustard seeds, after tempering add cumin seeds...",
                "కరివేపాకు చేర్చి వాసన వచ్చే వరకు వేయించండి... Add curry leaves and fry until fragrant...",
                "చిన్న ఉల్లిపాయలు చేర్చి బంగారు రంగు వచ్చే వరకు వేయించండి... Add small onions and fry until golden...",
                "అల్లం వెల్లుల్లి పేస్ట్ చేర్చి పచ్చి వాసన పోయే వరకు వేయించండి... Add ginger-garlic paste and fry until raw smell goes...",
                "టమాటోలు చేర్చి బాగా మెత్తగా చేసి నూనె వేరు అయ్యే వరకు వండండి... Add tomatoes, mash well and cook until oil separates...",
                "పసుపు పొడి, మిరపకాయ పొడి, సాంబార్ పొడి చేర్చండి... Add turmeric powder, red chili powder, and sambar powder...",
                "చింతపండు రసం చేర్చి మరిగించండి... Add tamarind extract and bring to boil...",
                "వేడిన కందిపప్పు చేర్చి కలపండి... Add cooked toor dal and mix...",
                "ఉప్పు చేర్చి రుచి చూసి 10 నిమిషాలు ఉడికించండి... Add salt to taste and simmer for 10 minutes..."
            ],
            malayalam: [
                "ആദ്യം കടായിൽ എണ്ണ ചേർത്ത് ചൂടാക്കുക... First heat oil in the kadai...",
                "കടുക് ചേർത്ത് പൊട്ടിച്ച ശേഷം ജീരകം ചേർക്കുക... Add mustard seeds, after spluttering add cumin...",
                "കറിവേപ്പില ചേർത്ത് മണം വരുന്നത് വരെ വറുക്കുക... Add curry leaves and fry until fragrant...",
                "ചെറിയ ഉള്ളി ചേർത്ത് സ്വർണ്ണ നിറം വരുന്നത് വരെ വറുക്കുക... Add small onions and fry until golden...",
                "ഇഞ്ചി വെളുത്തുള്ളി പേസ്റ്റ് ചേർത്ത് അസംസ്കൃത മണം പോകുന്നത് വരെ വറുക്കുക... Add ginger-garlic paste and fry until raw smell goes...",
                "തക്കാളി ചേർത്ത് നന്നായി ചതച്ച് എണ്ണ വേർപെടുന്നത് വരെ വേവിക്കുക... Add tomatoes, mash well and cook until oil separates...",
                "മഞ്ഞൾ പൊടി, മുളക് പൊടി, സാമ്പാർ പൊടി ചേർക്കുക... Add turmeric powder, chili powder, and sambar powder...",
                "പുളി വെള്ളം ചേർത്ത് തിളപ്പിക്കുക... Add tamarind water and bring to boil...",
                "വേവിച്ച തുവര പരിപ്പ് ചേർത്ത് കലക്കുക... Add cooked toor dal and mix...",
                "ഉപ്പ് ചേർത്ത് രുചി നോക്കി 10 മിനിറ്റ് തിളപ്പിക്കുക... Add salt to taste and simmer for 10 minutes..."
            ]
        };
        
        // Randomly select language and generate realistic transcript
        const languages = ['tamil', 'telugu', 'malayalam'];
        const selectedLanguage = languages[Math.floor(Math.random() * languages.length)];
        const transcripts = multilingualTranscripts[selectedLanguage];
        const selectedTranscripts = transcripts.slice(0, Math.floor(Math.random() * 4) + 4);
        const transcript = selectedTranscripts.join(' ');
        
        return {
            success: true,
            data: {
                transcript: transcript,
                duration: videoFile.duration || 180,
                language: 'Multilingual (Tamil/Telugu/Malayalam/English)',
                detectedLanguage: selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1),
                model: this.models.whisper,
                confidence: Math.floor(Math.random() * 8) + 92 // 92-99% confidence
            }
        };
    }

    async detectIngredients(videoFile) {
        // Enhanced South Indian ingredient detection
        const selectedIngredients = [];
        const categories = Object.keys(this.ingredientDatabase);
        
        // Ensure we have authentic South Indian ingredient combinations
        categories.forEach(category => {
            const items = this.ingredientDatabase[category];
            let count;
            
            // Prioritize essential South Indian ingredients
            if (category === 'spices') {
                count = Math.floor(Math.random() * 4) + 3; // 3-6 spices
            } else if (category === 'vegetables') {
                count = Math.floor(Math.random() * 3) + 2; // 2-4 vegetables
            } else if (category === 'proteins') {
                count = Math.floor(Math.random() * 2) + 1; // 1-2 proteins
            } else {
                count = Math.floor(Math.random() * 2) + 1; // 1-2 others
            }
            
            for (let i = 0; i < count && i < items.length; i++) {
                const item = items[Math.floor(Math.random() * items.length)];
                if (!selectedIngredients.find(ing => ing.name === item.name)) {
                    const confidence = Math.floor(
                        Math.random() * (item.confidence[1] - item.confidence[0]) + item.confidence[0]
                    );
                    
                    selectedIngredients.push({
                        name: item.name,
                        category: category,
                        quantity: item.quantity || this.generateQuantity(item.name),
                        confidence: confidence,
                        detected: true,
                        tamil: item.tamil || '',
                        telugu: item.telugu || '',
                        malayalam: item.malayalam || ''
                    });
                }
            }
        });

        // Ensure we have essential South Indian base ingredients
        const essentialIngredients = [
            { name: 'Mustard Seeds', category: 'spices', quantity: '1 tsp', confidence: 95 },
            { name: 'Curry Leaves', category: 'spices', quantity: '8-10 leaves', confidence: 96 },
            { name: 'Turmeric Powder', category: 'spices', quantity: '1/2 tsp', confidence: 94 }
        ];

        essentialIngredients.forEach(essential => {
            if (!selectedIngredients.find(ing => ing.name === essential.name)) {
                selectedIngredients.push({
                    ...essential,
                    detected: true,
                    tamil: this.getTranslation(essential.name, 'tamil'),
                    telugu: this.getTranslation(essential.name, 'telugu'),
                    malayalam: this.getTranslation(essential.name, 'malayalam')
                });
            }
        });

        const finalIngredients = selectedIngredients.slice(0, 14); // Limit to 14 ingredients

        return {
            success: true,
            data: {
                ingredients: finalIngredients,
                totalDetected: finalIngredients.length,
                model: this.models.yolo,
                processingTime: Math.floor(Math.random() * 3) + 2 // 2-4 seconds
            }
        };
    }

    async recognizeTechniques(videoFile) {
        // Enhanced South Indian cooking technique recognition
        const techniqueCount = Math.floor(Math.random() * 3) + 3; // 3-5 techniques
        const selectedTechniques = [];
        
        // Prioritize essential South Indian techniques
        const essentialTechniques = [
            'Thalippu (Tempering)',
            'Pressure Cooking',
            'Steam Cooking'
        ];
        
        // Add essential techniques first
        essentialTechniques.forEach(essentialName => {
            const technique = this.cookingTechniques.find(t => t.name === essentialName);
            if (technique && selectedTechniques.length < techniqueCount) {
                const confidence = Math.floor(
                    Math.random() * (technique.confidence[1] - technique.confidence[0]) + technique.confidence[0]
                );
                
                selectedTechniques.push({
                    name: technique.name,
                    confidence: confidence,
                    timestamp: Math.floor(Math.random() * 150) + 30, // 30-180 seconds
                    description: technique.description,
                    tamil: technique.tamil || '',
                    telugu: technique.telugu || '',
                    malayalam: technique.malayalam || ''
                });
            }
        });
        
        // Add additional techniques
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
                    timestamp: Math.floor(Math.random() * 150) + 30,
                    description: technique.description,
                    tamil: technique.tamil || '',
                    telugu: technique.telugu || '',
                    malayalam: technique.malayalam || ''
                });
            }
        }

        return {
            success: true,
            data: {
                techniques: selectedTechniques.slice(0, techniqueCount),
                model: this.models.resnet,
                processingAccuracy: Math.floor(Math.random() * 8) + 92 // 92-99% accuracy
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
                instruction: "Add tamarind extract and bring to a boil. Let it simmer for 5 minutes.",
                time: "5 minutes",
                technique: "Tamarind Cooking",
                temperature: "Medium heat"
            });
        }

        // Add final seasoning step
        baseSteps.push({
            step: baseSteps.length + 1,
            instruction: "Add salt to taste and garnish with fresh coriander leaves. Serve hot with rice.",
            time: "1 minute",
            technique: "Final Seasoning",
            temperature: "Low heat"
        });

        return baseSteps;
    }

    categorizeRecipe(ingredients) {
        if (ingredients.some(ing => ing.name.includes('Dal') || ing.name.includes('Lentils'))) {
            return 'Curry/Gravy';
        } else if (ingredients.some(ing => ing.name.includes('Rice'))) {
            return 'Rice Dish';
        } else if (ingredients.some(ing => ing.category === 'vegetables')) {
            return 'Vegetable Dish';
        } else {
            return 'Traditional South Indian';
        }
    }

    generateNutritionInfo(ingredients) {
        // Simplified nutrition calculation based on ingredients
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;

        ingredients.forEach(ing => {
            if (ing.category === 'proteins') {
                calories += 150;
                protein += 12;
                carbs += 20;
                fat += 2;
            } else if (ing.category === 'grains') {
                calories += 200;
                protein += 4;
                carbs += 45;
                fat += 1;
            } else if (ing.category === 'vegetables') {
                calories += 25;
                protein += 1;
                carbs += 5;
                fat += 0.2;
            } else if (ing.category === 'oils_and_fats') {
                calories += 120;
                fat += 14;
            }
        });

        return {
            calories: Math.round(calories),
            protein: Math.round(protein),
            carbohydrates: Math.round(carbs),
            fat: Math.round(fat),
            fiber: Math.round(carbs * 0.1),
            sodium: Math.round(calories * 0.5)
        };
    }

    generateCookingTips(techniques) {
        const tips = [
            "Always heat oil properly before adding mustard seeds for better tempering.",
            "Use fresh curry leaves for authentic South Indian flavor.",
            "Soak tamarind in warm water for easier extraction.",
            "Cook tomatoes until oil separates for rich flavor.",
            "Adjust spice levels according to your preference.",
            "Use traditional clay pots for enhanced taste when possible.",
            "Fresh coconut gives better flavor than dried coconut.",
            "Don't skip the tempering step - it's essential for South Indian dishes."
        ];

        // Select 3-4 random tips
        const selectedTips = [];
        for (let i = 0; i < 4; i++) {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            if (!selectedTips.includes(randomTip)) {
                selectedTips.push(randomTip);
            }
        }

        return selectedTips;
    }

    calculateConfidenceScores(results) {
        const ingredientConfidences = results.processingSteps
            .find(step => step.data.ingredients)?.data.ingredients
            .map(ing => ing.confidence) || [];
        
        const techniqueConfidences = results.processingSteps
            .find(step => step.data.techniques)?.data.techniques
            .map(tech => tech.confidence) || [];

        const avgIngredientConfidence = ingredientConfidences.length > 0 
            ? ingredientConfidences.reduce((a, b) => a + b, 0) / ingredientConfidences.length 
            : 0;
        
        const avgTechniqueConfidence = techniqueConfidences.length > 0 
            ? techniqueConfidences.reduce((a, b) => a + b, 0) / techniqueConfidences.length 
            : 0;

        return {
            overall: Math.round((avgIngredientConfidence + avgTechniqueConfidence) / 2),
            ingredients: Math.round(avgIngredientConfidence),
            techniques: Math.round(avgTechniqueConfidence),
            recipe: Math.floor(Math.random() * 10) + 85 // 85-94%
        };
    }

    getTranslation(ingredientName, language) {
        // Find ingredient in database and return translation
        for (const category of Object.values(this.ingredientDatabase)) {
            const ingredient = category.find(item => item.name === ingredientName);
            if (ingredient && ingredient[language]) {
                return ingredient[language];
            }
        }
        return '';
    }

    generateQuantity(ingredientName) {
        const quantities = ['1 cup', '1/2 cup', '1 tsp', '1 tbsp', '2 pieces', '100g', '200g', 'to taste'];
        return quantities[Math.floor(Math.random() * quantities.length)];
    }

    getVideoInfo(videoFile) {
        return {
            name: videoFile.name || 'Traditional South Indian Cooking Video',
            size: videoFile.size || Math.floor(Math.random() * 50) + 10 + ' MB',
            duration: videoFile.duration || Math.floor(Math.random() * 300) + 120 + ' seconds',
            format: 'MP4',
            resolution: '1080p'
        };
    }

    updateProcessingUI(step, result) {
        // This would update the UI in a real implementation
        console.log(`Step ${step.name} completed:`, result);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}