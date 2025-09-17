import React, { useState } from 'react';
import { Upload, Video, GraduationCap, ChefHat, Utensils, Leaf, Heart, Star, Clock, Users } from 'lucide-react';

interface User {
  email: string;
  type: 'creator' | 'learner';
  loginTime: string;
}

interface Recipe {
  id: number;
  name: string;
  time: string;
  difficulty: string;
  cuisine: string;
  description: string;
  tags: string[];
  rating?: number;
  reviews?: number;
  isPremium?: boolean;
  chef?: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<'creator' | 'learner'>('learner');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<string>('');

  const sampleRecipes: Recipe[] = [
    {
      id: 1,
      name: 'Traditional Tamil Sambar',
      time: '45 mins',
      difficulty: 'Medium',
      cuisine: 'Tamil Nadu',
      description: 'Authentic sambar with drumsticks and traditional spices',
      tags: ['Premium', 'Traditional', 'Vegetarian'],
      rating: 4.9,
      reviews: 234,
      isPremium: true,
      chef: 'Chef Meenakshi'
    },
    {
      id: 2,
      name: 'Simple Tomato Rasam',
      time: '25 mins',
      difficulty: 'Easy',
      cuisine: 'Tamil Nadu',
      description: 'Comforting rasam perfect for daily meals',
      tags: ['Free', 'Comfort food', 'Digestive'],
      isPremium: false
    },
    {
      id: 3,
      name: 'Kerala Fish Curry',
      time: '40 mins',
      difficulty: 'Medium',
      cuisine: 'Kerala',
      description: 'Coconut-based fish curry with traditional spices',
      tags: ['Premium', 'Coastal', 'Non-veg'],
      rating: 4.8,
      reviews: 189,
      isPremium: true,
      chef: 'Chef Lakshmi'
    },
    {
      id: 4,
      name: 'Ragi Dosa',
      time: '30 mins',
      difficulty: 'Easy',
      cuisine: 'Karnataka',
      description: 'Healthy millet-based dosa for modern nutrition',
      tags: ['Free', 'Healthy', 'Breakfast'],
      isPremium: false
    }
  ];

