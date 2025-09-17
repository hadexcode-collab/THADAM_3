// Authentication Management
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.currentSession = null;
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        return {
            isValid: password.length >= 6,
            message: password.length >= 6 ? '' : 'Password must be at least 6 characters long'
        };
    }

    // Register new user
    register(email, password, userType) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            return {
                success: false,
                message: 'User already exists with this email'
            };
        }

        // Validate input
        if (!this.validateEmail(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address'
            };
        }

        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.isValid) {
            return {
                success: false,
                message: passwordValidation.message
            };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: this.hashPassword(password), // In real app, use proper hashing
            userType: userType,
            createdAt: new Date().toISOString(),
            profile: {
                name: '',
                avatar: '',
                preferences: {}
            }
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        return {
            success: true,
            message: 'Account created successfully',
            user: newUser
        };
    }

    // Login user
    login(email, password, userType) {
        // For demo purposes, accept any valid email/password combination
        if (!this.validateEmail(email)) {
            return {
                success: false,
                message: 'Please enter a valid email address'
            };
        }

        if (password.length < 3) {
            return {
                success: false,
                message: 'Password is too short'
            };
        }

        // Create session
        const user = {
            id: Date.now().toString(),
            email: email,
            userType: userType,
            loginTime: new Date().toISOString()
        };

        this.currentSession = {
            user: user,
            sessionId: this.generateSessionId(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        localStorage.setItem('currentSession', JSON.stringify(this.currentSession));

        return {
            success: true,
            message: 'Login successful',
            user: user,
            session: this.currentSession
        };
    }

    // Logout user
    logout() {
        this.currentSession = null;
        localStorage.removeItem('currentSession');
        return {
            success: true,
            message: 'Logged out successfully'
        };
    }

    // Check if user is authenticated
    isAuthenticated() {
        const session = localStorage.getItem('currentSession');
        if (!session) return false;

        const parsedSession = JSON.parse(session);
        const now = new Date().toISOString();

        // Check if session has expired
        if (now > parsedSession.expiresAt) {
            this.logout();
            return false;
        }

        this.currentSession = parsedSession;
        return true;
    }

    // Get current user
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        return this.currentSession.user;
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.isAuthenticated()) {
            return {
                success: false,
                message: 'Not authenticated'
            };
        }

        const userIndex = this.users.findIndex(
            user => user.id === this.currentSession.user.id
        );

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        // Update user profile
        this.users[userIndex] = {
            ...this.users[userIndex],
            profile: {
                ...this.users[userIndex].profile,
                ...updates
            },
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(this.users));

        // Update current session
        this.currentSession.user = {
            ...this.currentSession.user,
            profile: this.users[userIndex].profile
        };

        localStorage.setItem('currentSession', JSON.stringify(this.currentSession));

        return {
            success: true,
            message: 'Profile updated successfully',
            user: this.users[userIndex]
        };
    }

    // Simple password hashing (for demo purposes only)
    hashPassword(password) {
        // In a real application, use bcrypt or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    // Generate session ID
    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15) + 
               Date.now().toString();
    }

    // Get user statistics
    getUserStats(userId) {
        const user = this.users.find(user => user.id === userId);
        if (!user) return null;

        // Calculate stats based on stored data
        const recipes = JSON.parse(localStorage.getItem(`recipes_${userId}`) || '[]');
        const savedRecipes = JSON.parse(localStorage.getItem(`saved_${userId}`) || '[]');

        return {
            totalRecipes: recipes.length,
            savedRecipes: savedRecipes.length,
            joinDate: user.createdAt,
            lastLogin: user.lastLoginAt || user.createdAt,
            userType: user.userType
        };
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        if (!this.isAuthenticated()) {
            return {
                success: false,
                message: 'Not authenticated'
            };
        }

        const userIndex = this.users.findIndex(
            user => user.id === this.currentSession.user.id
        );

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        const user = this.users[userIndex];

        // Verify current password
        if (this.hashPassword(currentPassword) !== user.password) {
            return {
                success: false,
                message: 'Current password is incorrect'
            };
        }

        // Validate new password
        const passwordValidation = this.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return {
                success: false,
                message: passwordValidation.message
            };
        }

        // Update password
        this.users[userIndex].password = this.hashPassword(newPassword);
        this.users[userIndex].updatedAt = new Date().toISOString();

        localStorage.setItem('users', JSON.stringify(this.users));

        return {
            success: true,
            message: 'Password changed successfully'
        };
    }

    // Delete account
    deleteAccount(password) {
        if (!this.isAuthenticated()) {
            return {
                success: false,
                message: 'Not authenticated'
            };
        }

        const userIndex = this.users.findIndex(
            user => user.id === this.currentSession.user.id
        );

        if (userIndex === -1) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        const user = this.users[userIndex];

        // Verify password
        if (this.hashPassword(password) !== user.password) {
            return {
                success: false,
                message: 'Password is incorrect'
            };
        }

        // Remove user data
        this.users.splice(userIndex, 1);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Clear user-specific data
        localStorage.removeItem(`recipes_${user.id}`);
        localStorage.removeItem(`saved_${user.id}`);
        
        // Logout
        this.logout();

        return {
            success: true,
            message: 'Account deleted successfully'
        };
    }
}

// Export for use in other modules
window.AuthManager = AuthManager;