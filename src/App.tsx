import React, { useState, useEffect } from 'react';
import { Upload, Video, GraduationCap, ChefHat, Utensils, Leaf, Donut as Coconut, Wheat, Flame, Star, Clock, Users, Heart, Share, Printer, CheckCircle, AlertTriangle } from 'lucide-react';

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
  icon: string;
  chef?: {
    name: string;
    specialty: string;
    avatar: string;
  };
  rating?: number;
  reviews?: number;
  isPremium?: boolean;
  nutrition?: {
    calories: number;
    protein: number;
    fiber: number;
  };
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState('kala-kitchen');
  const [selectedUserType, setSelectedUserType] = useState<'creator' | 'learner'>('learner');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<string>('');
  const [selectedDosha, setSelectedDosha] = useState<string>('');

  const sampleRecipes: Recipe[] = [
    {
      id: 1,
      name: 'Authentic Chettinad Sambar',
      time: '45 mins',
      difficulty: 'Medium',
      cuisine: 'Chettinad',
      description: 'Traditional family recipe passed down through generations with authentic spice blend.',
      tags: ['Premium', 'Traditional', 'Protein-rich'],
      icon: '🍛',
      chef: {
        name: 'Chef Meenakshi',
        specialty: 'Chettinad cuisine expert',
        avatar: 'M'
      },
      rating: 4.9,
      reviews: 234,
      isPremium: true
    },
    {
      id: 2,
      name: 'Simple Tomato Rasam',
      time: '25 mins',
      difficulty: 'Easy',
      cuisine: 'Tamil Nadu',
      description: 'Comforting traditional rasam perfect for daily meals.',
      tags: ['Free', 'Comfort food', 'Digestive'],
      icon: '🍲',
      isPremium: false,
      nutrition: {
        calories: 120,
        protein: 8,
        fiber: 15
      }
    },
    {
      id: 3,
      name: 'Kerala Fish Curry',
      time: '40 mins',
      difficulty: 'Medium',
      cuisine: 'Kerala',
      description: 'Coconut-based fish curry with traditional Kerala spices.',
      tags: ['Premium', 'Coastal', 'Coconut-rich'],
      icon: '🐟',
      chef: {
        name: 'Chef Lakshmi',
        specialty: 'Kerala traditional cook',
        avatar: 'L'
      },
      rating: 4.8,
      reviews: 189,
      isPremium: true
    },
    {
      id: 4,
      name: 'Ragi Dosa',
      time: '30 mins',
      difficulty: 'Easy',
      cuisine: 'Karnataka',
      description: 'Healthy millet-based dosa perfect for modern nutrition needs.',
      tags: ['Free', 'Healthy', 'Millet'],
      icon: '🥞',
      isPremium: false,
      nutrition: {
        calories: 180,
        protein: 12,
        fiber: 8
      }
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
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
    setCurrentTab('kala-kitchen');
  };

  const showToast = (message: string) => {
    // Simple toast implementation
    console.log('Toast:', message);
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
              Preserving South Indian culinary heritage through AI
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
              <p className="text-white/70 text-sm">Learn traditional South Indian recipes</p>
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
              <p className="text-white/70 text-sm">Upload cooking videos for AI analysis</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-4 bg-white/10 border border-orange-300/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/15"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input 
                type="password" 
                className="w-full p-4 bg-white/10 border border-orange-300/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/15"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 hover:-translate-y-1 shadow-lg disabled:opacity-50"
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
          <div className="flex gap-1 overflow-x-auto">
            <button
              className={`flex items-center gap-2 px-6 py-4 border-b-3 transition-all duration-300 whitespace-nowrap ${
                currentTab === 'kala-kitchen' 
                  ? 'border-orange-400 bg-orange-400/10' 
                  : 'border-transparent hover:bg-white/5'
              }`}
              onClick={() => setCurrentTab('kala-kitchen')}
            >
              <Utensils className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">Kala Kitchen</span>
            </button>
            
            <button className="flex items-center gap-2 px-6 py-4 border-b-3 border-transparent hover:bg-white/5 transition-all duration-300 whitespace-nowrap opacity-60 cursor-not-allowed">
              <Heart className="w-5 h-5 text-orange-400" />
              <span className="text-white font-medium">My Recipes</span>
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-lg text-xs font-semibold border border-yellow-400/30">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {currentTab === 'kala-kitchen' && (
          <>
            {currentUser.type === 'creator' ? (
              // Creator Content
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-12 max-w-2xl mx-auto">
                  <Upload className="w-16 h-16 mx-auto mb-6 text-orange-400" />
                  <h2 className="text-4xl font-bold text-white mb-4">Upload Your Cooking Video</h2>
                  <p className="text-white/80 text-lg mb-8">
                    Share your traditional South Indian recipes with our AI-powered analysis
                  </p>
                  <div className="border-2 border-dashed border-orange-300/40 rounded-2xl p-12 hover:border-orange-400/60 transition-all duration-300 cursor-pointer">
                    <Video className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                    <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                    <p className="text-white/60 text-sm">MP4, MOV, or AVI (max 100MB)</p>
                  </div>
                </div>
              </div>
            ) : (
              // Learner Content - Premium South Indian Platform
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-6 sticky top-6">
                    {/* Diet Preferences */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your South Indian Diet Style</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'vegetarian', icon: Leaf, title: 'Traditional Vegetarian', desc: 'Authentic South Indian vegetarian cuisine' },
                          { id: 'coconut', icon: Coconut, title: 'Coconut-Based', desc: 'Kerala and coastal cuisine specialties' },
                          { id: 'millet', icon: Wheat, title: 'Millet & Grain', desc: 'Traditional grains for modern health' },
                          { id: 'spicy', icon: Flame, title: 'Spice-Rich', desc: 'Chettinad and Andhra style dishes' }
                        ].map((diet) => (
                          <div
                            key={diet.id}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                              selectedDiet === diet.id
                                ? 'border-orange-400 bg-orange-400/20 transform -translate-y-1'
                                : 'border-orange-300/30 bg-white/5 hover:border-orange-400/50'
                            }`}
                            onClick={() => setSelectedDiet(diet.id)}
                          >
                            <diet.icon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                            <h3 className="text-white font-semibold text-sm mb-1">{diet.title}</h3>
                            <p className="text-white/70 text-xs">{diet.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ayurveda Section */}
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4 text-center">Recipes for Your Constitution</h2>
                      <div className="space-y-3">
                        {[
                          { id: 'vata', title: 'Vata Balancing', desc: 'Warm, nourishing, grounding foods', count: 127, color: 'border-l-amber-600' },
                          { id: 'pitta', title: 'Pitta Cooling', desc: 'Cooling, mild, refreshing dishes', count: 89, color: 'border-l-orange-600' },
                          { id: 'kapha', title: 'Kapha Energizing', desc: 'Light, spicy, warming foods', count: 156, color: 'border-l-green-600' }
                        ].map((dosha) => (
                          <div
                            key={dosha.id}
                            className={`p-4 rounded-xl border border-orange-300/30 bg-white/5 cursor-pointer transition-all duration-300 hover:bg-white/10 border-l-4 ${dosha.color}`}
                            onClick={() => setSelectedDosha(dosha.id)}
                          >
                            <h3 className="text-white font-semibold mb-1">{dosha.title}</h3>
                            <p className="text-white/70 text-sm mb-2">{dosha.desc}</p>
                            <div className="text-orange-400 text-xs font-semibold">{dosha.count} recipes</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-4">
                      Master Traditional South Indian Cuisine
                    </h1>
                    <p className="text-white/80 text-lg">
                      Learn authentic recipes from master chefs and traditional cooks
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
                          {recipe.chef ? (
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                                {recipe.chef.avatar}
                              </div>
                              <div>
                                <h4 className="text-white font-semibold text-sm">{recipe.chef.name}</h4>
                                <p className="text-white/70 text-xs">{recipe.chef.specialty}</p>
                              </div>
                            </div>
                          ) : null}
                          
                          <div className="flex justify-between items-center text-white/80 text-sm">
                            {recipe.rating ? (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span>{recipe.rating} ({recipe.reviews} reviews)</span>
                              </div>
                            ) : (
                              <div className="flex gap-4 text-orange-400 font-semibold">
                                <span>{recipe.nutrition?.calories} cal</span>
                                <span>{recipe.nutrition?.protein}g protein</span>
                                <span>{recipe.nutrition?.fiber}g fiber</span>
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
                    <h2 className="text-3xl font-bold text-white mb-4">🔥 Turn Your Kitchen Into Your Grandmother's</h2>
                    <p className="text-white/90 text-lg mb-6">Unlock recipes that have fed generations of South Indian families</p>
                    <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
                      Start Your Culinary Journey - ₹299/month
                    </button>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white/10 backdrop-blur-xl border border-orange-300/30 rounded-3xl p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">Traditional Nutritional Benefits</h3>
                    
                    {/* Macro Display */}
                    <div className="space-y-4 mb-6">
                      {[
                        { label: 'Calories', value: 145, unit: 'cal', width: '65%' },
                        { label: 'Protein', value: 12, unit: 'g', width: '80%' },
                        { label: 'Carbs', value: 18, unit: 'g', width: '45%' },
                        { label: 'Fiber', value: 8, unit: 'g', width: '90%' }
                      ].map((macro) => (
                        <div key={macro.label} className="flex items-center gap-3">
                          <span className="text-white font-bold text-lg min-w-[50px]">{macro.value}</span>
                          <span className="text-white/70 text-sm min-w-[60px]">{macro.unit}</span>
                          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full transition-all duration-1000"
                              style={{ width: macro.width }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ayurvedic Benefits */}
                    <div className="mb-6">
                      <h4 className="text-orange-400 font-semibold mb-3">Ayurvedic Properties</h4>
                      <ul className="space-y-2 text-white/80 text-sm">
                        <li>• Balances Vata and Pitta doshas</li>
                        <li>• Aids digestion with traditional spices</li>
                        <li>• Rich in South Indian minerals</li>
                        <li>• Cooling properties for hot climate</li>
                      </ul>
                    </div>

                    {/* Regional Benefits */}
                    <div>
                      <h4 className="text-orange-400 font-semibold mb-3">Regional Health Benefits</h4>
                      <p className="text-white/80 text-sm">
                        Adapted for South Indian climate and lifestyle. Rich in coconut-derived MCTs for sustained energy in tropical weather.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;