  const dietOptions = [
    { id: 'vegetarian', title: 'Traditional Vegetarian', desc: 'Authentic South Indian vegetarian cuisine' },
    { id: 'coconut', title: 'Coconut-Based', desc: 'Kerala and coastal specialties' },
    { id: 'millet', title: 'Millet & Grain', desc: 'Traditional grains for health' },
    { id: 'spicy', title: 'Spice-Rich', desc: 'Chettinad and Andhra style' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      email: 'user@example.com',
      type: selectedUserType,
      loginTime: new Date().toISOString()
    };
    
    setCurrentUser(user);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-12 w-full max-w-2xl shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4">
              TADAM
            </h1>
            <p className="text-white/90 text-xl font-semibold mb-2">
              Traditional AI-Driven Authentic Meals
            </p>
            <p className="text-white/70 text-lg italic">
              Preserving South Indian culinary heritage
            </p>
          </div>

          <div className="flex gap-6 mb-12">
            <div 
              className={`flex-1 p-8 text-center bg-white/5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedUserType === 'learner' 
                  ? 'border-orange-400 bg-orange-400/15 transform -translate-y-2' 
                  : 'border-orange-300/20 hover:border-orange-400/40'
              }`}
              onClick={() => setSelectedUserType('learner')}
            >
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h3 className="text-white text-xl font-semibold mb-2">Learner</h3>
              <p className="text-white/70 text-sm">Learn traditional recipes</p>
            </div>
            
            <div 
              className={`flex-1 p-8 text-center bg-white/5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                selectedUserType === 'creator' 
                  ? 'border-orange-400 bg-orange-400/15 transform -translate-y-2' 
                  : 'border-orange-300/20 hover:border-orange-400/40'
              }`}
              onClick={() => setSelectedUserType('creator')}
            >
              <Video className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h3 className="text-white text-xl font-semibold mb-2">Creator</h3>
              <p className="text-white/70 text-sm">Upload cooking videos</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-4 bg-white/10 border border-orange-300/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input 
                type="password" 
                className="w-full p-4 bg-white/10 border border-orange-300/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                `Sign In as ${selectedUserType === 'learner' ? 'Learner' : 'Creator'}`
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-orange-300/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ChefHat className="w-8 h-8 text-orange-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
              TADAM
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-orange-400/20 px-4 py-2 rounded-full border border-orange-300/30 flex items-center gap-2">
              {currentUser.type === 'learner' ? <GraduationCap className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              <span className="text-white font-medium capitalize">{currentUser.type}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-orange-300/30 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-lg border-b border-orange-300/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button className="flex items-center gap-2 px-6 py-4 border-b-3 border-orange-400 bg-orange-400/10">
              <Utensils className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">Kala Kitchen</span>
            </button>
            
            <button className="flex items-center gap-2 px-6 py-4 border-b-3 border-transparent hover:bg-white/5 opacity-60 cursor-not-allowed">
              <Heart className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">My Recipes</span>
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg text-xs font-semibold">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {currentUser.type === 'creator' ? (
          // Creator Content
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-12 max-w-2xl mx-auto">
              <Upload className="w-16 h-16 mx-auto mb-6 text-orange-400" />
              <h2 className="text-4xl font-bold text-white mb-4">Upload Your Cooking Video</h2>
              <p className="text-white/80 text-lg mb-8">
                Share your traditional South Indian recipes with AI analysis
              </p>
              <div className="border-2 border-dashed border-orange-300/40 rounded-2xl p-12 hover:border-orange-400/60 transition-all duration-300 cursor-pointer">
                <Video className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-white/60 text-sm">MP4, MOV, or AVI (max 100MB)</p>
              </div>
            </div>
          </div>
        ) : (
          // Learner Content - Simplified Premium Platform
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Diet Preferences */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Diet Style</h2>
                <div className="space-y-4">
                  {dietOptions.map((diet) => (
                    <div
                      key={diet.id}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        selectedDiet === diet.id
                          ? 'border-orange-400 bg-orange-400/20'
                          : 'border-orange-300/30 bg-white/5 hover:border-orange-400/50'
                      }`}
                      onClick={() => setSelectedDiet(diet.id)}
                    >
                      <Leaf className="w-6 h-6 text-orange-400 mb-2" />
                      <h3 className="text-white font-semibold mb-1">{diet.title}</h3>
                      <p className="text-white/70 text-sm">{diet.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Ayurveda Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Ayurvedic Recipes</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Vata Balancing', count: 127, desc: 'Warm, nourishing foods' },
                      { name: 'Pitta Cooling', count: 89, desc: 'Cooling, mild dishes' },
                      { name: 'Kapha Energizing', count: 156, desc: 'Light, spicy foods' }
                    ].map((dosha) => (
                      <div key={dosha.name} className="p-3 rounded-xl bg-white/5 border border-orange-300/20">
                        <h4 className="text-white font-semibold">{dosha.name}</h4>
                        <p className="text-white/70 text-sm">{dosha.desc}</p>
                        <div className="text-orange-400 text-xs font-semibold mt-1">{dosha.count} recipes</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Recipe Grid */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4">
                  Traditional South Indian Recipes
                </h1>
                <p className="text-white/80 text-lg">
                  Learn authentic recipes from master chefs
                </p>
              </div>

              {/* Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {sampleRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                    <div className="h-48 bg-gradient-to-br from-orange-600 to-red-600 relative">
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        recipe.isPremium 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {recipe.isPremium ? 'PREMIUM' : 'FREE'}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-white font-bold text-lg mb-1">{recipe.name}</h3>
                        <p className="text-white/80 text-sm">{recipe.description}</p>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {recipe.chef && (
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                            {recipe.chef.charAt(5)}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-sm">{recipe.chef}</h4>
                            <p className="text-white/70 text-xs">{recipe.cuisine} specialist</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-white/80 text-sm">
                        {recipe.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{recipe.rating} ({recipe.reviews} reviews)</span>
                          </div>
                        ) : (
                          <div className="text-orange-400 font-semibold">
                            <span>Nutritious & Healthy</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Premium Promotion */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Master Traditional South Indian Cooking</h2>
                <p className="text-white/90 text-lg mb-6">
                  Unlock 500+ authentic family recipes passed down through generations
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/20 rounded-xl p-4">
                    <Users className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="text-white font-bold">15,000+ Learners</h3>
                    <p className="text-white/80 text-sm">Join our community</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <ChefHat className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="text-white font-bold">Master Chefs</h3>
                    <p className="text-white/80 text-sm">Learn from experts</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4">
                    <Star className="w-8 h-8 text-white mx-auto mb-2" />
                    <h3 className="text-white font-bold">500+ Recipes</h3>
                    <p className="text-white/80 text-sm">Authentic collection</p>
                  </div>
                </div>
                <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-300">
                  Start Learning - ₹299/month
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;