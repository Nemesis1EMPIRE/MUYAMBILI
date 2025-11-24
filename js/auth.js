import { supabase } from './supabase.js';

class AuthManager {
    constructor() {
        this.initAuthModal();
    }

    initAuthModal() {
        // Ouvrir modal au clic sur les boutons
        document.querySelectorAll('.signin-btn, .signup-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showAuthModal();
                if (btn.classList.contains('signup-btn')) {
                    this.switchToTab('signup');
                }
            });
        });

        // Gestion des tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchToTab(tabName);
            });
        });

        // Fermer modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hideAuthModal();
        });

        // Forms submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Google Auth
        document.querySelectorAll('.google-auth-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleGoogleAuth();
            });
        });
    }

    showAuthModal() {
        document.getElementById('authModal').style.display = 'block';
    }

    hideAuthModal() {
        document.getElementById('authModal').style.display = 'none';
    }

    switchToTab(tabName) {
        // Mettre à jour les tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Mettre à jour les forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.toggle('active', form.id === tabName + 'Form');
        });
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            
            alert('Connexion réussie !');
            this.hideAuthModal();
            location.reload();

        } catch (error) {
            alert('Erreur de connexion: ' + error.message);
        }
    }

    async handleSignup() {
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    }
                }
            });

            if (error) throw error;
            
            alert('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
            this.hideAuthModal();

        } catch (error) {
            alert('Erreur d\'inscription: ' + error.message);
        }
    }

    async handleGoogleAuth() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/pages/account.html`
                }
            });

            if (error) throw error;

        } catch (error) {
            alert('Erreur Google Auth: ' + error.message);
        }
    }
}

// Initialisation
const authManager = new AuthManager();
export { authManager };
